import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def check_inventory_levels(warehouse_id: str, product_sku: str) -> dict:
    """Check current inventory levels for a product in a warehouse."""
    return {
        "warehouse_id": warehouse_id,
        "product_sku": product_sku,
        "current_stock": 1240,
        "minimum_threshold": 500,
        "reorder_point": 800,
        "status": "ADEQUATE",
        "days_of_supply": 18,
        "next_shipment": "2026-05-28"
    }

def optimize_supply_route(origin: str, destination: str, cargo_weight: float) -> dict:
    """Optimize supply chain routing for cargo delivery."""
    return {
        "origin": origin,
        "destination": destination,
        "cargo_weight_kg": cargo_weight,
        "recommended_route": f"{origin} → Hub → {destination}",
        "estimated_days": 3,
        "cost_usd": cargo_weight * 0.45,
        "carbon_footprint_kg": cargo_weight * 0.02,
        "alternatives": ["air_freight", "rail"]
    }

root_agent = Agent(
    model="gemini-2.5-flash-lite",
    name="supply_chain_agent",
    description="Manages inventory levels and optimizes supply chain routing.",
    instruction="""You are a supply chain management agent.
    Use check_inventory_levels to monitor stock at warehouses.
    Use optimize_supply_route to find the best delivery routes.
    Trigger reorders when stock drops below reorder point.
    Agent ID: supply_chain_v1""",
    tools=[check_inventory_levels, optimize_supply_route],
)
