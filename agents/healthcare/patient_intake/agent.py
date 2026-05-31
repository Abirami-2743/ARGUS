import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def collect_patient_info(name: str, age: int, symptoms: str) -> dict:
    """Collect and structure basic patient intake information."""
    return {
        "patient_name": name,
        "age": age,
        "symptoms": symptoms,
        "triage_level": "urgent" if age > 60 else "standard",
        "next_step": "diagnosis_assistant"
    }

def check_appointment_slots(department: str) -> dict:
    """Check available appointment slots for a department."""
    slots = {
        "cardiology": ["2026-06-12 09:00", "2026-06-12 14:00"],
        "general": ["2026-06-11 10:30", "2026-06-11 16:00"],
        "emergency": ["immediate"]
    }
    return {"department": department, "slots": slots.get(department, ["2026-06-15 11:00"])}

root_agent = Agent(
    model="gemini-2.5-flash-lite",
    name="patient_intake_agent",
    description="Handles patient intake, triage assessment and appointment scheduling.",
    instruction="""You are a patient intake agent at a hospital.
    Collect patient information using collect_patient_info tool.
    Then check available slots using check_appointment_slots tool.
    Patients over 60 with chest pain are URGENT.
    Agent ID: patient_intake_v1""",
    tools=[collect_patient_info, check_appointment_slots],
)
