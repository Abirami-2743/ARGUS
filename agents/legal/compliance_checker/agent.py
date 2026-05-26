import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def check_regulatory_compliance(industry: str, regulation: str) -> dict:
    """Check compliance requirements for an industry and regulation."""
    requirements = {
        ("healthcare", "HIPAA"): ["data encryption", "access controls", "audit logs", "breach notification"],
        ("finance", "GDPR"): ["data consent", "right to erasure", "data portability", "DPO appointment"],
        ("ecommerce", "PCI-DSS"): ["card data encryption", "network security", "access control", "monitoring"],
    }
    key = (industry.lower(), regulation.upper())
    reqs = requirements.get(key, ["general compliance review needed"])
    return {
        "industry": industry,
        "regulation": regulation,
        "requirements": reqs,
        "compliance_score": 72,
        "gaps": reqs[:2],
        "status": "PARTIAL"
    }

def generate_compliance_report(company_name: str, regulations: list) -> dict:
    """Generate a compliance status report for a company."""
    return {
        "company": company_name,
        "regulations_checked": regulations,
        "overall_status": "NEEDS_ATTENTION",
        "critical_gaps": 2,
        "recommendations": ["Implement data encryption", "Update privacy policy"],
        "next_audit_date": "2026-09-01"
    }

root_agent = Agent(
    model="gemini-3.5-flash",
    name="compliance_checker_agent",
    description="Checks regulatory compliance and generates compliance reports for companies.",
    instruction="""You are a regulatory compliance checker agent.
    Use check_regulatory_compliance to assess specific regulation requirements.
    Use generate_compliance_report for comprehensive company-wide reports.
    Flag CRITICAL gaps that could result in penalties.
    Agent ID: compliance_checker_v1""",
    tools=[check_regulatory_compliance, generate_compliance_report],
)
