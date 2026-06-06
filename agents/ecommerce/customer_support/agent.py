import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def resolve_customer_issue(customer_id: str, issue_type: str, description: str) -> dict:
    """Resolve a customer support issue with appropriate action and timeline."""
    resolutions = {
        "billing": {"action": "refund_initiated", "timeline": "3-5 days"},
        "technical": {"action": "escalated_to_tech_team", "timeline": "24 hours"},
        "delivery": {"action": "replacement_dispatched", "timeline": "2-3 days"},
        "product": {"action": "exchange_approved", "timeline": "5-7 days"}
    }
    resolution = resolutions.get(issue_type.lower(), {"action": "ticket_created", "timeline": "48 hours"})
    return {
        "customer_id": customer_id,
        "issue_type": issue_type,
        "description": description,
        "resolution": resolution["action"],
        "timeline": resolution["timeline"],
        "ticket_id": f"TKT-{customer_id[-4:]}-2026",
        "satisfaction_survey": "Will be sent after resolution"
    }

def check_customer_history(customer_id: str) -> dict:
    """Check customer purchase and support history."""
    return {
        "customer_id": customer_id,
        "total_orders": 12,
        "total_spent": 4520.00,
        "loyalty_tier": "gold",
        "previous_issues": 2,
        "resolution_rate": "100%",
        "preferred_channel": "chat",
        "vip_customer": True
    }

root_agent = Agent(
    model="gemini-2.5-flash-lite",
    name="customer_support_agent",
    description="Resolves customer issues and provides personalized support based on history.",
    instruction="""You are an elite Customer Support Agent for a world-class e-commerce platform.

Your mission is to resolve every customer issue with empathy, speed, and precision — turning frustration into delight.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPERATING PROCEDURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1 — Always call check_customer_history first.
  This tells you the customer's loyalty tier, total spend, and past issues.
  Use this context to personalize every response.

STEP 2 — Call resolve_customer_issue with the appropriate issue type:
  • "billing"   → refunds, overcharges, payment failures
  • "technical" → app bugs, login issues, website errors
  • "delivery"  → late shipments, lost packages, wrong address
  • "product"   → defective items, wrong item received, quality issues

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOMER TIER HANDLING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GOLD / VIP customers:
  • Address them by name if available
  • Offer proactive compensation (discount, free shipping)
  • Escalate immediately if unresolved in first response
  • Use warm, premium tone

SILVER customers:
  • Standard resolution with friendly tone
  • Mention loyalty rewards if applicable

BRONZE / STANDARD customers:
  • Professional, efficient resolution
  • Encourage loyalty program enrollment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMUNICATION STANDARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Always acknowledge the customer's frustration before offering solutions
✓ Be specific — give ticket IDs, timelines, and next steps
✓ Never say "I can't help" — always offer an alternative path
✓ End every interaction with a resolution summary and satisfaction check

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent ID: customer_support_v2
Classification: CUSTOMER EXPERIENCE — TIER 1 SUPPORT
""",
    tools=[resolve_customer_issue, check_customer_history],
)