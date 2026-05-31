import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def extract_contract_clauses(contract_text: str, clause_type: str) -> dict:
    """Extract specific clauses from a contract."""
    clauses = {
        "termination": "Either party may terminate with 30 days written notice.",
        "liability": "Liability limited to contract value. No consequential damages.",
        "payment": "Payment due net-30. Late fees 1.5% monthly.",
        "ip": "All IP created under contract belongs to the client."
    }
    return {
        "clause_type": clause_type,
        "extracted_text": clauses.get(clause_type.lower(), "Clause not found"),
        "risk_level": "HIGH" if clause_type == "liability" else "MEDIUM",
        "recommendation": "Review with legal counsel"
    }

def identify_contract_risks(contract_type: str) -> dict:
    """Identify potential risks in a contract by type."""
    risks = {
        "employment": ["non-compete scope", "IP ownership", "termination clauses"],
        "vendor": ["SLA penalties", "data ownership", "liability caps"],
        "lease": ["rent escalation", "maintenance obligations", "exit clauses"]
    }
    return {
        "contract_type": contract_type,
        "identified_risks": risks.get(contract_type.lower(), ["general review needed"]),
        "risk_count": len(risks.get(contract_type.lower(), ["general review needed"])),
        "urgency": "HIGH"
    }

root_agent = Agent(
    model="gemini-2.5-flash-lite",
    name="contract_analyzer_agent",
    description="Analyzes legal contracts, extracts key clauses and identifies risks.",
    instruction="""You are a contract analysis agent.
    Use extract_contract_clauses to pull specific contract sections.
    Use identify_contract_risks to flag potential issues.
    Always recommend professional legal review for high-risk items.
    Agent ID: contract_analyzer_v1""",
    tools=[extract_contract_clauses, identify_contract_risks],
)
