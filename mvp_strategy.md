# Implementation Plan & Design - FDE Demo Factory

## 1. User Journey
1. **Input**: FDE provides the target company's website and LinkedIn URLs.
2. **Analysis**: System researches the web to compile a structured company intelligence profile containing facts, inferences, and opportunities.
3. **Review & Selection**: FDE reviews 3-5 generated AI/automation opportunities and selects the most compelling one for the client.
4. **Blueprint Generation**: System generates a complete demo blueprint for the selected opportunity.
5. **(Future) Demo Building**: The build agent (Antigravity) generates synthetic data, React frontend, FastAPI backend, and architecture documents.
6. **(Future) Demo Presentation**: FDE downloads the Demo Pack and presents the working POC to the client.

## 2. System Workflow
- `POST /api/research`: Accepts URLs, orchestrates web searches, and builds company profile.
- `POST /api/opportunities`: Uses company profile to generate 3-5 opportunities.
- `POST /api/blueprint`: Accepts the FDE-selected opportunity and outputs the demo blueprint schema.
- *(Future)* `POST /api/build`: Triggers Antigravity agent to generate code based on the blueprint.

## 3. Research Architecture
- **Web Research Layer**: Utilizes search APIs (e.g., SERP API) to find press releases, news, and technical blogs.
- **Scraping Layer**: Extracts text from identified URLs.
- **Reasoning Layer (Gemini)**: Extracts entities, facts, and signals from text.
- **Fact DB**: Stores findings with source URL, date, and confidence level to maintain traceability.

## 4. Opportunity-Generation Workflow
- Input: Structured company intelligence.
- Reasoning (Gemini): Maps company pain points and industry signals to known AI automation patterns.
- Filtering: Discards ideas lacking public evidence or demo feasibility.
- Output: 3-5 structured opportunities formatted consistently for FDE review.

## 5. Data Model / Conceptual Entities
- **Company**: `{ id, name, industry, website, linkedin, scale, business_model, overview }`
- **Signal/Fact**: `{ id, company_id, finding, type (fact|inference), source_url, date, confidence }`
- **Opportunity**: `{ id, company_id, name, business_problem, evidence_ids, approach, potential_value, demo_feasibility }`
- **Demo Blueprint**: `{ id, opportunity_id, user_journey, screens, ai_components, synthetic_data_schema }`

## 6. Quality Gates
- **Research Gate**: A finding must have a valid `source_url`.
- **Opportunity Gate**: Must link to at least one factual signal as evidence.
- **Blueprint Gate**: Must define synthetic data explicitly to prevent hallucinated client data.

## 7. MVP Boundaries & Future Roadmap
- **MVP**: Only implements the workflow up to **Demo Blueprint Generation**. Uses a simple CLI or basic UI to orchestrate Gemini research and selection.
- **V2**: Integration with Antigravity to fully generate the React/FastAPI mini-application and Demo Pack.
- **V3**: Expanded industry templates and feedback loop based on FDE demo success rates.

## 8. Implementation Plan
- **Phase 1**: Scaffold FastAPI backend and React frontend.
- **Phase 2**: Implement the Web Research and Scraping layers.
- **Phase 3**: Integrate Gemini prompts for Company Intelligence and Opportunity Generation.
- **Phase 4**: Implement FDE selection endpoint and Demo Blueprint generation.
- **Phase 5**: End-to-end testing with 5-10 sample companies across different industries.

## 9. Risks and Mitigations
- **Risk**: Hallucinations in company intelligence.
  - *Mitigation*: Strict prompting to distinguish facts from inferences; mandatory source links.
- **Risk**: High latency in web research.
  - *Mitigation*: Run scraping asynchronously and limit search depth/time.
- **Risk**: Vague or overly generic opportunities.
  - *Mitigation*: Provide Gemini with few-shot examples of high-quality, specific opportunities.
