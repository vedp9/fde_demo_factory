import os
from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel
from googlesearch import search
from models import CompanyIntelligence, Opportunity, OpportunityList

load_dotenv()

# We only define an internal output schema that Gemini uses.
class GeminiOpportunity(BaseModel):
    title: str
    business_problem: str
    potential_ai_solution: str
    business_value: str
    complexity: str
    confidence: str

class GeminiOpportunityList(BaseModel):
    opportunities: list[GeminiOpportunity]


async def generate_opportunities(intelligence: CompanyIntelligence) -> OpportunityList:
    """
    Takes the structured company intelligence and uses Gemini to brainstorm 
    3-5 distinct, highly relevant AI/Automation use cases. 
    Then searches the web for supporting sources.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        raise ValueError("GEMINI_API_KEY is not set. Please set it in your .env file.")

    client = genai.Client(api_key=api_key)

    prompt = f"""
    You are an expert AI Solutions Architect and Forward Deployed Engineer.
    Based on the following company intelligence, brainstorm 3 to 5 highly specific and actionable AI or automation opportunities for this business.
    
    Company Name: {intelligence.company_name}
    Industry: {intelligence.industry}
    Overview: {intelligence.overview}
    
    Extracted Signals:
    {chr(10).join([f"- {s.signal_type} ({s.confidence} confidence): {s.finding}" for s in intelligence.signals])}
    
    For each opportunity, provide:
    - title: A short, catchy name for the solution.
    - business_problem: The specific pain point being addressed.
    - potential_ai_solution: How AI/automation solves the problem technically.
    - business_value: The expected ROI or impact.
    - complexity: 'Low', 'Medium', or 'High'
    - confidence: 'Low', 'Medium', or 'High' based on how likely they need this.
    """

    response = client.models.generate_content(
        model='gemini-3.5-flash-lite',
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': GeminiOpportunityList,
        },
    )

    if response.parsed:
        gemini_out = response.parsed
        opportunities = []
        
        for opp in gemini_out.opportunities:
            sources = []
            try:
                # Create a targeted search query for case studies or blogs
                search_query = f"{opp.title} {intelligence.industry} AI case study"
                
                # Retrieve top 2 results using Google Search
                for j in search(search_query, num=2, stop=2, pause=2.0):
                    sources.append(j)
            except Exception as e:
                print(f"Search failed for {opp.title}: {e}")
            
            opportunities.append(
                Opportunity(
                    title=opp.title,
                    business_problem=opp.business_problem,
                    potential_ai_solution=opp.potential_ai_solution,
                    business_value=opp.business_value,
                    complexity=opp.complexity,
                    confidence=opp.confidence,
                    supporting_sources=sources
                )
            )
            
        return OpportunityList(opportunities=opportunities)
    else:
        raise Exception("Failed to parse Gemini output for opportunities.")
