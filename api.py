"""
FastAPI Server Backend for Multi-Agent VC Analyst.

Exposes REST endpoints to trigger multi-agent due diligence workflows,
track real-time agent execution progress, and retrieve structured VC memos.
"""

import uuid
import threading
import time
import os
from typing import Any, Dict, Optional
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

from orchestrator import VCOrchestrator
from memory.context_manager import SharedContextManager
from utils.logger import get_logger

logger = get_logger(__name__)

app = FastAPI(
    title="Multi-Agent VC Analyst API",
    description="API server managing 6-agent venture capital due diligence workflows.",
    version="1.0.0",
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/")
def read_root():
    index_file = os.path.join(static_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "Multi-Agent VC Analyst API Online"}

# In-memory Job Store
jobs: Dict[str, Dict[str, Any]] = {}
orchestrator_instance = VCOrchestrator()


class AnalyzeRequest(BaseModel):
    startup_name: str = Field(..., example="OpenAI", description="Target startup or company name.")


class AnalyzeResponse(BaseModel):
    job_id: str
    startup_name: str
    status: str
    message: str


def run_orchestrator_job(job_id: str, startup_name: str):
    """Background task executing VCOrchestrator pipeline."""
    try:
        logger.info(f"Background Job [{job_id}] started for: '{startup_name}'")
        jobs[job_id]["status"] = "RUNNING"
        jobs[job_id]["start_time"] = time.time()

        # Run pipeline
        result = orchestrator_instance.analyze_startup(startup_name)

        if result.get("status") == "SUCCESS":
            jobs[job_id]["status"] = "COMPLETED"
            jobs[job_id]["result"] = result
            jobs[job_id]["context"] = SharedContextManager.load(startup_name)
        else:
            jobs[job_id]["status"] = "ERROR"
            jobs[job_id]["error"] = result.get("error_message", "Workflow failed.")

        jobs[job_id]["end_time"] = time.time()
        logger.info(f"Background Job [{job_id}] finished with status: {jobs[job_id]['status']}")

    except Exception as err:
        logger.error(f"Background Job [{job_id}] crashed: {err}")
        jobs[job_id]["status"] = "ERROR"
        jobs[job_id]["error"] = str(err)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "VC Analyst API", "version": "1.0.0"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_startup(req: AnalyzeRequest, background_tasks: BackgroundTasks):
    if not req.startup_name or not req.startup_name.strip():
        raise HTTPException(status_code=400, detail="Startup name cannot be empty.")

    job_id = str(uuid.uuid4())
    startup_name = req.startup_name.strip()

    jobs[job_id] = {
        "job_id": job_id,
        "startup_name": startup_name,
        "status": "QUEUED",
        "result": None,
        "error": None,
        "created_at": time.time(),
    }

    # Launch in background thread
    background_tasks.add_task(run_orchestrator_job, job_id, startup_name)

    return AnalyzeResponse(
        job_id=job_id,
        startup_name=startup_name,
        status="QUEUED",
        message=f"VC due diligence workflow queued for {startup_name}.",
    )


@app.get("/api/status/{job_id}")
@app.get("/status/{job_id}")
def get_job_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job ID not found.")

    job = jobs[job_id]
    startup_name = job["startup_name"]
    context = SharedContextManager.load(startup_name)

    # Calculate agent step progress dictionary
    steps_progress = {
        "startup_research": {
            "name": "Startup Research",
            "status": "COMPLETED" if context and context.research_output else ("RUNNING" if context and context.current_step == "RESEARCH" else "PENDING"),
            "summary": "Gathers company history, product value proposition, and official domain."
        },
        "founder_evaluation": {
            "name": "Founder Evaluation",
            "status": "COMPLETED" if context and context.founder_output else ("RUNNING" if context and context.current_step == "FOUNDER" else "PENDING"),
            "summary": "Researches founder backgrounds, education, and serial exit track records."
        },
        "market_analysis": {
            "name": "Market Analysis",
            "status": "COMPLETED" if context and context.market_output else ("RUNNING" if context and context.current_step == "MARKET" else "PENDING"),
            "summary": "Analyzes TAM, CAGR growth rate, competitor landscape, and market drivers."
        },
        "financial_analysis": {
            "name": "Financial Analysis",
            "status": "COMPLETED" if context and context.financial_output else ("RUNNING" if context and context.current_step == "FINANCIAL" else "PENDING"),
            "summary": "Assesses capitalization structure, ARR revenue scale, and financial risks."
        },
        "risk_assessment": {
            "name": "Risk Assessment",
            "status": "COMPLETED" if context and context.risk_output else ("RUNNING" if context and context.current_step == "RISK" else "PENDING"),
            "summary": "Evaluates multi-domain risks (Founder, Market, Financial, Legal/Regulatory)."
        },
        "investment_memo": {
            "name": "Investment Memo",
            "status": "COMPLETED" if context and context.memo_output else ("RUNNING" if context and context.current_step == "MEMO" else "PENDING"),
            "summary": "Synthesizes final VC Investment Memo, composite score, and recommendation."
        },
    }

    return {
        "job_id": job_id,
        "startup_name": startup_name,
        "status": job["status"],
        "current_step": context.current_step if context else "INIT",
        "steps_progress": steps_progress,
        "error": job.get("error"),
    }


@app.get("/api/results/{job_id}")
@app.get("/results/{job_id}")
def get_job_results(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job ID not found.")

    job = jobs[job_id]
    if job["status"] == "RUNNING" or job["status"] == "QUEUED":
        return {
            "job_id": job_id,
            "status": job["status"],
            "message": "Analysis is still in progress.",
            "result": None,
        }

    if job["status"] == "ERROR":
        return {
            "job_id": job_id,
            "status": "ERROR",
            "error": job.get("error"),
            "result": None,
        }

    startup_name = job["startup_name"]
    context = SharedContextManager.load(startup_name)
    context_dump = context.model_dump() if context else {}

    return {
        "job_id": job_id,
        "status": "COMPLETED",
        "startup_name": startup_name,
        "memo": job["result"],
        "full_context": context_dump,
    }
