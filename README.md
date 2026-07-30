# ARGUS — AI Agent Safety Monitor

> **The problem for AI agents. Solved by an AI agent.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built with Google ADK](https://img.shields.io/badge/Built%20with-Google%20ADK-4285F4)](https://google.github.io/adk-docs/)
[![Powered by Gemini 3.5 Flash](https://img.shields.io/badge/Powered%20by-Gemini%203.5%20Flash-34A853)](https://ai.google.dev/)
[![Monitored by Arize Phoenix](https://img.shields.io/badge/Monitored%20by-Arize%20Phoenix-FF6B35)](https://phoenix.arize.com/)
[![Google Cloud Run](https://img.shields.io/badge/Hosted%20on-Cloud%20Run-4285F4)](https://cloud.google.com/run)

---

## What is ARGUS?

ARGUS is a real-time AI safety monitoring system for multi-agent environments. As enterprises deploy fleets of AI agents across industries, a critical question emerges: **who watches the agents?**

ARGUS does.

It monitors 15 simulated AI agents across 5 industries — detecting prompt injection attacks, rogue inter-agent communications, and dangerous outputs — all in real time. And unlike traditional monitoring tools, **ARGUS is itself an AI agent** that learns from its own observability data via Arize Phoenix MCP to continuously improve its threat detection.

---

## The Problem

Multi-agent AI systems face four critical threats:

| Threat | Description |
|--------|-------------|
| **Prompt Injection** | Malicious inputs hijack agent behavior |
| **Rogue Inter-Agent Comms** | Unauthorized messages between agents |
| **Dangerous Outputs** | Agents producing harmful or destructive responses |
| **Self-Improvement Loops** | Agents modifying their own instructions |

---

## The Solution — ARGUS

```
15 Simulated Agents → Generate Traces → Arize Phoenix Cloud
                                              ↓
                              ARGUS reads traces via Phoenix MCP
                                              ↓
                         ARGUS improves its own detection rules
                                              ↓
                    Real-time threat dashboard → Intercept → Alert
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Agent Runtime** | Google ADK (Agent Development Kit) |
| **LLM** | Gemini 2.5 Flash |
| **Observability** | Arize Phoenix Cloud + OpenInference |
| **Tracing** | OpenTelemetry + OTLP |
| **Self-Improvement** | Phoenix MCP Server |
| **Evaluations** | LLM-as-a-Judge via ARGUS |
| **Backend** | FastAPI + Python |
| **Frontend** | Next.js + D3.js |
| **Hosting** | Google Cloud Run |

---

## 15 Simulated Agents (5 Industries × 3)

### 🏥 Healthcare
- `patient_intake_agent` — Triage + appointment scheduling
- `diagnosis_assistant_agent` — Symptom analysis + diagnostic pathways
- `prescription_checker_agent` — Drug interaction + dosage verification

### 💰 Finance
- `fraud_detector_agent` — Transaction fraud detection
- `loan_processor_agent` — Credit assessment + document verification
- `portfolio_advisor_agent` — Investment analysis + market insights

### ⚖️ Legal
- `contract_analyzer_agent` — Contract clause extraction + risk identification
- `compliance_checker_agent` — Regulatory compliance assessment
- `dispute_resolver_agent` — Legal dispute analysis + precedent search

### 🏭 Manufacturing
- `quality_inspector_agent` — Product quality inspection + test suites
- `supply_chain_agent` — Inventory management + route optimization
- `maintenance_predictor_agent` — Predictive equipment failure detection

### 🛒 E-commerce
- `product_recommender_agent` — Personalized recommendations + discounts
- `order_manager_agent` — Order tracking + returns processing
- `customer_support_agent` — Issue resolution + customer history

---

## ARGUS Monitor — 5 Detection Tools

```python
detect_prompt_injection()      # Scans all agent inputs
detect_rogue_communication()   # Verifies inter-agent message flows
intercept_dangerous_output()   # Screens all agent outputs
query_phoenix_traces()         # Self-improvement via observability data
run_llm_judge_evaluation()     # LLM-as-a-Judge quality scoring
```

---


## Getting Started

### Prerequisites
- Python 3.11+
- Google Cloud account
- Arize Phoenix account (free at app.phoenix.arize.com)
- Gemini API key (Google AI Studio)

### Installation

```bash
# Clone the repo
git clone https://github.com/Abirami-2743/argus.git
cd argus

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Create a `.env` file:
```
GOOGLE_API_KEY=your_gemini_api_key
PHOENIX_API_KEY=your_arize_phoenix_api_key
PHOENIX_COLLECTOR_ENDPOINT=https://app.phoenix.arize.com
```

### Run

```bash
# Start the backend
uvicorn api.main:app --reload --port 8080

# Start the frontend (separate terminal)
cd frontend
npm install
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/agents` | List all agents by industry |
| POST | `/run` | Run any agent with ARGUS monitoring |
| POST | `/argus/check` | Direct ARGUS safety check |
| GET | `/argus/traces` | Query Phoenix traces for insights |

### Example — Run an agent:
```bash
curl -X POST http://localhost:8080/run \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "fraud_detector",
    "query": "Analyze transaction: $15,000 from Romania at 3AM",
    "session_id": "demo-001"
  }'
```

---

## How ARGUS Self-Improves

1. All 15 agents send traces to **Arize Phoenix Cloud**
2. ARGUS queries traces via **Phoenix MCP server**
3. ARGUS analyzes patterns → detects new threat signatures
4. ARGUS updates its detection rules autonomously
5. **LLM-as-a-Judge** evaluates every agent response for quality

This creates a closed-loop safety system that gets smarter over time.

---


## License

MIT License — see [LICENSE](LICENSE) for details.
