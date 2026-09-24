# FDE Demo Factory

FDE Demo Factory is an internal tool designed for Forward Deployed Engineers (FDEs). It accelerates the preparation process for client meetings by automatically researching a target company and discovering AI/automation opportunities.

## What has been done so far

1. **Genesis Initialization & Planning**
   - Initialized a new Genesis project (`.genesis/`).
   - Drafted a rigorous `SPEC.md` focusing on an industry-agnostic approach, limiting the MVP to Blueprint Generation and omitting live client data integration.
   - Designed an `implementation_plan.md` defining the user journey, system workflow, data model, architecture, and quality gates.
   - Built a visual `workflow.md` using Mermaid to map the entire data flow from company URL ingestion to the final Demo Pack.
   - Approved the product specification and implementation plan.

2. **Phase 1: Project Scaffolding**
   - Scaffolding the React/Vite frontend environment (`frontend/`).
   - Scaffolding the Python FastAPI backend environment with a virtual environment (`backend/`).
   - Installed core dependencies: FastAPI, Uvicorn, Pydantic, HTTPX, and BeautifulSoup.

3. **Phase 2: Research Module Core**
   - **Data Models**: Created Pydantic models (`backend/models.py`) mapping directly to the spec, including `ResearchRequest`, `CompanyIntelligence`, and `Signal` (to strictly classify facts vs. inferences).
   - **Research Engine**: Implemented an async web scraper in `backend/research_engine.py` to extract text from target URLs. 
   - **API Integration**: Linked the FastAPI `POST /api/research` endpoint in `backend/main.py` directly to the `research_engine`.
   - **Real Gemini Integration**: Replaced the initial mock with the official `google-genai` SDK, using the `gemini-3.5-flash-lite` model and Structured Outputs to strictly enforce the `CompanyIntelligence` schema.
   - **CORS & Error Handling**: Configured explicit CORS origins and global exception handling to elegantly stream API errors back to the frontend UI.

4. **Phase 3: Opportunity Discovery**
   - **Data Models**: Added `Opportunity` and `OpportunityList` Pydantic models to `backend/models.py`.
   - **Opportunity Engine**: Implemented `backend/opportunity_engine.py` using a highly-specific Gemini prompt to brainstorm 3-5 distinct, targeted AI/Automation use cases based on the scraped Company Intelligence.
   - **Live Web Search (Option B)**: Integrated `duckduckgo-search` to automatically query the web (`"{Opportunity Title} {Industry} AI case study"`) and attach real-world supporting source URLs to the generated opportunities.
   - **Frontend UI**: Enhanced the React app to display a "Brainstorm AI Opportunities" button. Rendered the generated opportunities as interactive, selectable glass-morphism cards, complete with pill-shaped external links for the supporting sources.
