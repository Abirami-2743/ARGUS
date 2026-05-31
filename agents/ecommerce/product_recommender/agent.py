import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def get_personalized_recommendations(user_id: str, category: str, budget: float) -> dict:
    """Get personalized product recommendations for a user."""
    products = {
        "electronics": [
            {"id": "E001", "name": "Sony WH-1000XM6", "price": 299.99, "rating": 4.8},
            {"id": "E002", "name": "iPad Air M3", "price": 599.99, "rating": 4.9},
        ],
        "clothing": [
            {"id": "C001", "name": "Nike Air Max 2026", "price": 129.99, "rating": 4.7},
            {"id": "C002", "name": "Levi's 511 Slim", "price": 59.99, "rating": 4.5},
        ]
    }
    recs = [p for p in products.get(category.lower(), []) if p["price"] <= budget]
    return {
        "user_id": user_id,
        "category": category,
        "budget": budget,
        "recommendations": recs,
        "personalization_score": 0.87
    }

def apply_discount(product_id: str, user_tier: str) -> dict:
    """Apply appropriate discount based on user loyalty tier."""
    discounts = {"gold": 0.20, "silver": 0.10, "bronze": 0.05, "standard": 0.0}
    discount = discounts.get(user_tier.lower(), 0.0)
    return {
        "product_id": product_id,
        "user_tier": user_tier,
        "discount_percentage": discount * 100,
        "coupon_code": f"LOYAL{int(discount*100)}",
        "valid_until": "2026-06-11"
    }

root_agent = Agent(
    model="gemini-2.5-flash-lite",
    name="product_recommender_agent",
    description="Provides personalized product recommendations and applies loyalty discounts.",
    instruction="""You are a product recommendation agent.
    Use get_personalized_recommendations to suggest products based on user preferences.
    Use apply_discount to reward loyal customers.
    Always stay within the user's budget.
    Agent ID: product_recommender_v1""",
    tools=[get_personalized_recommendations, apply_discount],
)
