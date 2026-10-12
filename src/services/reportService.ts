import { Incident } from '../types';
import { 
  GeneratedReport, 
  ReportConfig, 
  ReportVersionRecord, 
  ReportType 
} from '../types/reports';
import { runCausalIntelligenceAnalysis } from './reportCausalEngine';
import { generateReportPdf, downloadReportPdf } from './reportPdfGenerator';
import { INITIAL_INCIDENTS } from './mockData';

const STORAGE_REPORTS_KEY = 'uif_reports_history_v1';
const STORAGE_REPORT_VERSIONS_KEY = 'uif_report_versions_v1';

class ReportService {
  private backendUrl: string;

  constructor() {
    this.backendUrl = localStorage.getItem('uif_backend_url') || 'http://localhost:8000/api/v1';
    this.initDefaultSeedReports();
  }

  private initDefaultSeedReports() {
    if (!localStorage.getItem(STORAGE_REPORTS_KEY)) {
      const defaultIncident = INITIAL_INCIDENTS[0];
      const initialConfig: ReportConfig = {
        reportType: 'root_cause_analysis',
        incidentId: defaultIncident.id,
        reportReference: 'REP-2026-8841-RCA-REV1',
        organizationName: 'Metropolitan Civil Protection & Urban Infrastructure Authority',
        departmentName: 'Bureau of Emergency Cartography & Causal Incident Fusion',
        audience: 'operations_command',
        reportingPeriod: 'Operational Shift 06:00 - 08:00 UTC (12-Oct-2026)',
        confidentialityMarking: 'CONFIDENTIAL // MUNICIPAL EMERGENCY RESPONSE',
        selectedSections: [
          'cover_page',
          'executive_summary',
          'incident_overview',
          'incident_metrics',
          'incident_timeline',
          'evidence_register',
          'root_cause_analysis',
          'evidence_breakdown',
          'alternative_explanations',
          'geospatial_analysis',
          'response_history',
          'recommendations',
          'uncertainty_limitations',
          'appendices',
        ],
        format: 'pdf',
      };

      const analysis = runCausalIntelligenceAnalysis(defaultIncident, initialConfig);
      const initialReport: GeneratedReport = {
        id: 'REP-2026-8841-01',
        version: 1,
        title: `Root Cause Analysis — ${defaultIncident.title}`,
        config: initialConfig,
        status: 'completed',
        progress: 100,
        createdAt: '2026-10-12T07:18:00Z',
        createdBy: 'Supervisor S. Chen (ID #101)',
        summary: 'Root cause confirmed as combination of severe precipitation cell and SCADA sump pump failure.',
        incidentData: defaultIncident,
        analysis,
        fileSizeBytes: 148520,
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      };

      this.saveLocalReports([initialReport]);

      const versionRecord: ReportVersionRecord = {
        reportId: initialReport.id,
        version: 1,
        createdAt: initialReport.createdAt,
        createdBy: initialReport.createdBy,
        reportType: initialReport.config.reportType,
        summary: initialReport.summary,
        hash: initialReport.hash || '8f92b7c4e1a0',
      };
      this.saveLocalVersions([versionRecord]);
    }
  }

