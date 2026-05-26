import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def track_order(order_id: str) -> dict:
    """Track the current status of an order."""
    return {
        "order_id": order_id,
        "status": "OUT_FOR_DELIVERY",
        "placed_on": "2026-05-20",
        "estimated_delivery": "2026-05-22",
        "current_location": "Coimbatore Distribution Center",
        "tracking_events": [
            {"time": "08:00", "event": "Picked up by courier"},
            {"time": "11:30", "event": "Arrived at distribution center"},
            {"time": "14:00", "event": "Out for delivery"}
        ]
    }

def process_return(order_id: str, reason: str, items: list) -> dict:
    """Process a return or refund request."""
    return {
        "order_id": order_id,
        "return_reason": reason,
        "items_to_return": items,
        "return_approved": True,
        "refund_amount": 1299.00,
        "refund_method": "original_payment",
        "pickup_scheduled": "2026-05-24",
        "refund_timeline": "5-7 business days"
    }

root_agent = Agent(
    model="gemini-3.5-flash",
    name="order_manager_agent",
    description="Manages order tracking, returns and refund processing for ecommerce.",
    instruction="""You are an order management agent.
    Use track_order to provide real-time order status updates.
    Use process_return to handle return and refund requests.
    Always be empathetic and resolve issues quickly.
    Agent ID: order_manager_v1""",
    tools=[track_order, process_return],
)
