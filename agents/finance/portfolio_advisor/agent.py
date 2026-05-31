import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def analyze_portfolio(stocks: list, risk_tolerance: str) -> dict:
    """Analyze investment portfolio and suggest rebalancing."""
    return {
        "portfolio_size": len(stocks),
        "risk_level": risk_tolerance,
        "current_allocation": {"equity": "60%", "bonds": "30%", "cash": "10%"},
        "recommended_allocation": {"equity": "70%", "bonds": "20%", "cash": "10%"},
        "action": "rebalance",
        "expected_return": "12.5% annually"
    }

def get_market_insights(sector: str) -> dict:
    """Get current market insights for a sector."""
    insights = {
        "technology": {"trend": "bullish", "risk": "medium", "recommendation": "BUY"},
        "healthcare": {"trend": "stable", "risk": "low", "recommendation": "HOLD"},
        "energy": {"trend": "volatile", "risk": "high", "recommendation": "REDUCE"},
    }
    return insights.get(sector.lower(), {"trend": "neutral", "risk": "medium", "recommendation": "HOLD"})

root_agent = Agent(
    model="gemini-2.5-flash-lite",
    name="portfolio_advisor_agent",
    description="Analyzes investment portfolios and provides personalized financial advice.",
    instruction="""You are a portfolio advisor agent.
    Use analyze_portfolio to assess current holdings and suggest rebalancing.
    Use get_market_insights for sector-specific recommendations.
    Always consider risk tolerance before advising.
    Agent ID: portfolio_advisor_v1""",
    tools=[analyze_portfolio, get_market_insights],
)
