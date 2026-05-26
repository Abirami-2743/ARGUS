import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def assess_creditworthiness(credit_score: int, income: float, existing_debt: float) -> dict:
    """Assess loan applicant creditworthiness."""
    debt_to_income = existing_debt / income if income > 0 else 1
    eligible = credit_score > 650 and debt_to_income < 0.4
    return {
        "credit_score": credit_score,
        "debt_to_income_ratio": round(debt_to_income, 2),
        "eligible": eligible,
        "max_loan_amount": income * 5 if eligible else 0,
        "recommended_rate": "8.5%" if credit_score > 750 else "12%" if eligible else "N/A"
    }

def verify_documents(applicant_id: str, doc_types: list) -> dict:
    """Verify loan application documents."""
    return {
        "applicant_id": applicant_id,
        "documents_checked": doc_types,
        "verification_status": "PASSED",
        "missing_docs": [],
        "next_step": "credit_committee_review"
    }

root_agent = Agent(
    model="gemini-3.5-flash",
    name="loan_processor_agent",
    description="Processes loan applications, assesses creditworthiness and verifies documents.",
    instruction="""You are a loan processing agent.
    Use assess_creditworthiness to evaluate applicant eligibility.
    Use verify_documents to confirm all required documents.
    Provide clear approval or rejection reasoning.
    Agent ID: loan_processor_v1""",
    tools=[assess_creditworthiness, verify_documents],
)
