import { 
  Incident, 
  IncidentStatus, 
  DataSourceHealth, 
  OperationalMetrics, 
  AuditEntry,
  CausalHypothesis
} from '../types';
import { 
  INITIAL_INCIDENTS, 
  INITIAL_DATA_SOURCES, 
  INITIAL_METRICS 
} from './mockData';

// Storage keys for persisting user changes across browser reloads
const STORAGE_INCIDENTS_KEY = 'uif_incidents_v1';
const STORAGE_SOURCES_KEY = 'uif_sources_v1';
const STORAGE_BACKEND_URL_KEY = 'uif_backend_url';

class ApiService {
  private backendUrl: string;
  private isBackendConnected: boolean = false;

  constructor() {
    this.backendUrl = localStorage.getItem(STORAGE_BACKEND_URL_KEY) || 'http://localhost:8000/api/v1';
    this.initLocalStorage();
  }

  private initLocalStorage() {
    if (!localStorage.getItem(STORAGE_INCIDENTS_KEY)) {
      localStorage.setItem(STORAGE_INCIDENTS_KEY, JSON.stringify(INITIAL_INCIDENTS));
    }
    if (!localStorage.getItem(STORAGE_SOURCES_KEY)) {
      localStorage.setItem(STORAGE_SOURCES_KEY, JSON.stringify(INITIAL_DATA_SOURCES));
    }
  }

  public getBackendUrl(): string {
    return this.backendUrl;
  }

  public setBackendUrl(url: string) {
    this.backendUrl = url;
    localStorage.setItem(STORAGE_BACKEND_URL_KEY, url);
  }

  public resetToFactoryDemo() {
    localStorage.setItem(STORAGE_INCIDENTS_KEY, JSON.stringify(INITIAL_INCIDENTS));
    localStorage.setItem(STORAGE_SOURCES_KEY, JSON.stringify(INITIAL_DATA_SOURCES));
  }

