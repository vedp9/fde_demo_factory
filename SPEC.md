# Product specification — fde-demo-factory

> Status: draft. A coding agent must not implement product code until this specification is approved through Genesis.

## Problem
FDE Demo Factory is an internal tool for Forward Deployed Engineers (FDEs). An FDE receives a company website and LinkedIn URL and has ~2 days to prepare a credible proof-of-concept. The product reduces manual research, providing a repeatable process from company context to a client-ready demo package. *Note: The actual demo-generation application is not built in this phase. The current phase is specification and planning.*

## Users
Forward Deployed Engineers (FDEs) who need to rapidly prepare client demos.

## Functional requirements
- FR-1: Must accept Company website URL and Company LinkedIn URL as required inputs.
- FR-2: Must perform public research beyond LinkedIn (news, PR) to extract signals.
- FR-3: Must output a source-backed structured company intelligence profile distinguishing facts from inferences.
- FR-4: Must identify 3-5 plausible AI/automation opportunities based on company context.
- FR-5: Must allow the FDE to review and select a single opportunity.
- FR-6: Must generate a Demo Blueprint for the selected opportunity.
- FR-7: Must generate synthetic demo data labeled explicitly to avoid using private client info.

## Non-functional requirements
- NFR-1: Must be industry-agnostic and dynamically understand any industry.
- NFR-2: Must optimize generated demos for credibility and storytelling over feature count.
- NFR-3: Must clearly separate the orchestration application from the build agent (Antigravity).

## Constraints
- Start with lightweight tools: React + Vite, Python + FastAPI, Gemini, Firestore.
- Code generation must be handled by Antigravity.

## Non-goals
- Full production deployment automation.
- Real client-system integrations.
- CRM/Billing/Multi-tenant SaaS capabilities.
- Complex multi-agent orchestration for its own sake.

## Acceptance criteria
- AC-1: Given URLs from an arbitrary industry, the system produces a valid intelligence profile.
- AC-2: Opportunity generation yields 3-5 options backed by public signals, not hallucinations.
- AC-3: Selecting an opportunity produces a comprehensive demo blueprint.
- AC-4: Synthetic data is generated matching the blueprint schema.

## Risks
- Hallucinated intelligence/inferences (Mitigation: strict source tracking and separation of facts).
- High latency in research (Mitigation: limit search depth).

## Open questions
- Public research source strategy, freshness, and reliability.
- Evidence/confidence model schema.
- Opportunity scoring/selection model.
