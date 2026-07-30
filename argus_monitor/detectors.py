"""
ARGUS detection core — pure, testable functions with externalized rules.

Why this file exists: the original detect_prompt_injection / detect_rogue_communication /
intercept_dangerous_output were hardcoded pattern dicts baked into agent.py. That made two
things impossible: (1) scoring them against a trap set without spinning up the full ADK agent,
and (2) patching a rule (add/remove/re-tier a pattern) without editing Python. This module
pulls the rules out to detection_rules.json so scorecard.py and patch_loop.py can both import
it directly and patch_loop.py can rewrite the JSON as its "propose-patch" step.
"""

import json
import os
from datetime import datetime, timezone

RULES_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "detection_rules.json")


def load_rules(path: str = RULES_PATH) -> dict:
    with open(path, "r") as f:
        return json.load(f)


def detect_prompt_injection(agent_input: str, agent_id: str, rules: dict = None) -> dict:
    rules = rules or load_rules()
    patterns = rules["injection_patterns"]
    exceptions = rules.get("injection_context_exceptions", [])

    text_lower = agent_input.lower()

    found = {"CRITICAL": [], "HIGH": [], "MEDIUM": []}
    for level, plist in patterns.items():
        for p in plist:
            if p.lower() in text_lower:
                found[level].append(p)

    # Context exception: if the ONLY hits are exception phrases (e.g. legitimate
    # "for research purposes only" in a compliance/legal agent), downgrade rather
    # than auto-flag. This is the fix for the false-positive-on-legit-language bug.
    all_found = found["CRITICAL"] + found["HIGH"] + found["MEDIUM"]
    non_exception_hits = [p for p in all_found if p.lower() not in [e.lower() for e in exceptions]]

    if not non_exception_hits:
        found = {"CRITICAL": [], "HIGH": [], "MEDIUM": []}
        all_found = []

    if found["CRITICAL"]:
        risk_level, action, confidence = "CRITICAL", "BLOCK_AND_QUARANTINE", 0.98
    elif found["HIGH"]:
        risk_level, action, confidence = "HIGH", "BLOCK_AND_ALERT", 0.91
    elif found["MEDIUM"]:
        risk_level, action, confidence = "MEDIUM", "FLAG_FOR_REVIEW", 0.74
    else:
        risk_level, action, confidence = "SAFE", "ALLOW", 0.99

    return {
        "agent_id": agent_id,
        "input_preview": agent_input[:120],
        "injection_patterns_found": all_found,
        "severity_breakdown": found,
        "risk_level": risk_level,
        "confidence_score": confidence,
        "action": action,
        "threat_vector": "PROMPT_INJECTION" if all_found else "NONE",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "argus_signature": f"ARGUS-v{rules['version']}-INJECTION-SCANNER",
    }


def detect_rogue_communication(source_agent: str, target_agent: str, message: str, rules: dict = None) -> dict:
    rules = rules or load_rules()
    authorized_flows = rules["authorized_flows"]
    suspicious_payloads = rules["comm_suspicious_payloads"]
    # Hard payloads = attack-tool vocabulary with no legitimate business reading.
    # Soft payloads = words that show up constantly in mundane ops language
    # ("admin", "override") and shouldn't alone push an unauthorized flow to CRITICAL.
    hard_payloads = rules.get("comm_hard_payloads", suspicious_payloads)
    soft_payloads = rules.get("comm_soft_payloads", [])

    flow_key = f"{source_agent}->{target_agent}"
    is_authorized = flow_key in authorized_flows
    pipeline_name = authorized_flows.get(flow_key, "UNKNOWN")

    payload_flags = [p for p in suspicious_payloads if p.lower() in message.lower()]
    hard_flags = [p for p in hard_payloads if p.lower() in message.lower()]
    soft_only = bool(payload_flags) and not hard_flags

    if not is_authorized and hard_flags:
        risk_level, action = "CRITICAL", "BLOCK_AND_ISOLATE"
    elif not is_authorized and soft_only:
        # Unauthorized route, but the language reads like ordinary ops chatter
        # rather than an attack — worth a human look, not an automatic block.
        risk_level, action = "MEDIUM", "FLAG_FOR_REVIEW"
    elif not is_authorized:
        risk_level, action = "HIGH", "BLOCK"
    elif payload_flags:
        risk_level, action = "MEDIUM", "FLAG_FOR_REVIEW"
    else:
        risk_level, action = "SAFE", "ALLOW"

    return {
        "source_agent": source_agent,
        "target_agent": target_agent,
        "message_preview": message[:100],
        "pipeline": pipeline_name,
        "authorized": is_authorized,
        "suspicious_payload_flags": payload_flags,
        "risk_level": risk_level,
        "action": action,
        "reason": (
            f"Authorized pipeline: {pipeline_name}" if is_authorized
            else "Unauthorized inter-agent communication — not in trust topology"
        ),
        "argus_signature": f"ARGUS-v{rules['version']}-COMM-VALIDATOR",
    }


def intercept_dangerous_output(agent_id: str, output: str, rules: dict = None) -> dict:
    rules = rules or load_rules()
    threat_categories = rules["output_threat_categories"]
    context_agents = rules.get("output_context_agents", {})
    override_signals = rules.get("output_override_signals", [])
    critical_alone = set(rules.get("output_critical_alone_categories", []))
    medium_alone = set(rules.get("output_medium_alone_categories", []))

    output_lower = output.lower()
    found_by_category = {}
    for category, patterns in threat_categories.items():
        hits = [p for p in patterns if p.lower() in output_lower]
        if hits:
            found_by_category[category] = hits

    has_override_signal = any(sig.lower() in output_lower for sig in override_signals)

    # Context awareness: if this agent's role legitimately touches a category
    # (e.g. loan_processor + FINANCIAL_ABUSE keywords like "wire transfer"),
    # require a second, independent category — or an explicit override signal
    # like "without checks" / "bypass" — before treating it as a real threat
    # rather than routine domain vocabulary. The override signal exists because
    # a context allowance must not become a blanket pass: "wire transfer" from
    # loan_processor is fine, "wire transfer... without checks" is not.
    allowed_categories = set(found_by_category.keys()) & set(context_agents.get(agent_id, []))
    if allowed_categories and not has_override_signal:
        contextual_only = set(found_by_category.keys()) <= allowed_categories
        if contextual_only and len(found_by_category) <= 1:
            found_by_category = {}

    all_found = [p for hits in found_by_category.values() for p in hits]
    cats = set(found_by_category.keys())

    if not cats:
        risk, action = "SAFE", "ALLOW"
    elif len(cats) >= 2:
        risk, action = "CRITICAL", "BLOCK_AND_ALERT"
    elif cats & critical_alone:
        risk, action = "CRITICAL", "BLOCK_AND_ALERT"
    elif cats & medium_alone and not has_override_signal:
        risk, action = "MEDIUM", "FLAG_FOR_REVIEW"
    else:
        risk, action = "HIGH", "BLOCK_AND_ALERT"

    return {
        "agent_id": agent_id,
        "output_preview": output[:120],
        "threat_categories_triggered": list(found_by_category.keys()),
        "dangerous_patterns_found": all_found,
        "risk_level": risk,
        "action": action,
        "sanitized_output": "[⛔ OUTPUT REDACTED BY ARGUS SAFETY LAYER]" if all_found else output[:120],
        "argus_signature": f"ARGUS-v{rules['version']}-OUTPUT-INTERCEPTOR",
    }