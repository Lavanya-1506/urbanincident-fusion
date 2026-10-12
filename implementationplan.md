Implementation Plan
The recommended approach is to build one complete working workflow first, then add intelligence, streaming, and production infrastructure. Do not build every service, train every model, or create every UI page before the first end-to-end workflow works.
6.1 Development phases and release gates

Phase 0 — Requirements and contracts
Foundation

Define incident ontology, user roles, source contracts, threat model, and acceptance tests.
- Finalize the PRD and technical decisions.
- Define canonical observation and incident schemas.
- Select a small number of public datasets.
- Establish Git workflow, coding conventions, and CI checks.
- Create sample data, including labelled synthetic scenarios.
  Exit gate: schemas, requirements, and test scenarios are reviewed and version-controlled.




Phase 1 — Data pipeline and database
Implement the ingestion-to-storage workflow.
- Build source adapters.
- Validate and normalize timestamps, units, locations, and payloads.
- Store raw source references and canonical observations.
- Add duplicate protection, quality flags, and ingestion logs.
- Create database migrations and seed data.
  Exit gate: repeated ingestion does not create duplicate observations, and invalid data is inspectable.




Phase 2 — Backend vertical slice
Build the first complete incident workflow.
- Implement FastAPI routes and authorization.
- Create incident records and observation relationships.
- Implement basic rule-based correlation.
- Add status transitions, audit records, and assessment versions.
- Publish an OpenAPI contract.
  Exit gate: an API client can retrieve an incident, inspect its evidence, update its status, and retrieve its history.




Phase 3 — Frontend MVP
Connect the real UI to the backend.
- Build the application shell and navigation.
- Implement dashboard, incident explorer, live map, and investigation workspace.
- Integrate real API data.
- Add loading, empty, stale, error, and permission states.
- Add unit, component, and end-to-end tests.
  Exit gate: an operator can complete the primary investigation workflow without mock data.




Phase 4 — Fusion and ML baselines
Make the intelligence measurable.
- Build a leakage-safe labelled dataset.
- Establish deterministic baselines for duplicate detection and incident association.
- Train and compare lightweight classifiers or rankers where labels support them.
- Add hypothesis evidence, contradiction tracking, and uncertainty.
- Record model versions and evaluation results.
  Exit gate: measured performance beats or justifies the baseline, and uncertain matches can be deferred.




Phase 5 — Evidence ledger and replay
Deliver the strongest product differentiator.
- Implement immutable assessment history.
- Add event timeline and incident relationship views.
- Record source, model, rules, and evidence references per assessment.
- Implement deterministic historical replay.
- Add counterfactual runs and baseline-versus-replay comparisons.
  Exit gate: the team can reproduce an assessment and explain why a replay produces a different result.




Phase 6 — Production hardening
Prepare for realistic traffic and operational failures.
- Load, security, integration, and resilience testing.
- Backups, restoration drills, metrics, tracing, and alerts.
- Review access controls and data retention.
- Introduce Kafka/Flink and independent service deployment if measurements justify them.
- Test staged releases, rollback, and model monitoring.
  Exit gate: documented SLOs are met under agreed workloads, recovery procedures are tested, and unresolved risks are recorded.



6.2 Team allocation for 3–4 people
Avoid assigning one person to the entire frontend and another to the entire backend without integration checkpoints. Each person should own a clear domain, with shared contracts.
Member 1 — Frontend and UX
React, TypeScript, MapLibre, dashboard, incident explorer, investigation workspace, API integration, accessibility.


Member 2 — Backend and database
FastAPI, PostgreSQL/PostGIS, authentication, incident lifecycle, evidence APIs, audit history, migrations.


Member 3 — Data engineering and fusion
Public data ingestion, normalization, deduplication, candidate retrieval, event association, data quality.


Member 4, if available — ML, evaluation, and platform
Dataset labeling, model baselines, evaluation, replay, CI/CD, observability, and integration tests.


