from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ResearchRequest, CompanyIntelligence, OpportunityList
from research_engine import generate_company_intelligence
from opportunity_engine import generate_opportunities

app = FastAPI(title="FDE Demo Factory API", description="API for researching companies and discovering AI opportunities.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/research", response_model=CompanyIntelligence)
async def perform_research(request: ResearchRequest):
    """
    Ingest a company website and LinkedIn URL to perform research and produce a structured company intelligence brief.
    """
    try:
        result = await generate_company_intelligence(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/opportunities", response_model=OpportunityList)
async def perform_opportunity_discovery(intelligence: CompanyIntelligence):
    """
    Take a CompanyIntelligence profile and generate 3-5 specific AI/Automation opportunities using Gemini.
    """
    try:
        result = await generate_opportunities(intelligence)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
