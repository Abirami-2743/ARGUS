import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def predict_equipment_failure(machine_id: str, temperature: float, vibration: float, runtime_hours: int) -> dict:
    """Predict equipment failure based on sensor data."""
    risk_score = 0
    if temperature > 85:
        risk_score += 35
    if vibration > 0.8:
        risk_score += 35
    if runtime_hours > 5000:
        risk_score += 30
    return {
        "machine_id": machine_id,
        "sensor_data": {"temperature": temperature, "vibration": vibration, "runtime_hours": runtime_hours},
        "failure_risk_score": risk_score,
        "failure_probability": f"{risk_score}%",
        "predicted_failure_in": "72 hours" if risk_score > 70 else "30 days",
        "action": "IMMEDIATE_MAINTENANCE" if risk_score > 70 else "SCHEDULE_MAINTENANCE"
    }

def schedule_maintenance(machine_id: str, maintenance_type: str, urgency: str) -> dict:
    """Schedule maintenance for equipment."""
    schedule = {
        "IMMEDIATE": "2026-05-22 08:00",
        "URGENT": "2026-05-24 09:00",
        "ROUTINE": "2026-06-01 10:00"
    }
    return {
        "machine_id": machine_id,
        "maintenance_type": maintenance_type,
        "scheduled_date": schedule.get(urgency, "2026-06-01"),
        "estimated_downtime_hours": 4,
        "assigned_technician": "Team B",
        "parts_required": ["bearing_set", "lubrication_kit"]
    }

root_agent = Agent(
    model="gemini-2.5-flash-lite",
    name="maintenance_predictor_agent",
    description="Predicts equipment failures using sensor data and schedules preventive maintenance.",
    instruction="""You are a predictive maintenance agent.
    Use predict_equipment_failure to assess machine health from sensor readings.
    Use schedule_maintenance to book maintenance before failures occur.
    Risk score above 70 requires IMMEDIATE action.
    Agent ID: maintenance_predictor_v1""",
    tools=[predict_equipment_failure, schedule_maintenance],
)
