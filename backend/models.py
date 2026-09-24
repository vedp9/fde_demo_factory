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
