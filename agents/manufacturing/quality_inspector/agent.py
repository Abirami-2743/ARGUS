import os
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent

load_dotenv()

def inspect_product_quality(product_id: str, defect_rate: float, batch_size: int) -> dict:
    """Inspect product quality metrics for a manufacturing batch."""
    acceptable = defect_rate < 0.02
    return {
        "product_id": product_id,
        "batch_size": batch_size,
        "defect_rate": defect_rate,
        "defective_units": int(batch_size * defect_rate),
        "status": "PASS" if acceptable else "FAIL",
        "action": "release" if acceptable else "quarantine_batch",
        "quality_score": round((1 - defect_rate) * 100, 2)
    }

def run_quality_tests(product_type: str, test_suite: str) -> dict:
    """Run quality tests on a product type."""
    tests = {
        "electronics": ["voltage_test", "thermal_test", "drop_test", "connectivity_test"],
        "food": ["contamination_test", "ph_test", "shelf_life_test"],
        "automotive": ["stress_test", "vibration_test", "safety_test"]
    }
    return {
        "product_type": product_type,
        "tests_run": tests.get(product_type.lower(), ["standard_test"]),
        "passed": 3,
        "failed": 1,
        "overall": "CONDITIONAL_PASS",
        "failed_tests": ["thermal_test"]
    }

root_agent = Agent(
    model="gemini-3.5-flash",
    name="quality_inspector_agent",
    description="Inspects manufacturing product quality and runs quality test suites.",
    instruction="""You are a manufacturing quality inspector agent.
    Use inspect_product_quality to assess batch quality metrics.
    Use run_quality_tests to execute specific test suites.
    Quarantine any batch with defect rate above 2%.
    Agent ID: quality_inspector_v1""",
    tools=[inspect_product_quality, run_quality_tests],
)
