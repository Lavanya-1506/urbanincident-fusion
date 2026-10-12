import { Incident, IncidentSeverity } from './index';

export type ReportType = 
  | 'incident_intelligence'
  | 'root_cause_analysis'
  | 'executive_summary'
  | 'post_incident_review'
  | 'multi_incident_operations';

export type ReportAudience = 
  | 'operations_command'
  | 'executive_leadership'
  | 'inter_agency'
  | 'audit_board';

export type ReportFormat = 'pdf' | 'json';

export type ReportStatus = 'queued' | 'processing' | 'validating' | 'completed' | 'failed';

export type ReportSectionKey = 
  | 'cover_page'
  | 'executive_summary'
  | 'incident_overview'
  | 'incident_metrics'
  | 'incident_timeline'
  | 'evidence_register'
  | 'root_cause_analysis'
  | 'evidence_breakdown'
  | 'alternative_explanations'
  | 'geospatial_analysis'
  | 'response_history'
  | 'recommendations'
  | 'uncertainty_limitations'
  | 'appendices';

export interface ReportSectionMeta {
  key: ReportSectionKey;
  label: string;
  description: string;
  requiredForTypes: ReportType[];
}

export const REPORT_SECTIONS_CATALOG: ReportSectionMeta[] = [
  {
    key: 'cover_page',
    label: 'Cover Page & Document Control',
    description: 'Formal classification markings, metadata grid, and document control block',
    requiredForTypes: ['incident_intelligence', 'root_cause_analysis', 'executive_summary', 'post_incident_review', 'multi_incident_operations'],
  },
  {
    key: 'executive_summary',
    label: 'Executive Summary',
    description: 'High-level operational overview, core impact metrics, and key decisions',
    requiredForTypes: ['incident_intelligence', 'root_cause_analysis', 'executive_summary', 'post_incident_review', 'multi_incident_operations'],
  },
  {
    key: 'incident_overview',
    label: 'Incident Overview & Geographic Scope',
    description: 'Detailed geographic context, elevation, zone boundaries, and initial trigger',
    requiredForTypes: ['incident_intelligence', 'root_cause_analysis', 'post_incident_review', 'multi_incident_operations'],
  },
  {
    key: 'incident_metrics',
    label: 'Operational Metrics & Sensor Telemetry',
    description: 'Quantified peak readings: water depth, precipitation intensity, speed degradation',
    requiredForTypes: ['incident_intelligence', 'root_cause_analysis', 'executive_summary', 'multi_incident_operations'],
  },
  {
    key: 'incident_timeline',
    label: 'Canonical Event Timeline',
    description: 'Observed timestamp vs ingested timestamp with latency and lag disclosure',
    requiredForTypes: ['incident_intelligence', 'root_cause_analysis', 'post_incident_review'],
  },
  {
    key: 'evidence_register',
    label: 'Evidence Register & Source Provenance',
    description: 'All correlated signals, raw metrics, data freshness, and provenance URLs',
    requiredForTypes: ['incident_intelligence', 'root_cause_analysis'],
  },
  {
    key: 'root_cause_analysis',
    label: 'Root Cause & Causal Plausibility',
    description: 'Causal mechanisms, Bayesian plausibility scores, and structural failure proofs',
    requiredForTypes: ['root_cause_analysis', 'post_incident_review'],
  },
  {
    key: 'evidence_breakdown',
    label: 'Supporting vs Contradictory Evidence Matrix',
    description: 'Strict breakdown of evidence supporting or conflicting with candidate causes',
    requiredForTypes: ['root_cause_analysis', 'incident_intelligence'],
  },
  {
    key: 'alternative_explanations',
    label: 'Alternative Explanations & Unknowns',
    description: 'Competing hypotheses rejected or pending, with unobserved variables',
    requiredForTypes: ['root_cause_analysis', 'post_incident_review'],
  },
  {
    key: 'geospatial_analysis',
    label: 'Geospatial Dispersion & Sensor Coverage',
    description: 'Spatial impact perimeter, nearest telemetry nodes, and catchment hydrology',
    requiredForTypes: ['incident_intelligence', 'multi_incident_operations'],
  },
  {
    key: 'response_history',
    label: 'Response Actions & Audit Ledger',
    description: 'Operator interventions, severity changes, and supervisory escalations',
    requiredForTypes: ['post_incident_review', 'incident_intelligence'],
  },
  {
    key: 'recommendations',
    label: 'Recommendations & Action Plan',
    description: 'Prioritized (P1-P3) corrective and infrastructure maintenance actions',
    requiredForTypes: ['incident_intelligence', 'root_cause_analysis', 'executive_summary', 'post_incident_review'],
  },
  {
    key: 'uncertainty_limitations',
    label: 'Uncertainty, Data Gaps & Scientific Limitations',
    description: 'Uncertainty bounds, offline sensor gaps, and non-proven correlations',
    requiredForTypes: ['incident_intelligence', 'root_cause_analysis', 'post_incident_review'],
  },
  {
    key: 'appendices',
    label: 'Appendices, Methodology & Schema Versioning',
    description: 'Data fusion formulas, calibration constants, and schema versions',
    requiredForTypes: ['incident_intelligence', 'root_cause_analysis', 'post_incident_review', 'multi_incident_operations'],
  },
];

export interface ReportConfig {
  reportType: ReportType;
  incidentId: string; // incident id or 'all'
  reportReference: string;
  organizationName: string;
  departmentName: string;
  audience: ReportAudience;
  reportingPeriod: string;
  confidentialityMarking: string;
  selectedSections: ReportSectionKey[];
  format: ReportFormat;
}

export interface CausalAnalysisResult {
  classification: 'confirmed' | 'strongly_supported' | 'plausible' | 'inconclusive' | 'insufficient_evidence';
  classificationLabel: string;
  confidenceAssessment: string;
  confidenceScore: number;
  causalConclusions: string[];
  temporalSequence: {
    event: string;
    occurredAt: string;
    ingestedAt: string;
    lagMinutes: number;
    delayNotes?: string;
  }[];
  competingHypotheses: {
    id: string;
    title: string;
    plausibilityScore: number;
    status: 'Primary Root Cause' | 'Secondary Factor' | 'Contradicted / Unlikely' | 'Preliminary';
    rationale: string;
    supportingEvidenceCount: number;
    contradictingEvidenceCount: number;
  }[];
  evidentiaryTraceability: {
    hypothesisId: string;
    hypothesisTitle: string;
    supportingEvidence: { id: string; name: string; summary: string }[];
    contradictingEvidence: { id: string; name: string; summary: string }[];
    unknowns: string[];
  }[];
  uncertainties: string[];
  actionPlan: {
    priority: 'P1 - Immediate' | 'P2 - 24-Hour Operational' | 'P3 - Structural Remediative';
    action: string;
    owner: string;
    deadline: string;
    rationale: string;
  }[];
}

export interface GeneratedReport {
  id: string;
  version: number;
  title: string;
  config: ReportConfig;
  status: ReportStatus;
  progress: number; // 0 - 100
  createdAt: string;
  createdBy: string;
  summary: string;
  incidentData?: Incident;
  allIncidents?: Incident[];
  analysis: CausalAnalysisResult;
  pdfBase64?: string;
  downloadUrl?: string;
  fileSizeBytes?: number;
  hash?: string;
}

export interface ReportVersionRecord {
  reportId: string;
  version: number;
  createdAt: string;
  createdBy: string;
  reportType: ReportType;
  summary: string;
  hash: string;
}
