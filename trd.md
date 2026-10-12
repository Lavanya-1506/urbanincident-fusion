TRD — Technical Requirements Document
2.1 Logical architecture
#chatgpt-mermaid-_r_2sb_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-_r_2sb_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_2sb_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_2sb_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-_r_2sb_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2sb_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-_r_2sb_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-_r_2sb_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-_r_2sb_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-_r_2sb_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-_r_2sb_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-_r_2sb_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_2sb_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_2sb_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-_r_2sb_ p{margin:0;}#chatgpt-mermaid-_r_2sb_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2sb_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2sb_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2sb_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-_r_2sb_ .label text,#chatgpt-mermaid-_r_2sb_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2sb_ .node rect,#chatgpt-mermaid-_r_2sb_ .node circle,#chatgpt-mermaid-_r_2sb_ .node ellipse,#chatgpt-mermaid-_r_2sb_ .node polygon,#chatgpt-mermaid-_r_2sb_ .node path{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-_r_2sb_ .rough-node .label text,#chatgpt-mermaid-_r_2sb_ .node .label text,#chatgpt-mermaid-_r_2sb_ .image-shape .label,#chatgpt-mermaid-_r_2sb_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-_r_2sb_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-_r_2sb_ .rough-node .label,#chatgpt-mermaid-_r_2sb_ .node .label,#chatgpt-mermaid-_r_2sb_ .image-shape .label,#chatgpt-mermaid-_r_2sb_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-_r_2sb_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-_r_2sb_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_2sb_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-_r_2sb_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-_r_2sb_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-_r_2sb_ .edgeLabel{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-_r_2sb_ .edgeLabel p{background-color:rgb(0, 0, 0);}#chatgpt-mermaid-_r_2sb_ .edgeLabel rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-_r_2sb_ .labelBkg{background-color:rgba(0, 0, 0, 0.5);}#chatgpt-mermaid-_r_2sb_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-_r_2sb_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2sb_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2sb_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-_r_2sb_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2sb_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-_r_2sb_ .icon-shape,#chatgpt-mermaid-_r_2sb_ .image-shape{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-_r_2sb_ .icon-shape p,#chatgpt-mermaid-_r_2sb_ .image-shape p{background-color:rgb(0, 0, 0);padding:2px;}#chatgpt-mermaid-_r_2sb_ .icon-shape .label rect,#chatgpt-mermaid-_r_2sb_ .image-shape .label rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-_r_2sb_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-_r_2sb_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-_r_2sb_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-_r_2sb_ [data-look="neo"].node rect,#chatgpt-mermaid-_r_2sb_ [data-look="neo"].cluster rect,#chatgpt-mermaid-_r_2sb_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-_r_2sb_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_2sb_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-_r_2sb_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-_r_2sb_-gradient);stroke-width:1px;}#chatgpt-mermaid-_r_2sb_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_2sb_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-_r_2sb_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-_r_2sb_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_2sb_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-_r_2sb_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-_r_2sb_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_2sb_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-_r_2sb_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_2sb_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(153, 206, 255);}#chatgpt-mermaid-_r_2sb_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(153, 206, 255);}#chatgpt-mermaid-_r_2sb_ .node tspan[font-weight="normal"],#chatgpt-mermaid-_r_2sb_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-_r_2sb_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-width:1px;}#chatgpt-mermaid-_r_2sb_ .node rect,#chatgpt-mermaid-_r_2sb_ .node circle,#chatgpt-mermaid-_r_2sb_ .node ellipse,#chatgpt-mermaid-_r_2sb_ .node polygon,#chatgpt-mermaid-_r_2sb_ .node path{fill:rgb(0, 40, 77);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-_r_2sb_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-_r_2sb_ .node.mermaid-decision .label-container{fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-dasharray:2,2;}#chatgpt-mermaid-_r_2sb_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-_r_2sb_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_2sb_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Public APIs / Sensors / FilesSource AdaptersImmutable Raw StorageValidation and NormalizationQuality Gate and QuarantineEvent Queue / StreamDeduplication and CandidateRetrievalIncident Fusion EngineVersioned Incident StateEvidence and HypothesisEngineAssessment and Audit LedgerFastAPIReact Operator Web AppPostgreSQL / PostGISDataset and Replay PipelineTraining and EvaluationModel RegistryModel Serving





