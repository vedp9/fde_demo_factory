from fastapi import FastAPI
from models import ResearchRequest, CompanyIntelligence
from research_engine import generate_company_intelligence

app = FastAPI(title="FDE Demo Factory API", description="API for researching companies and discovering AI opportunities.")

@app.post("/api/research", response_model=CompanyIntelligence)
async def perform_research(request: ResearchRequest):
    """
    Ingest a company website and LinkedIn URL to perform research and produce a structured company intelligence brief.
    """
    # Orchestrate research and reasoning
    result = await generate_company_intelligence(request)
    return result

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
