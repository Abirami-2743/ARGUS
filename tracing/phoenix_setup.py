import os
from dotenv import load_dotenv
load_dotenv()

def setup_tracing(project_name: str = "argus-monitoring"):
    api_key = os.getenv("PHOENIX_API_KEY")
    
    os.environ["PHOENIX_API_KEY"] = api_key
    os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = "https://app.phoenix.arize.com/v1/traces"
    os.environ["PHOENIX_PROJECT_NAME"] = project_name

    try:
        from phoenix.otel import register
        tracer_provider = register(
            project_name=project_name,
            endpoint="https://app.phoenix.arize.com/v1/traces",
        )
        print("[ARGUS] ✓ Phoenix register() active")

        # Use Gemini instrumentor instead — more stable than ADK
        from openinference.instrumentation.google_generative_ai import (
            GoogleGenerativeAIInstrumentor,
        )
        GoogleGenerativeAIInstrumentor().instrument(tracer_provider=tracer_provider)
        print("[ARGUS] ✓ Gemini instrumentation active")

    except Exception as e:
        print(f"[ARGUS] ⚠ Tracing error: {e}")

    print(f"[ARGUS] ✓ Project: {project_name}")
    return None