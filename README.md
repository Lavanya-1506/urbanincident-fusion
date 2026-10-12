# UrbanIncident Fusion & Causal Intelligence

Enterprise-grade urban incident intelligence platform that reconstructs city incidents from fragmented, delayed, duplicated, contradictory, and incomplete signals.

Built in accordance with the product requirements ([`prd.md`](file:///c:/Users/Gaurav%20Nilkute/OneDrive/Desktop/urbanincident-fusion/prd.md)), technical requirements ([`trd.md`](file:///c:/Users/Gaurav%20Nilkute/OneDrive/Desktop/urbanincident-fusion/trd.md)), application flow ([`applicationFlow.md`](file:///c:/Users/Gaurav%20Nilkute/OneDrive/Desktop/urbanincident-fusion/applicationFlow.md)), and UI/UX design brief ([`uiux.md`](file:///c:/Users/Gaurav%20Nilkute/OneDrive/Desktop/urbanincident-fusion/uiux.md)).

---

## 1. Product Capabilities

* **Geospatial 3D Procedural City & Map (`/map`)**:
  - Interactive Three.js (React Three Fiber + Drei) procedural urban grid with roads, traffic flows, procedural building blocks, dynamic waterlogging inundation depth layers, and IoT sensor beacons.
  - Smooth camera orbit/pan/zoom and incident fly-to inspection.
  - 2D tactical schematic fallback mode for low-spec environments.
  - Incident Quick Drawer for rapid assessment without leaving the map.

* **Operations Command Dashboard (`/dashboard`)**:
  - Live KPI metrics derived dynamically from incoming records (active incidents, critical alerts, ingestion rate, duplicate suppression ratio, fusion precision).
  - High-priority emergency banner with one-click workspace jump.
  - Prioritized incident triage queue and real-time ingestion pipeline health.

* **Incident Explorer & Registry (`/incidents`)**:
  - Multi-column sortable table with global search, status filters, severity filters, and data origin filters.
  - Export to CSV for audit and municipal reporting.

* **Incident Investigation Workspace (`/incidents/:id`)**:
  - **Evidence & Provenance**: Inspect individual evidence items with occurred vs. ingested timestamps (highlighting ingestion lag), confidence weights, and raw metric telemetry.
  - **Normalized Observations**: Canonical records matching the TRD 2.4 Event Contract. Flagged duplicates are grouped without silent deletion. Inspect raw canonical JSON.
  - **Causal Hypotheses & Explanations**: Ranked competing explanations, uncertainty levels, supporting/contradicting evidence links, explicit unknowns, and recommended operational interventions.
  - **Relationship Topology**: Interactive React Flow graph visualizing data sources, observations, fusion candidate clustering, and hypotheses.
  - **Audit Ledger & Operator Actions**: Immutable append-only audit trail recording the actor, time, previous value, new value, and mandatory rationale. Operator annotation note form.

* **Timeline & Scenario Replay Lab (`/replay`)**:
  - Step-by-step reconstruction of the initial monsoonal surge scenario (Junction 14 Inundation).
  - Time scrubbing, speed controls (1x, 2x, 5x), and event playback.
  - Side-by-side comparison: **With Fusion Intelligence** (1 coherent incident) vs **Fragmented Feeds** (18 noisy, disconnected alarms).
  - Counterfactual analysis: evaluate what would have happened if Sump Pump 02 had not tripped.

* **Trends & Risk Analytics (`/analytics`)**:
  - Recharts analytical visualizations:
    - Hydrological Inundation Correlation (Precipitation vs Water Depth vs Incident Generation).
    - Spatial Ward Vulnerability & Recurrent Inundation Risk.
    - Model Calibration & Quality Metrics (Association Precision, Recall, False Merge Rate).

* **Data Source Health (`/sources`)**:
  - Telemetry freshness monitoring (seconds vs SLA), ingestion protocols (REST, MQTT, Webhook, Kafka), error rates, and automated quarantine gate inspection.

* **Settings & Governance (`/settings`)**:
  - Least-privilege RBAC role switcher (Operations Analyst, Incident Investigator, Operations Supervisor, Platform Administrator, ML/Data Engineer).
  - FastAPI Gateway URL configuration with resilient local in-memory fallback.
  - Synthetic data disclosure governance.

---

## 2. Technology Stack

* **Frontend**: React 18, TypeScript, Vite 6
* **Styling**: Tailwind CSS, CSS variables, glassmorphism, command-center dark theme
* **3D Geospatial**: Three.js, `@react-three/fiber`, `@react-three/drei`
* **Graph Visualization**: `@xyflow/react` (React Flow)
* **Analytics**: Recharts
* **Icons**: Lucide React
* **State Management**: Zustand (`incidentStore`, `simulationStore`, `uiStore`)
* **Data Fetching**: `@tanstack/react-query`
* **API Compatibility**: FastAPI REST endpoints with resilient offline fallback

---

## 3. Getting Started

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

---

## 4. Initial Demonstration Scenario Walkthrough

The platform demonstrates the monsoonal cloudburst scenario:
1. **06:12 UTC**: Met Doppler Radar detects a high-reflectivity convective cell (54 dBZ, 68 mm/h) over Junction 14. Initial candidate incident is instantiated.
2. **06:18 UTC**: Ultrasonic storm drain sensor `US-402-A` triggers as water level rises at 1.8 cm/min.
3. **06:25 UTC**: 14 citizen 311 flood reports arrive. The fusion engine clusters them as near-duplicates, preventing ticket inflation.
4. **06:28 UTC**: Transit speed probe `SEG-882` detects velocity plunging 88% down to 4.8 km/h.
5. **06:38 UTC**: Delayed SCADA telemetry arrives (4-minute lag) confirming that Sump Pump 02 tripped due to an impeller obstruction. The causal Bayesian engine recalculates root-cause plausibility to 92%, triggering an automated escalation to **Critical**.
