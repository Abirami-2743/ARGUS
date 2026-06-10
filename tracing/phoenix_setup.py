import os
from dotenv import load_dotenv
load_dotenv()

def setup_tracing(project_name: str = "argus-monitoring"):
    api_key = os.getenv("PHOENIX_API_KEY")

    try:
        from phoenix.otel import register
        register(
            project_name=project_name,
            endpoint="https://app.phoenix.arize.com/v1/traces",
            batch=True,
            headers={"authorization": f"Bearer {api_key}"},
        )

        from openinference.instrumentation.google_adk import GoogleADKInstrumentor
        GoogleADKInstrumentor().instrument()

        print(f"[ARGUS] ✓ Tracing active → {project_name}")
        print(f"[ARGUS] ✓ GoogleADKInstrumentor active")
    except Exception as e:
        print(f"[ARGUS] ⚠ Tracing error: {e}")