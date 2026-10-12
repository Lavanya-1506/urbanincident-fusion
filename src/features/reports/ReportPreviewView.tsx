import React from 'react';
import { GeneratedReport } from '../../types/reports';

interface ReportPreviewViewProps {
  report: GeneratedReport;
  onDownloadPdf: () => void;
  onDownloadJson: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export const ReportPreviewView: React.FC<ReportPreviewViewProps> = ({
  report,
  onDownloadPdf,
  onDownloadJson,
  onRegenerate,
  isRegenerating = false,
}) => {
  const incident = report.incidentData;
  const analysis = report.analysis;
  const config = report.config;

  return (
    <div className="w-full flex flex-col bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden select-text">
      {/* Top Action Toolbar */}
      <div className="px-5 py-3.5 bg-surface-container-high border-b border-outline-variant flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-label-mono text-xs font-bold text-on-surface uppercase tracking-wide">
            {report.id}
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-label-mono font-semibold bg-secondary-fixed text-on-secondary-fixed">
            Rev v{report.version}.0
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-container-highest text-on-surface-variant">
            {config.reportType.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="h-8 px-3 rounded bg-surface-container hover:bg-surface-container-highest text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors border border-outline-variant/60 disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${isRegenerating ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{isRegenerating ? 'Recomputing...' : 'Regenerate New Version'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onDownloadJson}
            className="h-8 px-3 rounded bg-surface-container hover:bg-surface-container-highest text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors border border-outline-variant/60"
            title="Download structured machine-readable JSON"
          >
            <span className="material-symbols-outlined text-[16px]">data_object</span>
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            className="h-8 px-3.5 rounded bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            title="Download multi-page vector PDF"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* Report Document Body */}
      <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full text-on-surface font-sans">
        {/* Cover / Header Section */}
        {config.selectedSections.includes('cover_page') && (
          <div className="border border-outline-variant rounded-xl p-6 bg-gradient-to-br from-surface-container-lowest to-surface-container/30 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-outline-variant/60 pb-4">
              <div>
                <p className="text-[11px] font-bold tracking-widest text-secondary uppercase">
                  {config.organizationName}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {config.departmentName}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded bg-error-container text-on-error-container font-label-mono text-[10px] font-bold uppercase tracking-wider">
                  {config.confidentialityMarking}
                </span>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-on-surface tracking-tight">
                {report.title}
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Formal Incident Intelligence & Causal Adjudication Dossier
              </p>
            </div>

            {/* Classification & Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-container/60 p-3.5 rounded-lg border border-outline-variant/40 text-xs">
              <div>
                <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Incident Ref</span>
                <span className="font-semibold text-on-surface font-mono">{incident?.id || 'Multi-Incident'}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Causal Integrity</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{analysis.classificationLabel}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Confidence</span>
                <span className="font-semibold text-on-surface">{Math.round(analysis.confidenceScore * 100)}% (Calibrated)</span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Generated Timestamp</span>
                <span className="text-on-surface">{new Date(report.createdAt).toLocaleDateString()} {new Date(report.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* 1. Executive Summary */}
        {config.selectedSections.includes('executive_summary') && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">summarize</span>
              <span>1. Executive Summary</span>
            </h2>
            <div className="p-4 rounded-lg bg-surface-container/40 border border-outline-variant/60 text-sm leading-relaxed text-on-surface">
              {incident?.assessment_versions && incident.assessment_versions.length > 0 ? (
                incident.assessment_versions[incident.assessment_versions.length - 1].summary
              ) : (
                <p>Not available in the current evidence set: No assessment summary recorded.</p>
              )}
            </div>
            <div className="p-3.5 rounded-lg bg-secondary-fixed/30 border border-secondary/30 text-xs">
              <strong className="text-primary font-semibold block mb-1">Causal Synthesis Conclusion:</strong>
              <p className="text-on-surface leading-normal">{analysis.causalConclusions[0]}</p>
            </div>
          </section>
        )}

        {/* 2. Incident Scope & Geographic Context */}
        {config.selectedSections.includes('incident_overview') && incident && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">location_on</span>
              <span>2. Incident Scope & Geographic Context</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-container/40 border border-outline-variant/50">
                <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Jurisdiction & Address</span>
                <p className="font-semibold text-on-surface mt-1">{incident.location.address || 'Central Corridor'}</p>
                <p className="text-on-surface-variant">{incident.location.zone || 'Sector 4'}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-container/40 border border-outline-variant/50">
                <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Geospatial Coordinates</span>
                <p className="font-semibold text-on-surface font-mono mt-1">
                  {incident.location.latitude.toFixed(4)}° N, {incident.location.longitude.toFixed(4)}° E
                </p>
                <p className="text-on-surface-variant">Elevation: {incident.location.elevation_m ?? 4.2}m MSL (Lowland retention)</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-container/40 border border-outline-variant/50">
                <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Operational Status</span>
                <p className="font-semibold text-on-surface mt-1 uppercase">{incident.status} • {incident.severity} Alert</p>
                <p className="text-on-surface-variant">Assigned to: {incident.assigned_to || 'District Command'}</p>
              </div>
            </div>
          </section>
        )}

        {/* 3. Operational Telemetry & Sensor Readings */}
        {config.selectedSections.includes('incident_metrics') && incident && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">speed</span>
              <span>3. Operational Telemetry & Sensor Readings</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-surface-container/40 border border-outline-variant/50">
                <span className="text-[10px] font-semibold text-on-surface-variant uppercase block">Stormwater Depth</span>
                <span className="text-xl font-bold text-error font-mono">{incident.metrics.water_level_cm ?? 'N/A'} cm</span>
                <span className="text-[10px] text-on-surface-variant block mt-0.5">Threshold: 35.0 cm (+13.5cm)</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container/40 border border-outline-variant/50">
                <span className="text-[10px] font-semibold text-on-surface-variant uppercase block">Cloudburst Intensity</span>
                <span className="text-xl font-bold text-blue-600 font-mono">{incident.metrics.rainfall_rate_mm_h ?? 'N/A'} mm/h</span>
                <span className="text-[10px] text-on-surface-variant block mt-0.5">Doppler C-Band 54 dBZ</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container/40 border border-outline-variant/50">
                <span className="text-[10px] font-semibold text-on-surface-variant uppercase block">Corridor Velocity</span>
                <span className="text-xl font-bold text-amber-600 font-mono">{incident.metrics.traffic_speed_kmh ?? 'N/A'} km/h</span>
                <span className="text-[10px] text-on-surface-variant block mt-0.5">-88.5% below normal baseline</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container/40 border border-outline-variant/50">
                <span className="text-[10px] font-semibold text-on-surface-variant uppercase block">Civilian Corroborations</span>
                <span className="text-xl font-bold text-emerald-600 font-mono">{incident.metrics.citizen_reports_count} reports</span>
                <span className="text-[10px] text-on-surface-variant block mt-0.5">Deduplicated 311 clusters</span>
              </div>
            </div>
          </section>
        )}

        {/* 4. Canonical Event Timeline */}
        {config.selectedSections.includes('incident_timeline') && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">schedule</span>
              <span>4. Canonical Event Timeline (Occurred vs Ingested)</span>
            </h2>
            <div className="overflow-x-auto rounded-lg border border-outline-variant/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container text-on-surface font-semibold border-b border-outline-variant/60">
                  <tr>
                    <th className="py-2.5 px-3">Signal Event</th>
                    <th className="py-2.5 px-3">Physical Event Time</th>
                    <th className="py-2.5 px-3">System Ingest Time</th>
                    <th className="py-2.5 px-3">Ingest Lag</th>
                    <th className="py-2.5 px-3">Latency Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {analysis.temporalSequence.map((seq, i) => (
                    <tr key={i} className="hover:bg-surface-container/30">
                      <td className="py-2 px-3 font-semibold text-on-surface">{seq.event}</td>
                      <td className="py-2 px-3 font-mono">{new Date(seq.occurredAt).toLocaleTimeString()}</td>
                      <td className="py-2 px-3 font-mono">{new Date(seq.ingestedAt).toLocaleTimeString()}</td>
                      <td className="py-2 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          seq.lagMinutes > 2 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                        }`}>
                          +{seq.lagMinutes}m
                        </span>
                      </td>
                      <td className="py-2 px-3 text-on-surface-variant text-[11px]">{seq.delayNotes || 'Real-time telemetry stream'}</td>
                    </tr>
                  ))}
                  {analysis.temporalSequence.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-3 px-3 text-center text-on-surface-variant">
                        Not available in the current evidence set.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 5. Evidence Register & Provenance */}
        {config.selectedSections.includes('evidence_register') && incident && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">assignment</span>
              <span>5. Evidence Register & Source Provenance</span>
            </h2>
            <div className="overflow-x-auto rounded-lg border border-outline-variant/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container text-on-surface font-semibold border-b border-outline-variant/60">
                  <tr>
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Sensor Source</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Confidence</th>
                    <th className="py-2.5 px-3">Evidence Observation</th>
                    <th className="py-2.5 px-3">Quality Flags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {(incident.evidence || []).map((ev) => (
                    <tr key={ev.id} className="hover:bg-surface-container/30">
                      <td className="py-2 px-3 font-mono font-bold text-secondary">{ev.id}</td>
                      <td className="py-2 px-3 font-medium text-on-surface">{ev.source_name}</td>
                      <td className="py-2 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          ev.evidence_role === 'supporting' ? 'bg-emerald-100 text-emerald-800' : ev.evidence_role === 'contradicting' ? 'bg-error-container text-on-error-container' : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          {ev.evidence_role}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono font-bold">{Math.round(ev.confidence_score * 100)}%</td>
                      <td className="py-2 px-3 text-on-surface leading-tight">{ev.summary}</td>
                      <td className="py-2 px-3 text-[10px] text-on-surface-variant">
                        {ev.quality?.flags?.join(', ') || 'Valid'}
                      </td>
                    </tr>
                  ))}
                  {(incident.evidence || []).length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-3 px-3 text-center text-on-surface-variant">
                        Not available in the current evidence set.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 6. Root Cause Analysis */}
        {config.selectedSections.includes('root_cause_analysis') && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">account_tree</span>
              <span>6. Root Cause Analysis & Candidate Explanations</span>
            </h2>
            <div className="space-y-3">
              {analysis.competingHypotheses.map((hyp) => (
                <div key={hyp.id} className="p-4 rounded-lg bg-surface-container/40 border border-outline-variant/60 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-sm text-on-surface">{hyp.title}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        hyp.status === 'Primary Root Cause' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {hyp.status}
                      </span>
                      <span className="font-mono text-xs font-bold text-primary">
                        Plausibility: {hyp.plausibilityScore}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface leading-relaxed">{hyp.rationale}</p>
                  <div className="text-[11px] text-on-surface-variant flex items-center gap-4 pt-1 border-t border-outline-variant/30">
                    <span>Corroborating Evidence: <strong>{hyp.supportingEvidenceCount} signals</strong></span>
                    <span>Contradicting Evidence: <strong>{hyp.contradictingEvidenceCount} signals</strong></span>
                  </div>
                </div>
              ))}
              {analysis.competingHypotheses.length === 0 && (
                <p className="text-xs text-on-surface-variant p-3 bg-surface-container/30 rounded">
                  Not available in the current evidence set: Causal hypotheses pending adjudication.
                </p>
              )}
            </div>
          </section>
        )}

        {/* 7. Supporting vs Contradictory Evidence Matrix */}
        {config.selectedSections.includes('evidence_breakdown') && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">compare</span>
              <span>7. Supporting vs Contradictory Evidence Matrix</span>
            </h2>
            <div className="space-y-3">
              {analysis.evidentiaryTraceability.map((trace, i) => (
                <div key={i} className="p-3.5 rounded-lg border border-outline-variant/60 bg-surface-container/20 space-y-2 text-xs">
                  <h3 className="font-bold text-on-surface">{trace.hypothesisTitle}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-2.5 rounded bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                        Supporting Evidence:
                      </span>
                      <ul className="space-y-1 list-disc list-inside text-on-surface">
                        {trace.supportingEvidence.map((s) => (
                          <li key={s.id}><strong>{s.name}:</strong> {s.summary}</li>
                        ))}
                        {trace.supportingEvidence.length === 0 && (
                          <li className="text-on-surface-variant">No direct supporting signals</li>
                        )}
                      </ul>
                    </div>
                    <div className="p-2.5 rounded bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40">
                      <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 block mb-1">
                        Contradictory Signals:
                      </span>
                      <ul className="space-y-1 list-disc list-inside text-on-surface">
                        {trace.contradictingEvidence.map((c) => (
                          <li key={c.id}><strong>{c.name}:</strong> {c.summary}</li>
                        ))}
                        {trace.contradictingEvidence.length === 0 && (
                          <li className="text-on-surface-variant">No direct contradictory signals</li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="text-[11px] text-on-surface-variant pt-1">
                    <strong>Unresolved Variables:</strong> {trace.unknowns.join('; ')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Recommendations & Corrective Action Plan */}
        {config.selectedSections.includes('recommendations') && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">task_alt</span>
              <span>8. Recommendations & Corrective Action Plan</span>
            </h2>
            <div className="overflow-x-auto rounded-lg border border-outline-variant/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container text-on-surface font-semibold border-b border-outline-variant/60">
                  <tr>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Operational Directive</th>
                    <th className="py-2.5 px-3">Responsible Agency</th>
                    <th className="py-2.5 px-3">Target SLA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {analysis.actionPlan.map((plan, i) => (
                    <tr key={i} className="hover:bg-surface-container/30">
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          plan.priority.startsWith('P1') ? 'bg-error-container text-on-error-container' : plan.priority.startsWith('P2') ? 'bg-amber-100 text-amber-800' : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {plan.priority}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-semibold text-on-surface">{plan.action}</td>
                      <td className="py-2 px-3 text-on-surface-variant">{plan.owner}</td>
                      <td className="py-2 px-3 font-mono font-bold text-primary">{plan.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 9. Uncertainty & Scientific Limitations */}
        {config.selectedSections.includes('uncertainty_limitations') && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">help</span>
              <span>9. Uncertainty & Scientific Limitations</span>
            </h2>
            <div className="p-4 rounded-lg bg-surface-container/30 border border-outline-variant/60 space-y-2 text-xs">
              <ul className="space-y-1.5 list-disc list-inside text-on-surface">
                {analysis.uncertainties.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
                <li>
                  <strong>Scientific Restraint Notice:</strong> Temporal alignment between physical sensor signals corroborates causal models, but does not substitute for on-site visual confirmation of subsurface culverts.
                </li>
              </ul>
            </div>
          </section>
        )}

        {/* 10. Audit Ledger */}
        {config.selectedSections.includes('response_history') && incident?.audit_history && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">history_edu</span>
              <span>10. Response & Decision Audit Ledger</span>
            </h2>
            <div className="overflow-x-auto rounded-lg border border-outline-variant/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container text-on-surface font-semibold border-b border-outline-variant/60">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Authorized Actor</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Documented Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {incident.audit_history.map((aud) => (
                    <tr key={aud.id} className="hover:bg-surface-container/30">
                      <td className="py-2 px-3 font-mono">{new Date(aud.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2 px-3 font-semibold text-on-surface">{aud.actor}</td>
                      <td className="py-2 px-3 uppercase text-[10px] font-bold text-secondary">{aud.action_type}</td>
                      <td className="py-2 px-3 text-on-surface-variant">{aud.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
