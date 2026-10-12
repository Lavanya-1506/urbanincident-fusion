# UrbanIncident Fusion & Causal Intelligence
## Comprehensive System Audit & Feature Specification Report

**Audit Date:** October 12, 2026  
**System Version:** v4.2.1-prod  
**Platform Architecture:** React 18 • TypeScript • Vite • Tailwind CSS • Google Stitch Design System • Zustand  
**Cartographic Engine:** Realistic Leaflet / OpenStreetMap Vector Canvas with Multi-Layer Overlays  
**Reporting Engine:** Client-Side Multi-Page PDF Vector Generation (jsPDF + AutoTable)  

---

## 1. Executive Summary & Core Mission

Modern municipal operations centers (Disaster Management, Drainage, Traffic Control, Civil Defense) suffer from fragmented, delayed, and conflicting telemetry during urban crisis events. Single sensor failures or social media panic often trigger wasteful or misdirected emergency dispatches.

**UrbanIncident Fusion & Causal Intelligence** is an enterprise-grade municipal decision support platform that solves this challenge by:
1. **Evidence-First Fusion:** Correlating disparate real-time streams (Doppler weather radar, IoT drain depth sensors, traffic transit velocity probes, SCADA sump pump telemetry, and citizen Civic-311 complaints).
2. **Causal Intelligence (Distinguishing Correlation from Causation):** Evaluating competing mechanistic hypotheses rather than blindly trusting temporal correlation.
3. **Counterfactual "What-If" Simulation:** Allowing operators to evaluate the sensitivity of dispatch decisions by simulating delayed, missing, or clamped sensors.
4. **End-to-End Civic Accountability:** Providing citizens and field officers with instant complaint filing, automatic municipal unit dispatch with target SLAs, and immutable audit trails.

---

## 2. Complete Architectural & Feature Audit by Module

### A. Operations Command Dashboard (`/dashboard`)
* **Route:** `http://localhost:3000/dashboard`
* **Purpose:** High-density command-center overview for duty operations analysts and watch commanders.
* **Core Capabilities:**
  * **Operational KPI Row:** Real-time counters for Active Incidents (4), Critical Severity Alerts (1), Emerging Incidents (2), Resolved Incidents (12), and Unhealthy Data Sources (2/8).
  * **Priority Incident Queue:** Multi-column queue displaying Incident ID, Category, Location, Severity Level (1-4), Assessment Confidence (0-100%), Ingestion Lag, and Assigned Operator.
  * **Live Map Preview:** Compact interactive GIS preview centered on Sector 4 with one-click transition to full-screen mapping.
  * **Live Ingestion Event Stream:** Chronological event feed displaying event types (`radar_cloudburst_cell`, `ultrasonic_depth_reading`, `corridor_speed_anomaly`, `pump_station_fault`), source origin, and quality status indicators.
  * **Incident Frequency Trends & Severity Distribution:** Visual charts illustrating hourly event spikes and severity distribution.
  * **Telemetry Health Strip:** Immediate overview of external API and IoT bus connections.

---

### B. Live Operational Map (`/map`)
* **Route:** `http://localhost:3000/map`
* **Purpose:** Realistic geographic situational awareness workspace.
* **Core Capabilities:**
  * **Realistic Cartographic GIS Viewport:** Leaflet + OpenStreetMap engine rendering detailed road networks, building footprints, and water bodies.
  * **Dynamic Multi-Layer Toggles:**
    * **Precipitation Doppler Radar:** Real-time semi-transparent reflectivity heatmaps (54 dBZ storm cells).
    * **IoT Ultrasonic Water Sensors:** Interactive map markers showing live water surge depths (e.g., `+0.84m surge`).
    * **Traffic Velocity Probes:** Street corridor velocity indicators highlighting gridlock slowdowns.
    * **Citizen 311 Reports:** Clustered spatial complaint markers.
    * **Simulated Flood Inundation Polygons:** Geometric flood extent boundaries illustrating waterlogged road zones.
  * **Synchronized Incident Drawer (Split-Screen 68% / 32%):** Selecting an incident on the map highlights its footprint and opens an synchronized detail drawer with evidence counts, confidence scores, and operator action triggers.
  * **Report Area Issue Quick Action:** Top toolbar button that instantly launches the Civic Area Complaint modal pre-focused on the active map coordinate.

---

### C. Priority Incident Explorer (`/incidents`)
* **Route:** `http://localhost:3000/incidents`
* **Purpose:** High-throughput incident filtering, triage, and assignment workspace.
* **Core Capabilities:**
  * **Multi-Criteria Filter Matrix:** Filter incidents by Status (`all`, `detected`, `under_review`, `confirmed`, `resolved`), Severity (`low`, `moderate`, `high`, `critical`), Category, and minimum Confidence threshold.
  * **Dual Viewport Modes:** Dense table view for desktop operators and responsive card layout.
  * **Quick Investigation Launcher:** Direct one-click access into the deep root cause investigation workspace for any selected incident.

