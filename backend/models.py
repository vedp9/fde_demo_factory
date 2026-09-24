from pydantic import BaseModel, HttpUrl
from typing import List, Optional

class ResearchRequest(BaseModel):
    company_website: HttpUrl
    linkedin_url: HttpUrl
    client_notes: Optional[str] = None

class Signal(BaseModel):
    finding: str
    signal_type: str  # 'fact' | 'inference' | 'hypothesis'
    source_url: str
    confidence: str   # 'High' | 'Medium' | 'Low'

class CompanyIntelligence(BaseModel):
    company_name: str
    industry: str
    overview: str
    signals: List[Signal]

class Opportunity(BaseModel):
    title: str
    business_problem: str
    potential_ai_solution: str
    business_value: str
    complexity: str # 'Low', 'Medium', 'High'
    confidence: str # 'High', 'Medium', 'Low'
    supporting_sources: List[str] = []

class OpportunityList(BaseModel):
    opportunities: List[Opportunity]
