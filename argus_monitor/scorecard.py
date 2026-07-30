"""
ARGUS self-eval scorecard.

Runs detectors.py against trap_set.json and produces a versioned report:
  - exact match rate (predicted risk_level == expected_risk_level)
  - false positives (predicted higher severity than expected SAFE case)
  - false negatives (predicted SAFE/lower on a case expected to be a real threat)
  - per-detector breakdown

Every run is saved to scorecard_history/ with a timestamp + rules version, so you can
show a judge a literal before/after number instead of just claiming "we improved detection."

Usage:
    python scorecard.py                 # run once, print + save
    python scorecard.py --quiet         # save only, print summary line (for CI/patch_loop)
"""

import json
import os
import sys
from datetime import datetime, timezone

from detectors import detect_prompt_injection, detect_rogue_communication, intercept_dangerous_output, load_rules

HERE = os.path.dirname(os.path.abspath(__file__))
TRAP_SET_PATH = os.path.join(HERE, "trap_set.json")
HISTORY_DIR = os.path.join(HERE, "scorecard_history")

SEVERITY_ORDER = ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"]


def severity_rank(level: str) -> int:
    return SEVERITY_ORDER.index(level) if level in SEVERITY_ORDER else -1


def run_case(kind: str, case: dict, rules: dict) -> dict:
    if kind == "detect_prompt_injection":
        result = detect_prompt_injection(case["agent_input"], case["agent_id"], rules=rules)
    elif kind == "detect_rogue_communication":
        result = detect_rogue_communication(case["source_agent"], case["target_agent"], case["message"], rules=rules)
    elif kind == "detect_dangerous_output":
        result = intercept_dangerous_output(case["agent_id"], case["output"], rules=rules)
    else:
        raise ValueError(f"Unknown case kind: {kind}")
    return result


def score(trap_set: dict, rules: dict) -> dict:
    per_detector = {}
    all_rows = []

    for kind, cases in trap_set.items():
        if kind in ("version", "note"):
            continue
        rows = []
        for case in cases:
            expected = case["expected_risk_level"]
            if expected not in SEVERITY_ORDER:
                rows.append({**case, "kind": kind, "predicted": None, "status": "NEEDS_DECISION"})
                continue

            result = run_case(kind, case, rules)
            predicted = result["risk_level"]
            exact = predicted == expected
            fp = severity_rank(predicted) > severity_rank(expected) and expected == "SAFE"
            fn = severity_rank(predicted) < severity_rank(expected) and predicted == "SAFE"
            over = severity_rank(predicted) > severity_rank(expected) and not fp
            under = severity_rank(predicted) < severity_rank(expected) and not fn

            status = "PASS" if exact else ("FALSE_POSITIVE" if fp else "FALSE_NEGATIVE" if fn else
                                            "OVER_SEVERE" if over else "UNDER_SEVERE" if under else "MISMATCH")

            rows.append({
                **case, "kind": kind, "predicted": predicted, "status": status,
            })

        scored_rows = [r for r in rows if r["status"] != "NEEDS_DECISION"]
        passed = sum(1 for r in scored_rows if r["status"] == "PASS")
        total = len(scored_rows)
        per_detector[kind] = {
            "total_cases": len(rows),
            "scored_cases": total,
            "needs_decision": len(rows) - total,
            "passed": passed,
            "accuracy": round(passed / total, 3) if total else None,
            "false_positives": sum(1 for r in scored_rows if r["status"] == "FALSE_POSITIVE"),
            "false_negatives": sum(1 for r in scored_rows if r["status"] == "FALSE_NEGATIVE"),
            "over_severe": sum(1 for r in scored_rows if r["status"] == "OVER_SEVERE"),
            "under_severe": sum(1 for r in scored_rows if r["status"] == "UNDER_SEVERE"),
        }
        all_rows.extend(rows)

    scored = [r for r in all_rows if r["status"] != "NEEDS_DECISION"]
    overall_passed = sum(1 for r in scored if r["status"] == "PASS")
    overall_total = len(scored)

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "rules_version": rules.get("version"),
        "overall_accuracy": round(overall_passed / overall_total, 3) if overall_total else None,
        "overall_passed": overall_passed,
        "overall_total": overall_total,
        "per_detector": per_detector,
        "failing_cases": [r for r in all_rows if r["status"] not in ("PASS", "NEEDS_DECISION")],
        "needs_decision_cases": [r for r in all_rows if r["status"] == "NEEDS_DECISION"],
    }


def print_report(report: dict) -> None:
    print(f"\n=== ARGUS Scorecard — rules v{report['rules_version']} — {report['timestamp']} ===")
    print(f"Overall accuracy: {report['overall_accuracy']} ({report['overall_passed']}/{report['overall_total']})\n")
    for kind, stats in report["per_detector"].items():
        print(f"  {kind}: {stats['accuracy']} accuracy "
              f"({stats['passed']}/{stats['scored_cases']}) | "
              f"FP={stats['false_positives']} FN={stats['false_negatives']} "
              f"over={stats['over_severe']} under={stats['under_severe']} "
              f"needs_decision={stats['needs_decision']}")
    if report["failing_cases"]:
        print("\n  Failing cases:")
        for c in report["failing_cases"]:
            print(f"    [{c['id']}] {c['kind']} — expected {c['expected_risk_level']}, "
                  f"got {c['predicted']} ({c['status']})")
    if report["needs_decision_cases"]:
        print("\n  Needs a decision (not auto-scored):")
        for c in report["needs_decision_cases"]:
            print(f"    [{c['id']}] {c.get('note', '')}")
    print()


def save_report(report: dict) -> str:
    os.makedirs(HISTORY_DIR, exist_ok=True)
    ts = report["timestamp"].replace(":", "-")
    path = os.path.join(HISTORY_DIR, f"scorecard_{ts}_v{report['rules_version']}.json")
    with open(path, "w") as f:
        json.dump(report, f, indent=2)
    return path


def latest_previous_report():
    if not os.path.isdir(HISTORY_DIR):
        return None
    files = sorted(os.listdir(HISTORY_DIR))
    if not files:
        return None
    with open(os.path.join(HISTORY_DIR, files[-1])) as f:
        return json.load(f)


if __name__ == "__main__":
    quiet = "--quiet" in sys.argv

    with open(TRAP_SET_PATH) as f:
        trap_set = json.load(f)
    rules = load_rules()

    prev = latest_previous_report()
    report = score(trap_set, rules)

    if not quiet:
        print_report(report)
    else:
        delta = ""
        if prev and prev["overall_accuracy"] is not None and report["overall_accuracy"] is not None:
            diff = report["overall_accuracy"] - prev["overall_accuracy"]
            delta = f" ({'+' if diff >= 0 else ''}{round(diff, 3)} vs previous run)"
        print(f"accuracy={report['overall_accuracy']}{delta}")

    path = save_report(report)
    if not quiet:
        print(f"Saved: {path}")