For a three-person team, combine Member 4's work with the data/fusion role and distribute infrastructure tasks across the team. One person should own end-to-end integration and release coordination, even if that responsibility rotates.
6.3 Suggested first four development iterations
Use these as implementation milestones, not fixed calendar estimates.
Iteration	Deliverable	Demonstration
1	Schemas, source adapter, database, seeded data	A validated observation is stored and retrieved
2	FastAPI incident APIs, basic correlation, audit history	Related observations can be inspected under an incident
3	React dashboard, incident explorer, map, investigation page	User completes an investigation through the UI
4	ML baseline, evidence-backed assessment, version history	System explains a relationship and preserves assessment changes
Replay, advanced causal hypotheses, and distributed streaming should follow once this foundation is tested.
6.4 Repository structure
Start with a modular monorepo. Add directories when a component exists; avoid creating dozens of empty services prematurely.
urbanincident-fusion/
├── apps/
│   └── operator-web/
│       ├── src/
│       │   ├── app/
│       │   ├── routes/
│       │   ├── components/
│       │   ├── features/
│       │   │   ├── dashboard/
│       │   │   ├── incidents/
│       │   │   ├── map/
│       │   │   ├── evidence/
│       │   │   ├── investigations/
│       │   │   ├── replay/
│       │   │   └── analytics/
│       │   ├── api/
│       │   ├── hooks/
│       │   └── types/
│       └── tests/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   ├── core/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── ingestion/
│   │   ├── fusion/
│   │   ├── assessment/
│   │   ├── audit/
│   │   └── replay/
│   ├── migrations/
│   └── tests/
├── ml/
│   ├── datasets/
│   ├── features/
│   ├── anomaly_detection/
│   ├── event_classification/
│   ├── entity_resolution/
│   ├── hypothesis_ranking/
│   ├── training/
│   └── evaluation/
├── data-platform/
│   ├── connectors/
│   ├── normalization/
│   ├── quality/
│   └── labeling/
├── contracts/
│   ├── events/
│   ├── openapi/
│   └── schemas/
├── tests/
│   ├── integration/
│   ├── end_to_end/
│   ├── replay/
│   ├── load/
│   └── security/
├── infra/
│   ├── docker/
│   ├── deployment/
│   └── monitoring/
├── docs/
│   ├── prd.md
│   ├── trd.md
│   ├── app-flow.md
│   ├── ui-ux-brief.md
│   ├── backend-schema.md
│   ├── implementation-plan.md
│   ├── architecture-decisions/
│   └── runbooks/
├── docker-compose.yml
├── Makefile
├── .env.example
└── README.md


6.5 Testing strategy
Test level	What to verify
Unit tests	Validation, normalization, duplicate matching, severity rules
API tests	Permissions, schemas, pagination, state transitions, error responses
Database tests	Foreign keys, uniqueness, assessment versioning, spatial queries
Contract tests	Frontend and backend agree on request and response schemas
Integration tests	Ingestion through fusion to persisted incident assessment
End-to-end tests	User can find, investigate, and update an incident
ML tests	Leakage prevention, false merges, false splits, calibration, subgroup quality
Replay tests	Same recorded inputs and versions reproduce the same deterministic outputs
Load tests	Sustained ingestion, concurrent users, queue lag, and API latency
Security tests	Tenant isolation, privilege escalation, injection, secret exposure
Resilience tests	Source outages, delayed messages, inference timeouts, database failures
Use synthetic data to test edge cases, but maintain a separate evaluation set of appropriately labelled real observations wherever possible.
6.6 CI/CD and deployment sequence
1. On each pull request, run linting, type checking, unit tests, schema checks, and security scans.
2. Run database migration tests and backend/frontend contract tests.
3. Build versioned frontend and backend artifacts.
4. Deploy to a staging environment with controlled test data.
5. Run integration, end-to-end, and smoke tests.
6. For ML changes, require an evaluation report and model-release decision.
7. Deploy through a staged rollout; monitor error rate, latency, data quality, and model behavior.
8. Roll back if release criteria fail.
Store credentials in a secret manager. Keep production data separate from development fixtures and synthetic test data.
6.7 Definition of done
A feature is not complete merely because its UI appears to work.
Every feature must have:
- A documented requirement and API contract.
- Server-side authorization where applicable.
- Database integrity and migration coverage.
- Loading, empty, error, and stale-data handling.
- Unit and integration tests.
- Logging and monitoring for important failures.
- Documentation for its behavior and limitations.
- A verified demonstration using real backend responses.