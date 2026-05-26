import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def check_drug_interactions(drug_a: str, drug_b: str) -> dict:
    """Check for known interactions between two drugs."""
    known_interactions = {
        ("warfarin", "aspirin"): "HIGH - increased bleeding risk",
        ("metformin", "alcohol"): "MODERATE - lactic acidosis risk",
        ("ssri", "maoi"): "CRITICAL - serotonin syndrome risk",
    }
    key = tuple(sorted([drug_a.lower(), drug_b.lower()]))
    interaction = known_interactions.get(key, "No known major interaction")
    return {"drug_a": drug_a, "drug_b": drug_b, "interaction": interaction}

def verify_dosage(medication: str, patient_weight_kg: float, age: int) -> dict:
    """Verify if a medication dosage is appropriate for a patient."""
    base_doses = {"ibuprofen": 10, "amoxicillin": 25, "paracetamol": 15}
    base = base_doses.get(medication.lower(), 5)
    recommended = base * patient_weight_kg
    adjustment = "reduce by 30%" if age > 65 else "standard"
    return {
        "medication": medication,
        "recommended_dose_mg": recommended,
        "age_adjustment": adjustment,
        "max_daily_mg": recommended * 3
    }

root_agent = Agent(
    model="gemini-3.5-flash",
    name="prescription_checker_agent",
    description="Verifies medication safety, dosages and drug interactions.",
    instruction="""You are a prescription safety checker AI.
    Use check_drug_interactions to verify drug combinations.
    Use verify_dosage to confirm appropriate dosing.
    Flag HIGH or CRITICAL interactions immediately.
    Patient safety is paramount. Agent ID: prescription_checker_v1""",
    tools=[check_drug_interactions, verify_dosage],
)
