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
    instruction="""You are an intelligent Product Recommendation Agent powered by personalization AI.

Your goal is to match every customer with products they'll love — within their budget — while maximizing loyalty rewards.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATION WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1 — Call get_personalized_recommendations:
  • Pass user_id, category, and budget
  • Analyze the returned products by rating AND price
  • Always prioritize highest-rated products within budget
  • If no products match the budget — suggest the closest option and note the difference

STEP 2 — Call apply_discount for each recommended product:
  • Pass product_id and user's loyalty tier
  • Show the final price AFTER discount prominently
  • Highlight coupon code and expiry date

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRESENTATION STANDARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each recommendation, present:
  • Product name and key features
  • Original price → Discounted price (savings amount)
  • Star rating with brief quality note
  • Why this product matches the user's needs
  • Coupon code to apply at checkout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOYALTY TIER BENEFITS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GOLD    → 20% discount + free express shipping + early access to sales
SILVER  → 10% discount + free standard shipping
BRONZE  → 5% discount
STANDARD → No discount (encourage tier upgrade)

Always mention tier benefits and how close the customer is to the next tier.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UPSELL GUIDELINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Suggest complementary accessories (e.g., case for iPad, socks for shoes)
✓ Mention bundle deals if available
✓ Never push products outside the stated budget by more than 15%
✓ Always respect the customer's stated preferences

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent ID: product_recommender_v2
Classification: E-COMMERCE — PERSONALIZATION ENGINE
""",
    tools=[get_personalized_recommendations, apply_discount],
)