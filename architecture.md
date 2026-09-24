# FDE Demo Factory MVP Architecture

## Core Components
- **Application Layer**: Controls the FDE workflow (research, company context, opportunity generation, demo blueprint, project state).
- **Build Agent (Antigravity)**: Owns code generation, frontend/backend implementation, testing, and creating project artifacts.
- **Frontend**: React / Vite
- **Backend**: Python / FastAPI
- **AI / Reasoning**: Gemini on Google Cloud
- **Storage**: Lightweight Google Cloud Datastore (e.g., Firestore)

## Workflow
1. **Input**: FDE enters Automotive company website + LinkedIn.
2. **Research Module**: Collects signals on manufacturing, supply chain, quality, after-sales.
3. **Opportunity Generation**: Evaluates research and suggests 3-5 use cases (e.g., Supplier Risk Intelligence, Quality Assistant).
4. **FDE Selection**: FDE chooses the best use case.
5. **Blueprint Generation**: Defines the user journey, screens, workflow, and demo data schema.
6. **Build Agent Execution**: Generates synthetic data, React frontend, FastAPI backend, and architecture docs.
7. **Demo Pack Export**: Outputs the working demo, scripts, README, and GitHub repo for the FDE.