---

### D. Evidence-First Investigation Workspace (`/incidents/:id`)
* **Route:** `http://localhost:3000/incidents/INC-2026-8841`
* **Purpose:** Forensic investigation workspace designed to prove *why* an incident occurred.
* **Core Capabilities:**
  * **Verified Facts vs. Hypotheses Separation:** Explicit visual compartmentalization preventing analysts from confusing raw observations with unverified theories.
  * **Dual-Time Evidence Timeline:**
    * Tracks both **Occurred At** (physical reality) and **Ingested At** (system arrival).
    * Explicitly calculates and displays **Ingestion Latency** (e.g., flagging the 4-minute delay in SCADA sump pump alerts).
    * Flags deduplicated and near-duplicate observations.
  * **Competing Hypotheses Evaluation:**
    * Simultaneously tracks and compares competing root causes:
      * *Hypothesis 1 (Primary - 92% Plausibility):* Retention conduit backflow + SCADA pump electrical trip.
      * *Hypothesis 2 (Secondary - 64% Plausibility):* Impervious surface runoff overload.
      * *Hypothesis 3 (Contradicted - 8% Plausibility):* Subsurface potable water pipe rupture.
    * Explicitly maps supporting evidence, contradicting evidence, and remaining unknowns.
  * **Immutable Audit Trail:** Chronological record of status transitions, supervisor overrides, and machine reasonings.

---

### E. Download Incident Report & Causal Dossier Engine (`/reports`)
* **Route:** `http://localhost:3000/reports` (and modal on `/incidents/:id`)
* **Purpose:** Full-featured municipal reporting suite producing legally and operationally sound documentation.
* **Core Capabilities:**
  * **10 Report Sections Catalog:** Cover page, Executive Summary, Incident Overview, Sensor Metrics, Chronological Timeline, Evidence Register, Root Cause Analysis, Evidence Traceability Matrix, Prioritized Action Plan, and Limitations.
  * **Audience Customization:** Tailored output formatting for *Operations Command*, *City Leadership / Mayor's Office*, *Inter-Agency Review*, or *Public Transparency*.
  * **Real Vector PDF Generation:** Generates multi-page, formatted PDFs client-side with headers, page numbers (`Page X of Y`), tables, and confidentiality markings (`CONFIDENTIAL // MUNICIPAL EMERGENCY RESPONSE`).
  * **Download History:** Tracks previously generated reports with direct download links and metadata.

---

### F. Replay Lab & Counterfactual Workspace (`/replay`)
* **Route:** `http://localhost:3000/replay`
* **Purpose:** Operational time-travel and "what-if" causal sensitivity testing.
* **Core Capabilities:**
  * **Automated Playback Controls:** Play/Pause with automatic timer, step forward, step backward, reset, and speed multipliers (`1x`, `2x`, `4x`).
  * **Interactive Scrubber ($T\text{-120m}$ to $T\text{-0m}$):** Moving the slider across 6 chronological steps dynamically updates Baseline vs. Simulated states in real time.
  * **Dual Split-Screen Workspace:**
    * *Left Panel (Baseline Stream):* Production state with all sensors active.
    * *Right Panel (Simulated Branch):* Counterfactual stream with clamped or delayed sensors.
  * **Counterfactual Scenarios:**
    * `SC-04`: Exclude Stream Gauge W-18 ($-27\% \Delta$ confidence drop; demonstrates reliance on water elevation sensor).
    * `SC-02`: Delayed SCADA Pump Telemetry ($+4\text{m}$ latency; demonstrates operational response lag).
    * `SC-03`: Contradictory Invert Reading ($-35\% \Delta$; simulates sensor drift).
    * `SC-01`: Normal Sequential Arrival ($0\% \Delta$; reference run).
  * **Restore Baseline Stream:** One-click re-synchronization that snaps simulated branch back to ground truth.
  * **Export Delta JSON:** Generates and downloads machine-readable audit files (`UIF-Delta-INC-2048-SC04.json`).

---