2.2 Recommended stack
Layer	Technology	Purpose
Web application	React, TypeScript, Vite	Operator interface
Styling	CSS variables with a consistent component system	Maintainable visual design
Maps	MapLibre GL JS	Spatial investigation
Charts	Recharts or a lightweight alternative	Trends and analytics
API	FastAPI, Pydantic	Validated HTTP endpoints
Database	PostgreSQL	Authoritative operational state
Spatial queries	PostGIS	Distance, area, and spatial relationship queries
Migrations	Alembic	Version-controlled schema changes
Async processing	Python workers initially	Background processing
Streaming	Kafka, with Flink when justified	Durable streams and event-time processing
Raw/analytical storage	Object storage, Parquet	Immutable data and reproducible datasets
ML baselines	scikit-learn, LightGBM	Classification, ranking, anomaly detection
Model tracking	MLflow or equivalent	Experiments, artifacts, and model versions
Testing	Pytest, Vitest, Playwright	Backend, frontend, and end-to-end tests
Observability	OpenTelemetry, Prometheus, Grafana	Logs, traces, metrics, and alerts
Deployment	Docker, CI/CD; Kubernetes when justified	Repeatable releases and scaling
Infrastructure	Terraform when infrastructure grows	Reproducible cloud provisioning
Technology trade-offs
- FastAPI before microservices: one modular backend is easier for a small team to develop, test, and deploy. Split services based on measured load or independent scaling needs.
- PostgreSQL before a graph database: incident/evidence relationships can initially be represented with relational tables. Add a graph database only if query patterns justify it.
- Workers before Kafka/Flink: build a reliable vertical slice first. Introduce streaming infrastructure when throughput, replay, ordering, or event-time requirements justify the operational cost.
- Deterministic logic before LLMs: validation, duplicate fingerprints, severity rules, and evidence references should not depend on a language model.
- Model training is separate from inference: training jobs should not run inside ordinary web request handlers.
2.3 Backend modules
Organize the backend by domain, even if it initially runs as one deployable application.
1. Identity and access: users, roles, permissions, sessions.
2. Source ingestion: adapters, authentication to data providers, polling/webhooks.
3. Event normalization: schema validation, unit conversion, timestamp handling, geospatial validation.
4. Quality and trust: freshness, missing fields, source reliability, quarantine.
5. Deduplication: exact fingerprints and near-duplicate candidates.
6. Incident fusion: candidate generation, association, separation, deferred decisions.
7. Evidence management: source references, observations, provenance.
8. Assessment engine: severity, hypotheses, confidence and uncertainty.
9. Incident lifecycle: status, assignments, notes, overrides.
10. Audit and replay: append-only events, assessment revisions, replay inputs and outputs.
11. Analytics: aggregate queries and historical metrics.
12. Model management: inference versions, evaluation records, deployment metadata.
2.4 Canonical event contract
Every adapter should translate its source format into a common event model.

{
  "event_id": "evt_01JEXAMPLE",
  "source_id": "src_weather_01",
  "source_record_id": "provider-record-123",
  "event_type": "weather_observation",
  "occurred_at": "2026-10-12T06:25:00Z",
  "observed_at": "2026-10-12T06:25:00Z",
  "ingested_at": "2026-10-12T06:26:12Z",
  "location": {
    "latitude": 19.076,
    "longitude": 72.8777
  },
  "payload": {
    "rainfall_mm": 24.5
  },
  "quality": {
    "is_valid": true,
    "is_stale": false,
    "flags": []
  },
  "schema_version": "1.0"
}



This is an illustrative contract, not a claim that a real source has supplied this record. In production, use a schema definition, explicit units, source-specific validation, and documented nullable fields. Do not invent location coordinates for records that lack them.
2.5 Real-time processing requirements
The processing system must support:
- Idempotent ingestion so retrying a message does not create duplicate observations.
- Event-time processing, including delayed and out-of-order records.
- Dead-letter or quarantine handling for invalid messages.
- Backpressure and bounded queues when downstream services are overloaded.
- Retry policies with exponential backoff and dead-letter limits.
- Reprocessing of historical inputs using recorded code and model versions.
- Versioned event and API schemas.
- Monitoring for queue lag, processing failures, and source freshness.
Exactly-once delivery should not be assumed across an entire distributed architecture. Design for at-least-once delivery with idempotent consumers and explicit database transaction boundaries.
2.6 ML and inference requirements
Use separate models or rules for separate tasks.
Task	Initial implementation	Later option
Anomaly detection	Rolling statistical baselines, robust thresholds	Isolation Forest or time-series model
Event classification	Rules and a TF-IDF baseline	Embedding-based classifier
Duplicate detection	Canonical fingerprints and similarity thresholds	Learned pairwise ranking
Incident association	Spatial/temporal candidate retrieval plus rules	LightGBM ranker/classifier
Severity	Transparent impact rubric and safety overrides	Calibrated ordinal/impact model
Cause hypotheses	Constrained evidence rules and hypothesis ranking	Validated probabilistic model where labels support it
Explanation	Templates using structured evidence	Optional bounded LLM generation
A time-series forecasting model can be introduced for supported signals with sufficient historical coverage. It should not be added just because a model is available.
2.7 Security and privacy requirements
- Use TLS for network traffic and encrypt sensitive stored data.
- Store secrets in a secret manager, not in frontend environment variables or source control.
- Enforce authorization on the backend for every protected operation.
- Validate payloads, file uploads, query parameters, and webhook signatures.
- Apply rate limits and request-size limits.
- Avoid storing unnecessary personal data from public reports.
- Sanitize untrusted report text before display.
- Treat source text as data, never as trusted instructions for an LLM.
- Log administrative and operational changes with access controls.
- Keep test data and synthetic data clearly separated from real production records.
- Define retention and deletion rules for raw data, audit data, and user information.
2.8 Reliability and scaling
Design for independently scalable ingestion, fusion, and inference workloads. Scale only the components whose load measurements justify it.
Required protections include database indexes, connection pooling, bounded inference timeouts, circuit breakers, queue monitoring, backups, tested recovery, and load tests.
For every service, document its expected throughput, p95/p99 latency target, failure behavior, retry strategy, and owner before a production release.