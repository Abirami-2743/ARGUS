import os
from dotenv import load_dotenv
load_dotenv()

def setup_tracing(project_name: str = "argus-monitoring"):
    api_key = os.getenv("PHOENIX_API_KEY")
    space_id = os.getenv("PHOENIX_SPACE_ID")
    collector_endpoint = os.getenv("PHOENIX_COLLECTOR_ENDPOINT", "https://app.phoenix.arize.com")
    
    print(f"[ARGUS] Using API key: {api_key[:20] if api_key else 'NONE'}...")
    print(f"[ARGUS] Endpoint: {collector_endpoint}")

    try:
        from phoenix.otel import register
        register(
            project_name=project_name,
            endpoint=f"{collector_endpoint}/v1/traces",
            batch=True,
            headers={
                "authorization": f"Bearer {api_key}",
                "space-id": space_id or "",
            },
        )

        from openinference.instrumentation.google_adk import GoogleADKInstrumentor
        GoogleADKInstrumentor().instrument()

        print(f"[ARGUS] ✓ Tracing active → {project_name}")
    except Exception as e:
        print(f"[ARGUS] ⚠ Tracing error: {e}")