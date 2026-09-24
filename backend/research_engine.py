import os
import httpx
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from models import ResearchRequest, CompanyIntelligence, Signal

load_dotenv()

# We only define an internal output schema that Gemini uses.
class GeminiSignal(BaseModel):
    finding: str
    signal_type: str
    source_url: str
    confidence: str

class GeminiIntelligence(BaseModel):
    company_name: str
    industry: str
    overview: str
    signals: list[GeminiSignal]

async def fetch_page_text(url: str) -> str:
    """Fetches a webpage and extracts its text."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0, follow_redirects=True)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.extract()
                
            text = soup.get_text(separator=' ', strip=True)
            # Truncate text to avoid token limits for basic scraping
            return text[:40000]
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

async def generate_company_intelligence(request: ResearchRequest) -> CompanyIntelligence:
    """
    Orchestrates the research process:
    1. Scrapes the company website.
    2. Sends the scraped text to the Gemini API for reasoning and extraction.
    3. Returns a structured CompanyIntelligence profile.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        raise ValueError("GEMINI_API_KEY is not set. Please set it in your .env file.")

    client = genai.Client(api_key=api_key)

    # 1. Scrape content
    website_text = await fetch_page_text(str(request.company_website))
    
    if not website_text:
        raise ValueError(f"Could not scrape any text from {request.company_website}")

    # 2. Gemini Reasoning Layer
    prompt = f"""
    You are an expert business analyst and Forward Deployed Engineer (FDE).
    Analyze the following scraped text from the company website: {request.company_website}
    
    Website Text:
    {website_text}
    
    Extract the company name, industry, and a professional overview.
    Then, extract 3-5 distinct 'signals'. A signal is either a 'fact' (explicitly stated), 
    an 'inference' (a logical deduction), or a 'hypothesis' (an educated guess about their problems).
    Classify the confidence as 'High', 'Medium', or 'Low'. Ensure the source_url points to the provided website URL.
    """

    response = client.models.generate_content(
        model='gemini-3.7-flash',
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': GeminiIntelligence,
        },
    )

    # 3. Construct the response from the parsed JSON object
    if response.parsed:
        gemini_out = response.parsed
        signals = [
            Signal(
                finding=sig.finding,
                signal_type=sig.signal_type,
                source_url=sig.source_url,
                confidence=sig.confidence
            ) for sig in gemini_out.signals
        ]
        
        return CompanyIntelligence(
            company_name=gemini_out.company_name,
            industry=gemini_out.industry,
            overview=gemini_out.overview,
            signals=signals
        )
    else:
        raise Exception("Failed to parse Gemini output.")
