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
    model="gemini-3.5-flash",
    name="fraud_detector_agent",
    description="Detects fraudulent financial transactions and protects customer accounts.",
    instruction="""You are a financial fraud detection agent.
    Use analyze_transaction to assess risk of any transaction.
    Use check_transaction_history to look for patterns.
    BLOCK transactions with risk score above 60.
    Agent ID: fraud_detector_v1""",
    tools=[analyze_transaction, check_transaction_history],
)
