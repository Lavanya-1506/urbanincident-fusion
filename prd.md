1. PRD — Product Requirements Document
1.1 Product vision
UrbanIncident Fusion turns fragmented urban signals into connected, evidence-backed incident investigations.
A single event may generate a sensor reading, a public complaint, a weather observation, a traffic disruption, and several duplicate reports. Rather than showing these independently, the platform evaluates whether they describe the same incident, what the evidence supports, what remains uncertain, and how the assessment changes as new data arrives.
1.2 Problem statement
Current incident-monitoring workflows can suffer from:
- Information scattered across multiple dashboards and data sources.
- Duplicate reports that inflate the perceived scale of an incident.
- Delayed observations that make timelines misleading.
- Weak visibility into why an incident was classified or escalated.
- Conflicting evidence that is difficult to compare.
- Incident assessments that change without a clear historical explanation.
UrbanIncident Fusion addresses these problems through a unified investigation workspace, event correlation, evidence provenance, and versioned assessments.
1.3 Product objectives
Primary objectives
1. Combine heterogeneous data sources into a consistent incident view.
2. Identify potentially related events without merging unrelated incidents indiscriminately.
3. Show the evidence supporting each classification or hypothesis.
4. Maintain an auditable history of incident changes.
5. Enable operators to correct system decisions and record their reasoning.
6. Support reproducible testing against historical and synthetic scenarios.
Non-objectives for the first release
- Autonomous emergency dispatch.
- Guaranteed prediction of disasters or accidents.
- Universal causal discovery from observational data.
- A custom-trained foundation model or LLM.
- Replacing existing official emergency systems.
- Connecting every possible municipal data source before the core workflow works.
1.4 Target users
User	Primary needs	Permissions
Operations analyst	Monitor incidents, inspect evidence, prioritize investigations	View, investigate, annotate
Incident investigator	Review relationships, hypotheses, and history	Investigate, propose corrections, record findings
Operations supervisor	Review critical incidents, assign ownership, approve changes	Supervisor actions and overrides
Platform administrator	Manage access, data sources, and configuration	Administrative access
ML/data engineer	Inspect dataset quality, evaluation runs, and model versions	Restricted technical and evaluation tools
Use least-privilege permissions. Engineers should not automatically receive operational override privileges, and operators should not automatically receive access to sensitive infrastructure settings.
1.5 Functional requirements
Priority definitions: P0 = required for the first working release; P1 = next major release; P2 = advanced capability.
ID	Feature	Priority	Acceptance criteria
FR-01	Authentication	P0	Unauthorized users cannot access protected data
FR-02	Operations dashboard	P0	Displays current incident counts and update timestamps from the API
FR-03	Incident explorer	P0	Search, sort, paginate, and filter incidents
FR-04	Interactive map	P0	Displays geolocated incidents and opens incident details
FR-05	Incident detail	P0	Displays summary, status, severity, timestamps, and linked evidence
FR-06	Event normalization	P0	Supported source records map into a validated canonical schema
FR-07	Duplicate detection	P0	Likely duplicates are flagged without silently deleting original evidence
FR-08	Incident correlation	P0	Candidate events can be associated, kept separate, or deferred
FR-09	Evidence provenance	P0	Each evidence item links to its source and relevant timestamps
FR-10	Incident status workflow	P0	Authorized users can update status with a recorded audit entry
FR-11	Assessment history	P0	Previous assessments remain retrievable after an update
FR-12	Data-source health	P1	Shows freshness, failures, and source-level quality indicators
FR-13	Hypothesis comparison	P1	Displays alternatives, supporting evidence, contradictions, and unknowns
FR-14	Operator feedback	P1	Records corrections and reasons without silently changing training labels
FR-15	Timeline replay	P1	Reconstructs incident evolution from recorded events
FR-16	Relationship graph	P1	Visualizes links among incidents, observations, and reports
FR-17	Historical analytics	P1	Shows trends using a documented date range and data coverage
FR-18	Counterfactual replay	P2	Compares baseline and altered-evidence outcomes reproducibly
FR-19	Model evaluation view	P2	Shows model version, evaluation date, and quality metrics
FR-20	Advanced administration	P2	Provides governed source, role, and policy management
1.6 Core business rules
1. An incoming report is an observation, not automatically a distinct incident.
2. Multiple observations may belong to one incident, but association must be supported by explicit evidence or documented rules.
3. A missing measurement is unknown, not zero.
4. Conflicting observations must remain inspectable.
5. Severity and confidence are different concepts.
6. A new assessment creates a version; it does not erase the previous assessment.
7. An operator override records the actor, time, previous value, new value, and reason.
8. AI-generated explanations may reference only evidence supplied to the explanation engine.
9. The system must distinguish event occurrence time from ingestion time.
10. Synthetic scenario records must be clearly labelled and never presented as real-world observations.
1.7 Incident lifecycle
#chatgpt-mermaid-_r_2s2_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-_r_2s2_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_2s2_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_2s2_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-_r_2s2_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2s2_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-_r_2s2_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-_r_2s2_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-_r_2s2_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-_r_2s2_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-_r_2s2_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-_r_2s2_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_2s2_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_2s2_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-_r_2s2_ p{margin:0;}#chatgpt-mermaid-_r_2s2_ defs [id$="-barbEnd"]{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_2s2_ g.stateGroup text{fill:rgb(31, 78, 148);stroke:none;font-size:10px;}#chatgpt-mermaid-_r_2s2_ g.stateGroup text{fill:rgb(237, 237, 237);stroke:none;font-size:10px;}#chatgpt-mermaid-_r_2s2_ g.stateGroup .state-title{font-weight:bolder;fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2s2_ g.stateGroup rect{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);}#chatgpt-mermaid-_r_2s2_ g.stateGroup line{stroke:rgb(175, 175, 175);stroke-width:1;}#chatgpt-mermaid-_r_2s2_ .transition{stroke:rgb(175, 175, 175);stroke-width:1;fill:none;}#chatgpt-mermaid-_r_2s2_ .stateGroup .composit{fill:transparent;border-bottom:1px;}#chatgpt-mermaid-_r_2s2_ .stateGroup .alt-composit{fill:#e0e0e0;border-bottom:1px;}#chatgpt-mermaid-_r_2s2_ .state-note{stroke:rgb(58, 132, 63);fill:rgb(48, 48, 48);}#chatgpt-mermaid-_r_2s2_ .state-note text{fill:rgb(237, 237, 237);stroke:none;font-size:10px;}#chatgpt-mermaid-_r_2s2_ .stateLabel .box{stroke:none;stroke-width:0;fill:rgb(9, 23, 44);opacity:0.5;}#chatgpt-mermaid-_r_2s2_ .edgeLabel .label rect{fill:rgb(9, 23, 44);opacity:0.5;}#chatgpt-mermaid-_r_2s2_ .edgeLabel{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-_r_2s2_ .edgeLabel p{background-color:rgb(0, 0, 0);}#chatgpt-mermaid-_r_2s2_ .edgeLabel rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-_r_2s2_ .edgeLabel .label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2s2_ .label div .edgeLabel{color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2s2_ .stateLabel text{fill:rgb(237, 237, 237);font-size:10px;font-weight:bold;}#chatgpt-mermaid-_r_2s2_ .node circle.state-start{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_2s2_ .node .fork-join{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_2s2_ .node circle.state-end{fill:rgb(31, 78, 148);stroke:transparent;stroke-width:1.5;}#chatgpt-mermaid-_r_2s2_ .end-state-inner{fill:transparent;stroke-width:1.5;}#chatgpt-mermaid-_r_2s2_ .node rect{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-_r_2s2_ .node polygon{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-_r_2s2_ [id$="-barbEnd"]{fill:rgb(175, 175, 175);}#chatgpt-mermaid-_r_2s2_ .statediagram-cluster rect{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-_r_2s2_ .cluster-label,#chatgpt-mermaid-_r_2s2_ .nodeLabel{color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2s2_ .statediagram-cluster rect.outer{rx:5px;ry:5px;}#chatgpt-mermaid-_r_2s2_ .statediagram-state .divider{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-_r_2s2_ .statediagram-state .title-state{rx:5px;ry:5px;}#chatgpt-mermaid-_r_2s2_ .statediagram-cluster.statediagram-cluster .inner{fill:transparent;}#chatgpt-mermaid-_r_2s2_ .statediagram-cluster.statediagram-cluster-alt .inner{fill:rgb(48, 48, 48);}#chatgpt-mermaid-_r_2s2_ .statediagram-cluster .inner{rx:0;ry:0;}#chatgpt-mermaid-_r_2s2_ .statediagram-state rect.basic{rx:5px;ry:5px;}#chatgpt-mermaid-_r_2s2_ .statediagram-state rect.divider{stroke-dasharray:10,10;fill:rgb(48, 48, 48);}#chatgpt-mermaid-_r_2s2_ .note-edge{stroke-dasharray:5;}#chatgpt-mermaid-_r_2s2_ .statediagram-note rect{fill:rgb(48, 48, 48);stroke:rgb(58, 132, 63);stroke-width:1px;rx:0;ry:0;}#chatgpt-mermaid-_r_2s2_ .statediagram-note rect{fill:rgb(48, 48, 48);stroke:rgb(58, 132, 63);stroke-width:1px;rx:0;ry:0;}#chatgpt-mermaid-_r_2s2_ .statediagram-note text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2s2_ .statediagram-note .nodeLabel{color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2s2_ .statediagram .edgeLabel{color:red;}#chatgpt-mermaid-_r_2s2_ [id$="-dependencyStart"],#chatgpt-mermaid-_r_2s2_ [id$="-dependencyEnd"]{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);stroke-width:1;}#chatgpt-mermaid-_r_2s2_ .statediagramTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_2s2_ [data-look="neo"].statediagram-cluster rect{fill:rgb(9, 23, 44);stroke:url(#chatgpt-mermaid-_r_2s2_-gradient);stroke-width:1;}#chatgpt-mermaid-_r_2s2_ [data-look="neo"].statediagram-cluster rect.outer{rx:5px;ry:5px;filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_2s2_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-_r_2s2_ [data-look="neo"].node rect,#chatgpt-mermaid-_r_2s2_ [data-look="neo"].cluster rect,#chatgpt-mermaid-_r_2s2_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-_r_2s2_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_2s2_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-_r_2s2_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-_r_2s2_-gradient);stroke-width:1px;}#chatgpt-mermaid-_r_2s2_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_2s2_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-_r_2s2_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-_r_2s2_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_2s2_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-_r_2s2_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-_r_2s2_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_2s2_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-_r_2s2_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_2s2_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}DetectedUnderReviewConfirmedDismissedMonitoringResolvedCandidate incident createdEvidence reviewedInvalid or false alertActive situationResolution verifiedNew contradictory evidenceReopened by new evidenceReconsideration





These statuses describe the operational workflow. A system-generated incident candidate should not be marked officially confirmed simply because a model produced a high score.
1.8 Success metrics
Establish baseline measurements before setting hard production targets.
Product metrics
- Median time from incident detection to first operator review.
- Percentage of investigations with evidence links and documented outcomes.
- Time required to understand why an assessment changed.
- Operator acceptance, rejection, and deferral rates.
- Percentage of incidents with complete source provenance.
ML metrics
- Incident association precision and recall.
- False-merge rate and false-split rate.
- Classification precision, recall, and macro-F1.
- Probability calibration when probabilities are displayed.
- Performance across locations, data sources, and incident categories.
- Robustness to missing, delayed, duplicated, and contradictory data.
Engineering metrics
- Ingestion-to-display latency.
- API p95 latency and error rate.
- Event-processing lag.
- Data-source freshness.
- Recovery time following a service failure.
- Replay reproducibility and audit completeness.
Do not declare the platform production-ready based on a good demo alone. Each metric needs a defined calculation, evaluation dataset, and acceptance threshold.