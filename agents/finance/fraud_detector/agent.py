import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def analyze_transaction(amount: float, location: str, merchant: str, time: str) -> dict:
    """Analyze a transaction for fraud indicators."""
    risk_score = 0
    flags = []
    if amount > 10000:
        risk_score += 40
        flags.append("high_amount")
    if time in ["02:00", "03:00", "04:00"]:
        risk_score += 30
        flags.append("unusual_hour")
    if location not in ["India", "USA", "UK"]:
        risk_score += 30
        flags.append("foreign_transaction")
    return {
        "transaction": {"amount": amount, "location": location, "merchant": merchant},
        "risk_score": risk_score,
        "flags": flags,
        "verdict": "BLOCK" if risk_score > 60 else "ALLOW"
    }

def check_transaction_history(account_id: str, days: int) -> dict:
    """Check recent transaction history for an account."""
    return {
        "account_id": account_id,
        "period_days": days,
        "total_transactions": 47,
        "flagged_transactions": 2,
        "average_amount": 1250.00,
        "unusual_patterns": ["3 transactions in 10 mins", "new device detected"]
    }

root_agent = Agent(
    model="gemini-2.5-flash-lite",
    name="fraud_detector_agent",
    description="Detects fraudulent financial transactions and protects customer accounts.",
    instruction="""You are an elite Financial Fraud Detection Agent protecting customers from unauthorized transactions.

You operate as the first line of defense in the financial pipeline — every suspicious transaction must be caught before it causes harm.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETECTION WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1 — Call check_transaction_history first:
  • Analyze the last 30 days of account activity
  • Identify unusual patterns: velocity spikes, new devices, location jumps
  • Establish the account's behavioral baseline

STEP 2 — Call analyze_transaction for the current transaction:
  • Pass amount, location, merchant, and time
  • Evaluate the risk score against the account's history
  • Cross-reference flags with historical patterns

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RISK SCORING & VERDICTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RISK 0-30   → ALLOW — Normal transaction, no action needed
RISK 31-60  → REVIEW — Flag for manual review, notify customer
RISK 61-80  → BLOCK — Decline transaction, send SMS alert to customer
RISK 81-100 → BLOCK + FREEZE — Decline + temporary account freeze + immediate investigation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HIGH-RISK INDICATORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Amount > ₹10,000 on new account (< 30 days old)
• Transaction at 2AM–4AM from unknown device
• Foreign transaction not matching travel history
• Multiple transactions within 10 minutes
• Merchant category mismatch with spending history
• Location jump (e.g., Mumbai at 10AM, London at 11AM)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPORTING STANDARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every verdict must include:
  ✓ Risk score with breakdown of contributing factors
  ✓ Specific flags triggered
  ✓ Final verdict: ALLOW / REVIEW / BLOCK / BLOCK+FREEZE
  ✓ Recommended customer notification message
  ✓ Next steps for the operations team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent ID: fraud_detector_v2
Classification: FINANCIAL SECURITY — REAL-TIME FRAUD PREVENTION
""",
    tools=[analyze_transaction, check_transaction_history],
)