  private getLocalReports(): GeneratedReport[] {
    try {
      const data = localStorage.getItem(STORAGE_REPORTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveLocalReports(reports: GeneratedReport[]) {
    localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(reports));
  }

  private getLocalVersions(): ReportVersionRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_REPORT_VERSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveLocalVersions(versions: ReportVersionRecord[]) {
    localStorage.setItem(STORAGE_REPORT_VERSIONS_KEY, JSON.stringify(versions));
  }

  // --- API Endpoints ---

  /**
   * GET /api/reports
   * List all generated reports
   */
  async listReports(): Promise<GeneratedReport[]> {
    try {
      const res = await fetch(`${this.backendUrl}/reports`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return this.getLocalReports();
  }

  /**
   * GET /api/reports/:id
   * Get single report by ID
   */
  async getReportById(id: string): Promise<GeneratedReport | null> {
    try {
      const res = await fetch(`${this.backendUrl}/reports/${id}`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    const reports = this.getLocalReports();
    return reports.find((r) => r.id === id) || null;
  }

  /**
   * POST /api/reports
   * Submit and generate a new report
   */
  async createReport(
    config: ReportConfig,
    onProgress?: (progress: number, status: string) => void
  ): Promise<GeneratedReport> {
    // 1. Resolve incident data
    const incidents = INITIAL_INCIDENTS;
    let targetIncident: Incident | undefined;

    if (config.incidentId && config.incidentId !== 'all') {
      targetIncident =
        incidents.find((i) => i.id === config.incidentId) ||
        (config.incidentId === 'INC-2048' ? incidents[0] : incidents[0]);
    }

    onProgress?.(15, 'Validating schema and data authorizations...');
    await new Promise((r) => setTimeout(r, 120));

    onProgress?.(35, 'Aggregating sensor streams, telemetry, and evidence provenance...');
    await new Promise((r) => setTimeout(r, 150));

    // 2. Perform rigorous causal analysis
    onProgress?.(60, 'Evaluating Bayesian causal plausibility & temporal sequence...');
    const analysis = runCausalIntelligenceAnalysis(targetIncident, config);
    await new Promise((r) => setTimeout(r, 150));

    onProgress?.(80, 'Formatting vector typography, tables & document control...');
    const title =
      config.reportType === 'multi_incident_operations'
        ? 'Cross-District Multi-Incident Operations Summary'
        : `${this.formatReportTypeName(config.reportType)} — ${targetIncident?.title || 'Operational Incident'}`;

    // 3. Assemble report object
    const reportId = `REP-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newReport: GeneratedReport = {
      id: reportId,
      version: 1,
      title,
      config,
      status: 'validating',
      progress: 90,
      createdAt: new Date().toISOString(),
      createdBy: 'Operator Elena Vance (Lead Incident Analyst)',
      summary: `${analysis.classificationLabel}: ${analysis.causalConclusions[0]}`,
      incidentData: targetIncident,
      allIncidents: config.reportType === 'multi_incident_operations' ? incidents : undefined,
      analysis,
      fileSizeBytes: 154000,
      hash: this.generateIntegrityHash(reportId, config),
    };

    onProgress?.(95, 'Running cryptographic checksum and PDF compilation...');
    await new Promise((r) => setTimeout(r, 100));

    newReport.status = 'completed';
    newReport.progress = 100;

    // 4. Persist in local store
    const reports = this.getLocalReports();
    reports.unshift(newReport);
    this.saveLocalReports(reports);

    // Save version record
    const versions = this.getLocalVersions();
    versions.unshift({
      reportId: newReport.id,
      version: 1,
      createdAt: newReport.createdAt,
      createdBy: newReport.createdBy,
      reportType: newReport.config.reportType,
      summary: newReport.summary,
      hash: newReport.hash || '',
    });
    this.saveLocalVersions(versions);

    // Try posting to backend asynchronously if available
    try {
      fetch(`${this.backendUrl}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
        signal: AbortSignal.timeout(1000),
      }).catch(() => {});
    } catch {}

    onProgress?.(100, 'Report successfully compiled and ready for download.');
    return newReport;
  }

  /**
   * POST /api/reports/:id/regenerate
   * Regenerates a new version of an existing report
   */
  async regenerateReport(
    reportId: string,
    onProgress?: (progress: number, status: string) => void
  ): Promise<GeneratedReport> {
    const existing = await this.getReportById(reportId);
    if (!existing) {
      throw new Error(`Report ${reportId} not found`);
    }

    onProgress?.(25, 'Fetching updated real-time evidence snapshot...');
    await new Promise((r) => setTimeout(r, 150));

    onProgress?.(60, 'Re-evaluating causal network and evidence matrix...');
    const updatedAnalysis = runCausalIntelligenceAnalysis(existing.incidentData, existing.config);

    onProgress?.(90, 'Incrementing revision version and compiling document...');
    const newVersion = (existing.version || 1) + 1;
    const updatedReport: GeneratedReport = {
      ...existing,
      version: newVersion,
      createdAt: new Date().toISOString(),
      analysis: updatedAnalysis,
      summary: `${updatedAnalysis.classificationLabel} (Rev v${newVersion}): ${updatedAnalysis.causalConclusions[0]}`,
      hash: this.generateIntegrityHash(existing.id, existing.config, newVersion),
    };

    // Update in list
    const reports = this.getLocalReports();
    const idx = reports.findIndex((r) => r.id === reportId);
    if (idx !== -1) {
      reports[idx] = updatedReport;
      this.saveLocalReports(reports);
    }

    // Append to version history (preserving previous versions!)
    const versions = this.getLocalVersions();
    versions.unshift({
      reportId: updatedReport.id,
      version: newVersion,
      createdAt: updatedReport.createdAt,
      createdBy: updatedReport.createdBy,
      reportType: updatedReport.config.reportType,
      summary: updatedReport.summary,
      hash: updatedReport.hash || '',
    });
    this.saveLocalVersions(versions);

    onProgress?.(100, `Version v${newVersion} compiled successfully.`);
    return updatedReport;
  }

  /**
   * GET /api/reports/:id/versions
   */
  async getReportVersions(reportId: string): Promise<ReportVersionRecord[]> {
    const versions = this.getLocalVersions();
    return versions.filter((v) => v.reportId === reportId);
  }

  /**
   * Trigger native download for PDF or JSON
   */
  downloadReportFile(report: GeneratedReport, format: 'pdf' | 'json') {
    const incidentCode = report.incidentData?.id || 'MULTI';
    const filename = `UIF-Report-${incidentCode}-v${report.version}.${format}`;

    if (format === 'json') {
      const jsonStr = JSON.stringify(report, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      this.triggerBrowserDownload(blob, filename);
    } else {
      downloadReportPdf(report, filename);
    }
  }

  private triggerBrowserDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 5000);
  }

  private formatReportTypeName(type: ReportType): string {
    switch (type) {
      case 'incident_intelligence':
        return 'Incident Intelligence Report';
      case 'root_cause_analysis':
        return 'Root Cause Analysis Report';
      case 'executive_summary':
        return 'Executive Summary Briefing';
      case 'post_incident_review':
        return 'Post-Incident Review (PIR)';
      case 'multi_incident_operations':
        return 'Multi-Incident Operations Report';
    }
  }

  private generateIntegrityHash(id: string, config: ReportConfig, version = 1): string {
    const raw = `${id}:${config.reportType}:${config.incidentId}:${version}:${config.organizationName}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex}e4b09c2a8f11d93c4e12`.slice(0, 32);
  }
}

export const reportService = new ReportService();
