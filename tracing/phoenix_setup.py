import os
from dotenv import load_dotenv
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from openinference.instrumentation.langchain import LangChainInstrumentor

load_dotenv()

def setup_tracing(project_name: str = "argus-monitoring"):
    api_key = os.getenv("PHOENIX_API_KEY")

    exporter = OTLPSpanExporter(
        endpoint="https://app.phoenix.arize.com/s/abiramisgp/v1/traces",
        headers={
            "Authorization": f"Bearer {api_key}",
            "project-name": project_name,
        },
    )

    provider = TracerProvider()
    provider.add_span_processor(BatchSpanProcessor(exporter))
    trace.set_tracer_provider(provider)

    LangChainInstrumentor().instrument()

    print(f"[ARGUS] Tracing live → project: {project_name}")
    print(f"[ARGUS] Dashboard → https://app.phoenix.arize.com/s/abiramisgp")
    return provider