  private getLocalIncidents(): Incident[] {
    try {
      const data = localStorage.getItem(STORAGE_INCIDENTS_KEY);
      return data ? JSON.parse(data) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  }

  private saveLocalIncidents(incidents: Incident[]) {
    localStorage.setItem(STORAGE_INCIDENTS_KEY, JSON.stringify(incidents));
  }

  private getLocalSources(): DataSourceHealth[] {
    try {
      const data = localStorage.getItem(STORAGE_SOURCES_KEY);
      return data ? JSON.parse(data) : INITIAL_DATA_SOURCES;
    } catch {
      return INITIAL_DATA_SOURCES;
    }
  }

  // --- API Endpoints ---

  async fetchIncidents(): Promise<Incident[]> {
    try {
      const res = await fetch(`${this.backendUrl}/incidents`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        this.isBackendConnected = true;
        return data;
      }
    } catch {
      this.isBackendConnected = false;
    }
    // Safe fallback to local operational store
    return this.getLocalIncidents();
  }

  async fetchIncidentById(id: string): Promise<Incident | null> {
    try {
      const res = await fetch(`${this.backendUrl}/incidents/${id}`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    const incidents = this.getLocalIncidents();
    return incidents.find(inc => inc.id === id) || null;
  }

  async updateIncidentStatus(
    id: string, 
    newStatus: IncidentStatus, 
    actor: string, 
    rationale: string
  ): Promise<Incident> {
    try {
      const res = await fetch(`${this.backendUrl}/incidents/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, actor, rationale }),
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    // Fallback: Apply transition to local storage with audit logging
    const incidents = this.getLocalIncidents();
    const target = incidents.find(i => i.id === id);
    if (!target) throw new Error(`Incident with id ${id} not found`);

    const oldStatus = target.status;
    target.status = newStatus;
    target.updated_at = new Date().toISOString();

    const auditEntry: AuditEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      actor_role: 'operator',
      action_type: 'status_transition',
      previous_value: oldStatus,
      new_value: newStatus,
      rationale: rationale || `Status updated from ${oldStatus} to ${newStatus}`
    };

    target.audit_history = [auditEntry, ...(target.audit_history || [])];

    // Create a new assessment version as required by PRD section 1.6 rule 6
    const newVersion = (target.assessment_versions?.[0]?.version || 0) + 1;
    target.assessment_versions = [
      {
        version: newVersion,
        generated_at: new Date().toISOString(),
        severity: target.severity,
        confidence: target.confidence,
        summary: `Status manually updated to ${newStatus}. Rationale: ${rationale}`,
        trigger_event_id: `manual_override_${Date.now()}`,
        hypotheses_count: target.hypotheses?.length || 0
      },
      ...(target.assessment_versions || [])
    ];

    this.saveLocalIncidents(incidents);
    return target;
  }

  async addOperatorNote(id: string, actor: string, note: string): Promise<Incident> {
    const incidents = this.getLocalIncidents();
    const target = incidents.find(i => i.id === id);
    if (!target) throw new Error(`Incident not found`);

    const auditEntry: AuditEntry = {
      id: `aud_note_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      actor_role: 'operations_analyst',
      action_type: 'operator_note',
      rationale: note
    };

    target.audit_history = [auditEntry, ...(target.audit_history || [])];
    target.updated_at = new Date().toISOString();
    this.saveLocalIncidents(incidents);
    return target;
  }

  async assignIncident(id: string, actor: string, assignedTo: string, rationale: string): Promise<Incident> {
    const incidents = this.getLocalIncidents();
    const target = incidents.find(i => i.id === id);
    if (!target) throw new Error(`Incident not found`);

    const prevAssigned = target.assigned_to || 'Unassigned';
    target.assigned_to = assignedTo;
    target.updated_at = new Date().toISOString();

    const auditEntry: AuditEntry = {
      id: `aud_assign_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      actor_role: 'operations_supervisor',
      action_type: 'operator_note',
      previous_value: prevAssigned,
      new_value: assignedTo,
      rationale: rationale || `Assigned incident investigation to ${assignedTo}`
    };

    target.audit_history = [auditEntry, ...(target.audit_history || [])];
    this.saveLocalIncidents(incidents);
    return target;
  }

  async adjudicateHypothesis(
    id: string, 
    hypothesisId: string, 
    decision: 'accepted' | 'dismissed', 
    actor: string, 
    rationale: string
  ): Promise<Incident> {
    const incidents = this.getLocalIncidents();
    const target = incidents.find(i => i.id === id);
    if (!target) throw new Error(`Incident not found`);

    const hyp = target.hypotheses?.find(h => h.id === hypothesisId);
    const hypTitle = hyp ? hyp.title : hypothesisId;

    const auditEntry: AuditEntry = {
      id: `aud_hyp_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      actor_role: 'incident_investigator',
      action_type: 'hypothesis_adjudication',
      previous_value: 'under_evaluation',
      new_value: decision,
      rationale: `Hypothesis "${hypTitle}" ${decision.toUpperCase()} by operator. Reason: ${rationale}`
    };

    target.audit_history = [auditEntry, ...(target.audit_history || [])];
    target.updated_at = new Date().toISOString();
    this.saveLocalIncidents(incidents);
    return target;
  }

  async fetchSources(): Promise<DataSourceHealth[]> {
    try {
      const res = await fetch(`${this.backendUrl}/sources`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) return await res.json();
    } catch {}
    return this.getLocalSources();
  }

  async fetchOperationalMetrics(): Promise<OperationalMetrics> {
    const incidents = this.getLocalIncidents();
    const active = incidents.filter(i => i.status !== 'resolved' && i.status !== 'dismissed').length;
    const critical = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
    
    return {
      ...INITIAL_METRICS,
      active_incidents_count: active,
      critical_unresolved_count: critical,
      system_data_freshness_seconds: Math.floor(Math.random() * 8) + 10,
    };
  }

  public isUsingRealBackend(): boolean {
    return this.isBackendConnected;
  }
}

export const api = new ApiService();
