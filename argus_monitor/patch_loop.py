"""
ARGUS root-cause -> propose-patch -> replay loop.

This is the mechanism, not a one-off script: each PATCH entry names the root cause it's
fixing, mutates a copy of detection_rules.json, and gets scored against the FULL trap set
(not just the cases it targets) before being kept. If a patch improves overall accuracy
without regressing previously-passing cases, it's committed and the rules version bumps.
If it doesn't, it's rolled back and logged as rejected — so a bad patch can't silently
ship. Run this any time a new failing case shows up in trap_set.json.

Usage:
    python patch_loop.py
"""

import copy
import json
import os
from datetime import datetime, timezone

from detectors import load_rules, RULES_PATH
from scorecard import score, TRAP_SET_PATH, save_report, print_report

HERE = os.path.dirname(os.path.abspath(__file__))
PATCH_LOG_PATH = os.path.join(HERE, "patch_log.json")


def _bump_patch(version: str) -> str:
    major, minor, patch = (int(x) for x in version.split("."))
    return f"{major}.{minor}.{patch + 1}"


# Each patch: (id, root_cause, targets [case ids it's meant to fix], apply(rules) -> rules)
PATCHES = [
    {
        "id": "patch_001_output_customer_support_refunds",
        "root_cause": (
            "customer_support wasn't in output_context_agents for FINANCIAL_ABUSE, so "
            "routine refund language ('authorized a refund payment', 'transfer funds back') "
            "was flagged HIGH like an actual unauthorized transfer."
        ),
        "targets": ["out_002"],
        "apply": lambda r: (
            r["output_context_agents"].setdefault("customer_support", []).append("FINANCIAL_ABUSE")
            or r
        ),
    },
    {
        "id": "patch_002_output_override_signals",
        "root_cause": (
            "The context-exception rule was unconditional: any allowed agent got a free pass "
            "on its listed category, even when the output explicitly said it was skipping the "
            "process ('without checks', 'bypass', 'without ticket'). Context should reduce "
            "false positives, not create a blind spot for real abuse by an insider-trusted agent."
        ),
        "targets": ["out_005", "out_008", "out_014"],
        "apply": lambda r: (
            r.update({"output_override_signals": [
                "bypass", "without ticket", "without checks", "without authorization",
                "skip verification", "skipping verification", "skipping identity verification",
            ]}) or r
        ),
    },
    {
        "id": "patch_003_output_severity_tiers",
        "root_cause": (
            "All categories used the same 'HIGH alone / CRITICAL if 2+' rule regardless of "
            "how severe the category itself is. A single DROP TABLE or exfil hit was capped "
            "at HIGH, and a single scheduled 'execute command' for routine maintenance was "
            "escalated to HIGH same as a real system-execution threat."
        ),
        "targets": ["out_003", "out_004", "out_007", "out_009"],
        "apply": lambda r: (
            r.update({
                "output_critical_alone_categories": ["DESTRUCTIVE_COMMANDS", "DATABASE_ATTACKS", "DATA_EXFILTRATION"],
                "output_medium_alone_categories": ["SYSTEM_EXECUTION"],
            }) or r
        ),
    },
    {
        "id": "patch_004_comm_hard_vs_soft_payloads",
        "root_cause": (
            "comm_suspicious_payloads mixed attack vocabulary ('sudo', 'inject', 'exfil') with "
            "ordinary ops words ('admin', 'override'). An unauthorized flow carrying only soft "
            "words ('admin requested a price override') was auto-escalated to CRITICAL same as "
            "one carrying 'sudo override exfil'."
        ),
        "targets": ["comm_006"],
        "apply": lambda r: (
            r.update({
                "comm_hard_payloads": ["execute", "sudo", "inject", "exfil"],
                "comm_soft_payloads": ["admin", "override"],
            }) or r
        ),
    },
    {
        "id": "patch_005_injection_persona_roleplay",
        "root_cause": (
            "'new persona' was in the MEDIUM pattern list but bare 'persona' (as in 'my doctor "
            "persona in this roleplay') wasn't, so fiction-framed jailbreak attempts slipped "
            "through as SAFE."
        ),
        "targets": ["inj_012"],
        "apply": lambda r: (
            r["injection_patterns"]["MEDIUM"].append("persona") or r
        ),
    },
]


def run_patch_loop():
    rules = load_rules()
    with open(TRAP_SET_PATH) as f:
        trap_set = json.load(f)

    before = score(trap_set, rules)
    print(f"BEFORE any patch: overall_accuracy={before['overall_accuracy']} "
          f"({before['overall_passed']}/{before['overall_total']})\n")

    log = []
    current_rules = copy.deepcopy(rules)
    prev_report = before

    for patch in PATCHES:
        candidate = copy.deepcopy(current_rules)
        candidate = patch["apply"](candidate)

        candidate_report = score(trap_set, candidate)

        # Did any case that was PASSING before this patch start failing? That's a
        # regression — reject even if the headline accuracy number looks flat or better.
        prev_pass_ids = {c["id"] for kind in trap_set if kind not in ("version", "note")
                          for c in trap_set[kind]} - {c["id"] for c in prev_report["failing_cases"]}
        new_fail_ids = {c["id"] for c in candidate_report["failing_cases"]}
        regressions = prev_pass_ids & new_fail_ids

        improved = (candidate_report["overall_accuracy"] or 0) > (prev_report["overall_accuracy"] or 0)
        accepted = improved and not regressions

        entry = {
            "patch_id": patch["id"],
            "root_cause": patch["root_cause"],
            "targets": patch["targets"],
            "accuracy_before": prev_report["overall_accuracy"],
            "accuracy_after": candidate_report["overall_accuracy"],
            "regressions": sorted(regressions),
            "accepted": accepted,
        }
        log.append(entry)

        status = "ACCEPTED" if accepted else "ROLLED BACK"
        print(f"[{patch['id']}] {status} — accuracy {prev_report['overall_accuracy']} -> "
              f"{candidate_report['overall_accuracy']}" +
              (f" | regressions: {regressions}" if regressions else ""))

        if accepted:
            current_rules = candidate
            current_rules["version"] = _bump_patch(current_rules["version"])
            current_rules["last_patched"] = datetime.now(timezone.utc).isoformat()
            prev_report = candidate_report

    with open(RULES_PATH, "w") as f:
        json.dump(current_rules, f, indent=2)

    with open(PATCH_LOG_PATH, "w") as f:
        json.dump(log, f, indent=2)

    after = score(trap_set, current_rules)
    print(f"\nAFTER patch loop: overall_accuracy={after['overall_accuracy']} "
          f"({after['overall_passed']}/{after['overall_total']}) — rules v{current_rules['version']}")
    print(f"Delta: {round((after['overall_accuracy'] or 0) - (before['overall_accuracy'] or 0), 3)}")
    print(f"\nFull report:")
    print_report(after)
    path = save_report(after)
    print(f"Saved final scorecard: {path}")
    print(f"Saved patch log: {PATCH_LOG_PATH}")

    if after["failing_cases"]:
        print("Remaining known gaps (tracked, not silently ignored):")
        for c in after["failing_cases"]:
            print(f"  [{c['id']}] {c['kind']} — expected {c['expected_risk_level']}, got {c['predicted']}")


if __name__ == "__main__":
    run_patch_loop()