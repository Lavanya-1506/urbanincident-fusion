UI/UX Design Brief
4.1 Design direction
Design concept: an investigative operations console.
The interface should feel calm, precise, and professional. It should prioritize information hierarchy and rapid investigation rather than flashy effects or excessive decoration.
Visual direction:
- Neutral charcoal, warm white, slate, and restrained amber/red for severity.
- Avoid relying on purple/green/blue gradients or stereotypical AI dashboard styling.
- Use a consistent spacing scale and readable typography.
- Keep map controls and investigation panels visually distinct.
- Use subtle motion for state changes, not constant animation.
- Never use color alone to convey severity or status.
Design tokens
Token	Suggested value	Purpose
Main background	#F5F5F2	Light workspace
Main surface	#FFFFFF	Cards and panels
Primary text	#20211F	Headings and body text
Secondary text	#686B66	Supporting labels
Border	#DFE1DB	Dividers and outlines
Primary action	#343A35	Buttons and selected navigation
Critical	#B42318	Critical incidents
Warning	#A15C07	Warning states
Positive	#28724A	Verified resolution or healthy state
Focus	#245D8F	Keyboard focus and accessibility
These are initial tokens to test for contrast and usability, not an inflexible color specification.
4.2 Application shell

UrbanIncident Fusion
OPERATIONS WORKSPACE



Overview

Live map

Incidents

Replay

Sources


ACTIVE INVESTIGATIONS
24
Illustrative layout data

Critical
03


Under review
08



Recent incidents

Incident summary
Location · Last updated



Weather-related report
Location · Under review





Conceptual layout only. The numbers and incident labels are illustrative, not live system data.
4.3 Page-level design requirements
A. Operations dashboard
Layout:
- Header with workspace, time range, notifications, and user menu.
- KPI row for active incidents, critical incidents, incidents under review, and data-source health.
- Main area with incident trends and a compact geographic overview.
- Prioritized incident queue.
- Recent assessment changes and source-freshness warnings.
Interaction:
- Clicking a KPI applies the corresponding incident filter.
- Clicking a queue item opens its investigation workspace.
- Every metric shows its date range and last-updated timestamp.
- Empty states explain why data may be missing.
B. Live map
Layout:
- Large map canvas.
- Collapsible filter panel.
- Incident detail drawer.
- Layer control and time-range control.
- Legend that explains symbols and severity.
Interaction:
- Selecting a marker highlights the corresponding incident.
- Selecting an incident in the list centers the map on its location.
- Cluster expansion should reveal underlying incidents.
- Missing-location events remain available in the list but do not appear as invented map pins.
- Layer toggles must only expose layers supported by available data.
C. Incident explorer
Layout:
- Search bar and filter chips.
- Sortable, paginated table.
- Saved-filter controls.
- Optional map/list view switch.
Recommended columns:
- Incident ID.
- Type.
- Location.
- Severity.
- Status.
- Confidence or assessment state.
- Last updated.
Avoid displaying too many columns at once. Detailed evidence belongs in the incident workspace.
D. Investigation workspace
This is the most important screen in the product.
INCIDENT · ILLUSTRATIVE
Urban flooding assessment
Location and time from the selected record

Under review

Severity
Needs assessment

Evidence
View linked items



Evidence and observations
Supporting observation
Source, timestamp, measurement, and provenance link


Uncertainty or conflict
Explain what is missing, delayed, or contradictory



Hypothesis assessment
Display the leading hypothesis and alternatives only when the engine has produced them. Each hypothesis must link to supporting and contradicting evidence.

Assessment history
Previous version → evidence added or changed → updated assessment → reason for change

Required tabs or sections:
- Summary.
- Evidence.
- Relationships.
- Timeline.
- Hypotheses.
- History.
- Operator actions.
The page should make it easy to answer: What do we know, how do we know it, what do we not know, and what changed?
E. Replay lab
Layout:
- Scenario and incident selector.
- Timeline slider and playback controls.
- Evidence inclusion/exclusion controls.
- Baseline versus replayed outcome panels.
- Differences in incident membership, severity, and hypotheses.
- Replay configuration and model/rule version information.
Every replay must be reproducible from stored inputs, configuration, and version identifiers. If external data is unavailable or nondeterministic, disclose that limitation.
4.4 UX standards
- Support keyboard navigation and visible focus states.
- Use descriptive tooltips and accessible labels.
- Confirm destructive or consequential operations.
- Preserve filter state when moving between list and detail pages.
- Use optimistic UI updates only when rollback behavior is reliable.
- Keep AI explanations separate from observed facts.
- Show timestamps with timezone context.
- Use stable skeleton layouts to reduce visual movement.
- Keep mobile layouts usable, but optimize the full investigation workspace for desktop first.