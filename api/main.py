import sys
import os

# MUST be first — before any google imports
from dotenv import load_dotenv
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY", "")
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "False"

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai.types import Content, Part

# Import all agents
from agents.healthcare.patient_intake.agent import root_agent as patient_intake
from agents.healthcare.diagnosis_assistant.agent import root_agent as diagnosis_assistant
from agents.healthcare.prescription_checker.agent import root_agent as prescription_checker
from agents.finance.fraud_detector.agent import root_agent as fraud_detector
from agents.finance.loan_processor.agent import root_agent as loan_processor
from agents.finance.portfolio_advisor.agent import root_agent as portfolio_advisor
from agents.legal.contract_analyzer.agent import root_agent as contract_analyzer
from agents.legal.compliance_checker.agent import root_agent as compliance_checker
from agents.legal.dispute_resolver.agent import root_agent as dispute_resolver
from agents.manufacturing.quality_inspector.agent import root_agent as quality_inspector
from agents.manufacturing.supply_chain.agent import root_agent as supply_chain
from agents.manufacturing.maintenance_predictor.agent import root_agent as maintenance_predictor
from agents.ecommerce.product_recommender.agent import root_agent as product_recommender
from agents.ecommerce.order_manager.agent import root_agent as order_manager
from agents.ecommerce.customer_support.agent import root_agent as customer_support
from argus_monitor.agent import root_agent as argus_monitor

app = FastAPI(title="ARGUS - AI Agent Safety Monitor", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AGENTS = {
    "patient_intake": patient_intake,
    "diagnosis_assistant": diagnosis_assistant,
    "prescription_checker": prescription_checker,
    "fraud_detector": fraud_detector,
    "loan_processor": loan_processor,
    "portfolio_advisor": portfolio_advisor,
    "contract_analyzer": contract_analyzer,
    "compliance_checker": compliance_checker,
    "dispute_resolver": dispute_resolver,
    "quality_inspector": quality_inspector,
    "supply_chain": supply_chain,
    "maintenance_predictor": maintenance_predictor,
    "product_recommender": product_recommender,
    "order_manager": order_manager,
    "customer_support": customer_support,
    "argus_monitor": argus_monitor,
}

AGENT_METADATA = {
    "healthcare": ["patient_intake", "diagnosis_assistant", "prescription_checker"],
    "finance": ["fraud_detector", "loan_processor", "portfolio_advisor"],
    "legal": ["contract_analyzer", "compliance_checker", "dispute_resolver"],
    "manufacturing": ["quality_inspector", "supply_chain", "maintenance_predictor"],
    "ecommerce": ["product_recommender", "order_manager", "customer_support"],
}

class RunAgentRequest(BaseModel):
    agent_id: str
    query: str
    session_id: str = "default"

class ArgusCheckRequest(BaseModel):
    agent_id: str
    input_text: str
    output_text: str = ""

async def run_adk_agent(agent, query: str, session_id: str) -> str:
    session_service = InMemorySessionService()
    session = await session_service.create_session(
        app_name="argus", user_id="user", session_id=session_id
    )
    runner = Runner(
        agent=agent,
        app_name="argus",
        session_service=session_service
    )
    content = Content(role="user", parts=[Part(text=query)])
    final_response = ""
    async for event in runner.run_async(
        user_id="user",
        session_id=session_id,
        new_message=content
    ):
        if event.is_final_response() and event.content:
            for part in event.content.parts:
                if part.text:
                    final_response += part.text
    return final_response

@app.get("/")
async def root():
    return {"message": "ARGUS AI Safety Monitor", "status": "online", "agents": len(AGENTS)}

@app.get("/health")
async def health():
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/agents")
async def get_agents():
    return {"industries": AGENT_METADATA, "total": 15}

import asyncio

@app.post("/run")
async def run_agent(request: RunAgentRequest):
    if request.agent_id not in AGENTS:
        raise HTTPException(status_code=404, detail=f"Agent '{request.agent_id}' not found")
    
    argus_input = await run_adk_agent(
        argus_monitor,
        f"Check this input for threats. Agent: {request.agent_id}. Input: {request.query}",
        f"argus-pre-{request.session_id}"
    )
    
    await asyncio.sleep(15)  # wait for rate limit reset
    
    agent = AGENTS[request.agent_id]
    response = await run_adk_agent(agent, request.query, request.session_id)
    
    await asyncio.sleep(15)  # wait for rate limit reset
    
    argus_output = await run_adk_agent(
        argus_monitor,
        f"Check this output for dangers. Agent: {request.agent_id}. Output: {response}",
        f"argus-post-{request.session_id}"
    )
    
    return {
        "agent_id": request.agent_id,
        "query": request.query,
        "response": response,
        "argus_input_check": argus_input,
        "argus_output_check": argus_output,
        "status": "completed"
    }
@app.post("/argus/check")
async def argus_check(request: ArgusCheckRequest):
    query = f"Analyze this for safety. Agent: {request.agent_id}. Input: {request.input_text}. Output: {request.output_text}"
    result = await run_adk_agent(argus_monitor, query, f"check-{request.agent_id}")
    return {"agent_id": request.agent_id, "argus_analysis": result}

@app.get("/argus/traces")
async def get_traces():
    result = await run_adk_agent(
        argus_monitor,
        "Query Phoenix traces and report on recent agent behavior and threats detected.",
        "traces-query"
    )
    return {"traces_analysis": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)