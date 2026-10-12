// Canonical contracts adhering to UrbanIncident Fusion TRD & PRD specifications

export type DataOrigin = 
  | 'real_backend' 
  | 'imported_dataset' 
  | 'synthetic_demo' 
  | 'simulated_scenario' 
  | 'model_hypothesis';

export type IncidentStatus = 
  | 'detected' 
  | 'under_review' 
  | 'confirmed' 
  | 'monitoring' 
  | 'resolved' 
  | 'dismissed';

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';

export type IncidentType = 
  | 'waterlogging' 
  | 'flash_flood' 
  | 'traffic_congestion' 
  | 'stormwater_overflow' 
  | 'drainage_blockage' 
  | 'structural_hazard';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  zone?: string;
  elevation_m?: number;
}

export interface CanonicalEventQuality {
  is_valid: boolean;
  is_stale: boolean;
  flags: string[];
}

export interface CanonicalEvent {
  event_id: string;
  source_id: string;
  source_record_id: string;
  event_type: string;
  occurred_at: string;
  observed_at: string;
  ingested_at: string;
  location: GeoLocation;
  payload: Record<string, any>;
  quality: CanonicalEventQuality;
  schema_version: string;
  is_duplicate?: boolean;
  duplicate_of?: string;
  origin: DataOrigin;
}

export interface EvidenceItem {
  id: string;
  source_id: string;
  source_name: string;
  source_type: 'weather_radar' | 'iot_water_level' | 'traffic_speed' | 'citizen_report' | 'cctv_vision' | 'drain_pump_telemetry';
  evidence_role: 'supporting' | 'contradicting' | 'contextual';
  confidence_score: number; // 0.0 - 1.0
  occurred_at: string;
  ingested_at: string;
  summary: string;
  raw_metric?: string;
  provenance_url?: string;
  quality: CanonicalEventQuality;
}

export interface CausalHypothesis {
  id: string;
  title: string;
  root_cause_explanation: string;
  plausibility_score: number; // 0.0 - 1.0 (calibrated)
  uncertainty_level: 'low' | 'moderate' | 'high';
  supporting_evidence_ids: string[];
  contradicting_evidence_ids: string[];
  unknowns: string[];
  recommended_interventions: string[];
  model_id: string;
  evaluated_at: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actor_role: string;
  action_type: 'status_transition' | 'evidence_link' | 'relationship_override' | 'operator_note' | 'hypothesis_adjudication';
  previous_value?: string;
  new_value?: string;
  rationale: string;
}

export interface IncidentAssessmentVersion {
  version: number;
  generated_at: string;
  severity: IncidentSeverity;
  confidence: number;
  summary: string;
  trigger_event_id: string;
  hypotheses_count: number;
}

export interface Incident {
  id: string;
  title: string;
  type: IncidentType;
  status: IncidentStatus;
  severity: IncidentSeverity;
  confidence: number; // 0.0 - 1.0
  origin: DataOrigin;
  detected_at: string;
  updated_at: string;
  first_observed_at: string;
  location: GeoLocation;
  assigned_to?: string;
  
  // Live aggregated operational metrics
  metrics: {
    water_level_cm?: number;
    rainfall_rate_mm_h?: number;
    traffic_speed_kmh?: number;
    affected_radius_m?: number;
    citizen_reports_count: number;
  };

  assessment_versions: IncidentAssessmentVersion[];
  observations: CanonicalEvent[];
  evidence: EvidenceItem[];
  hypotheses: CausalHypothesis[];
  audit_history: AuditEntry[];
}

export interface DataSourceHealth {
  source_id: string;
  name: string;
  protocol: 'REST_POLL' | 'WEBHOOK' | 'MQTT' | 'KAFKA';
  category: 'meteorological' | 'telemetry_iot' | 'mobility_traffic' | 'crowdsourced' | 'infrastructure';
  status: 'healthy' | 'degraded' | 'stale' | 'critical';
  freshness_seconds: number;
  events_per_minute: number;
  error_rate_pct: number;
  last_success_timestamp: string;
  quarantined_last_24h: number;
  active_warnings: string[];
}

export interface OperationalMetrics {
  active_incidents_count: number;
  critical_unresolved_count: number;
  events_ingested_1h: number;
  median_ttr_minutes: number;
  sources_healthy_ratio: { healthy: number; total: number };
  system_data_freshness_seconds: number;
  duplicate_filtered_ratio: number;
  fusion_precision_score: number;
}

export interface ReplayFrame {
  timestamp: string;
  step_number: number;
  label: string;
  active_event: CanonicalEvent;
  fusion_decision: 'associated' | 'separated' | 'deferred_review';
  narrative: string;
  incident_snapshot: Partial<Incident>;
}

export type UserRole = 
  | 'operations_analyst' 
  | 'incident_investigator' 
  | 'operations_supervisor' 
  | 'platform_administrator' 
  | 'ml_data_engineer';

export interface UserSession {
  user_id: string;
  full_name: string;
  role: UserRole;
  token?: string;
}
