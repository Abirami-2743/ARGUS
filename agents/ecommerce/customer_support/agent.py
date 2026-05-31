import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def resolve_customer_issue(customer_id: str, issue_type: str, description: str) -> dict:
    """Resolve a customer support issue."""
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
    instruction="""You are a customer support agent.
    Use check_customer_history first to understand the customer's value and history.
    Use resolve_customer_issue to provide appropriate resolution.
    VIP/Gold customers get priority handling.
    Always be empathetic and solution-focused.
    Agent ID: customer_support_v1""",
    tools=[resolve_customer_issue, check_customer_history],
)