### G. Civic Area Complaint & Incident Reporting System (`CIVIC-311` — NEW FEATURE)
* **Accessibility:** Top Navigation Header (`Raise Complaint` button), Left Sidebar Rail, and Map Toolbar (`Report Area Issue`).
* **Purpose:** Allows citizens and field officers to submit ground observations for specific areas directly to municipal emergency dispatch units.
* **Core Capabilities:**
  * **Area / Zone Selection:**
    * Pre-configured city sectors: *Sector 4 - Commercial Central*, *Western Express Flyover Underpass*, *Ward F-North Dharavi*, *Bandra Kurla Complex*, *Andheri Subway*, or *Custom Landmark & GPS Pin*.
    * Automatic coordinate resolution and address verification.
  * **Incident Type / Category:**
    * Waterlogging & Urban Inundation (`waves`)
    * Drain / Culvert Blockage (`filter_alt`)
    * Pump Station Failure (`power_off`)
    * Traffic Gridlock / Stall (`traffic`)
    * Manhole / Invert Cover Hazard (`warning`)
    * Potable Water Pipe Rupture (`water_damage`)
  * **Ground Condition Reporting:**
    * Freeform condition description.
    * Water depth estimation slider ($5\text{cm}$ to $100\text{cm}$).
    * Impact toggles: *Traffic Roadway Paralyzed* and *Electrical Hazard / Power Out*.
  * **Automated Municipal Dispatch Routing:**
    * Evaluates category and severity to automatically assign the competent agency:
      * *Critical alerts:* Emergency Disaster Response Squad & Rapid Municipal Deployment ($\text{SLA: } 15\text{m}$).
      * *Pump faults:* Hydraulic Engineering & Pump Station Maintenance Division ($\text{SLA: } 20\text{m}$).
      * *Traffic stalls:* Traffic Management Directorate & Police Rapid Response ($\text{SLA: } 20\text{m}$).
      * *Drain blockage:* Municipal Drainage Maintenance & Silt Clearance Squad ($\text{SLA: } 45\text{m}$).
  * **Spatial Clustering & Linkage:** Automatically checks if an existing incident is active in the area and correlates the complaint.
  * **Instant Confirmation Receipt:** Generates unique tracking ID (e.g., `C311-2026-90412`), copies ID to clipboard, and triggers real-time operational notifications in the notification bell.

---

### H. Operational Analytics (`/analytics`)
* **Route:** `http://localhost:3000/analytics`
* **Purpose:** Longitudinal operational performance evaluation.
* **Core Capabilities:**
  * Frequency analysis of incidents by time of day and meteorological intensity.
  * Severity distribution across municipal wards.
  * Mean Time to Detect (MTTD) and Mean Time to Resolve (MTTR) tracking.
  * Telemetry latency distribution by protocol (MQTT vs. REST vs. Webhook).

---

### I. Data Sources & Health Telemetry Monitor (`/sources`)
* **Route:** `http://localhost:3000/sources`
* **Purpose:** Infrastructure surveillance of 12 real-time data pipelines.
* **Core Capabilities:**
  * Status monitoring (`healthy`, `degraded`, `stale`, `critical`).
  * Telemetry protocol categorization (MQTT, Kafka, REST Poll, Webhook).
  * Data freshness countdowns and events-per-minute throughput metrics.
  * Quarantined packet logs and active telemetry error warnings.

---

### J. Audit History & Compliance (`/audit`)
* **Route:** `http://localhost:3000/audit`
* **Purpose:** Legal compliance and municipal accountability logging.
* **Core Capabilities:**
  * Immutable record of all system and human actions.
  * Actor tracking (`Fusion Engine Daemon`, `Operator J. Vance`, `Supervisor S. Chen`).
  * Action classifications (`status_transition`, `evidence_link`, `hypothesis_evaluation`, `operator_override`).
  * Full rationale documentation for every change.

---

### K. System Settings & Operator RBAC Profiles (`/settings`)
* **Route:** `http://localhost:3000/settings`
* **Purpose:** System configuration and role-based access control.
* **Core Capabilities:**
  * Role simulation: *Operations Analyst*, *Incident Investigator*, *Operations Supervisor*, *Platform Administrator*, *ML Data Engineer*.
  * System parameter adjustments: spatial association radius, deduplication windows, and alert confidence thresholds.

---

## 3. Quality Assurance, Testing & Validation Results

* **TypeScript Compilation (`tsc --noEmit`):** Clean exit with **0 errors**.
* **Automated Test Suite (`npm test`):**
  * `1. Causal Intelligence Engine - Confirmed Multi-Source Incident`: **PASS**
  * `2. Causal Intelligence Engine - Sparse / Incomplete Evidence`: **PASS**
  * `3. Real PDF Document Vector Generation`: **PASS**
  * `4. Report Sections Catalog - Completeness and Defaults`: **PASS**
  * `5. Causal Analysis - Temporal Sequence and Causality Distinction`: **PASS**
  * **Total Test Score:** **5 passed, 0 failed** in ~215ms.
* **Production Build (`npm run build`):** Clean compilation producing optimized production assets in `dist/`.
