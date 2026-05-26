import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def lookup_symptoms(symptoms: str) -> dict:
    """Look up possible conditions based on reported symptoms."""
    symptom_db = {
        "chest pain": ["angina", "myocardial infarction", "GERD"],
        "fever headache": ["influenza", "meningitis", "COVID-19"],
        "fatigue shortness of breath": ["anemia", "heart failure", "asthma"]
    }
    for key, conditions in symptom_db.items():
        if any(word in symptoms.lower() for word in key.split()):
            return {"possible_conditions": conditions, "confidence": "preliminary"}
    return {"possible_conditions": ["requires further assessment"], "confidence": "low"}

def order_diagnostic_tests(condition_suspected: str) -> dict:
    """Order appropriate diagnostic tests for a suspected condition."""
    test_map = {
        "cardiac": ["ECG", "troponin", "echocardiogram"],
        "respiratory": ["chest X-ray", "spirometry", "ABG"],
        "default": ["CBC", "metabolic panel", "urinalysis"]
    }
    key = "cardiac" if "card" in condition_suspected.lower() else \
          "respiratory" if "resp" in condition_suspected.lower() else "default"
    return {"tests_ordered": test_map[key], "priority": "urgent"}

root_agent = Agent(
    model="gemini-3.5-flash",
    name="diagnosis_assistant_agent",
    description="Analyzes symptoms and suggests diagnostic pathways for physicians.",
    instruction="""You are a medical diagnosis assistant AI.
    Use lookup_symptoms to analyze reported symptoms.
    Use order_diagnostic_tests to recommend tests.
    Always recommend physician review. Never give definitive diagnoses alone.
    Agent ID: diagnosis_assistant_v1""",
    tools=[lookup_symptoms, order_diagnostic_tests],
)
