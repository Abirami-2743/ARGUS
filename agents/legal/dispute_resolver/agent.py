import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def analyze_dispute(dispute_type: str, claim_amount: float, party_a: str, party_b: str) -> dict:
    """Analyze a legal dispute and suggest resolution path."""
    resolution_paths = {
        "contract": "mediation",
        "employment": "arbitration",
        "property": "litigation",
        "consumer": "small_claims"
    }
    path = resolution_paths.get(dispute_type.lower(), "mediation")
    return {
        "dispute_type": dispute_type,
        "claim_amount": claim_amount,
        "parties": {"plaintiff": party_a, "defendant": party_b},
        "recommended_path": path,
        "estimated_duration": "3-6 months",
        "estimated_cost": claim_amount * 0.15,
        "success_probability": "65%"
    }

def search_precedents(dispute_type: str, jurisdiction: str) -> dict:
    """Search for legal precedents relevant to a dispute."""
    return {
        "dispute_type": dispute_type,
        "jurisdiction": jurisdiction,
        "relevant_cases": [
            {"case": "Smith v. Jones 2024", "outcome": "plaintiff_won", "similarity": "87%"},
            {"case": "ABC Corp v. XYZ Ltd 2023", "outcome": "settled", "similarity": "72%"}
        ],
        "precedent_strength": "MODERATE",
        "recommendation": "Settlement likely favorable"
    }

root_agent = Agent(
    model="gemini-3.5-flash",
    name="dispute_resolver_agent",
    description="Analyzes legal disputes and recommends resolution strategies.",
    instruction="""You are a legal dispute resolution agent.
    Use analyze_dispute to assess the dispute and recommend a resolution path.
    Use search_precedents to find relevant case law.
    Always recommend consulting a qualified attorney for final decisions.
    Agent ID: dispute_resolver_v1""",
    tools=[analyze_dispute, search_precedents],
)
