import React, { useState, useEffect } from 'react';
import { 
  ReportType, 
  ReportSectionKey, 
  ReportConfig, 
  REPORT_SECTIONS_CATALOG,
  GeneratedReport 
} from '../../types/reports';
import { useReportStore } from '../../store/reportStore';
import { INITIAL_INCIDENTS } from '../../services/mockData';
import { ReportPreviewView } from './ReportPreviewView';

export const ReportGenerationModal: React.FC = () => {
  const {
    isModalOpen,
    closeReportModal,
    selectedIncidentId,
    activeReport,
    isGenerating,
    generationProgress,
    generationStatusText,
    generationError,
    generateReport,
    downloadReport,
    regenerateReport,
  } = useReportStore();

  const [activeTab, setActiveTab] = useState<'config' | 'preview'>('config');

  // Form State
  const [reportType, setReportType] = useState<ReportType>('root_cause_analysis');
  const [incidentId, setIncidentId] = useState<string>('INC-2026-8841');
  const [reportReference, setReportReference] = useState<string>('REP-2026-8841-REV1');
  const [organizationName, setOrganizationName] = useState<string>(
    'Metropolitan Civil Protection & Urban Infrastructure Authority'
  );
  const [departmentName, setDepartmentName] = useState<string>(
    'Bureau of Emergency Cartography & Causal Incident Fusion'
  );
  const [audience, setAudience] = useState<ReportConfig['audience']>('operations_command');
  const [reportingPeriod, setReportingPeriod] = useState<string>(
    'Operational Shift 06:00 - 08:00 UTC (12-Oct-2026)'
  );
  const [confidentialityMarking, setConfidentialityMarking] = useState<string>(
    'CONFIDENTIAL // MUNICIPAL EMERGENCY RESPONSE'
  );
  const [selectedSections, setSelectedSections] = useState<ReportSectionKey[]>([
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
  ]);
  const [format, setFormat] = useState<'pdf' | 'json'>('pdf');

  // Auto-sync incident ID when modal opens
  useEffect(() => {
    if (selectedIncidentId) {
      setIncidentId(selectedIncidentId);
      const cleanRef = `REP-${selectedIncidentId.replace(/[^A-Za-z0-9]/g, '-')}-REV1`;
      setReportReference(cleanRef);
    }
  }, [selectedIncidentId, isModalOpen]);

  // When report type changes, adjust recommended sections
  const handleReportTypeChange = (type: ReportType) => {
    setReportType(type);
    const recommended = REPORT_SECTIONS_CATALOG
      .filter((s) => s.requiredForTypes.includes(type))
      .map((s) => s.key);
    setSelectedSections(recommended);

    if (type === 'multi_incident_operations') {
      setIncidentId('all');
    } else if (incidentId === 'all') {
      setIncidentId(selectedIncidentId || 'INC-2026-8841');
    }
  };

  const toggleSection = (key: ReportSectionKey) => {
    setSelectedSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectAllSections = () => {
    setSelectedSections(REPORT_SECTIONS_CATALOG.map((s) => s.key));
  };

  const handleResetRecommendedSections = () => {
    const recommended = REPORT_SECTIONS_CATALOG
      .filter((s) => s.requiredForTypes.includes(reportType))
      .map((s) => s.key);
    setSelectedSections(recommended);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const config: ReportConfig = {
      reportType,
      incidentId,
      reportReference,
      organizationName,
      departmentName,
      audience,
      reportingPeriod,
      confidentialityMarking,
      selectedSections,
      format,
    };

    const result = await generateReport(config);
    if (result) {
      setActiveTab('preview');
      // If user selected direct download format, trigger it
      if (format === 'pdf') {
        downloadReport(result, 'pdf');
      } else if (format === 'json') {
        downloadReport(result, 'json');
      }
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-5xl max-h-[92vh] flex flex-col bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="px-6 py-4 bg-surface-container-high border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">description</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface tracking-tight">
                Download Operational Report
              </h2>
              <p className="text-xs text-on-surface-variant">
                Generate calibrated multi-signal intelligence, root cause analysis, or executive summaries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher Tabs */}
            <div className="flex rounded-lg bg-surface-container p-0.5 border border-outline-variant/40 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('config')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'config'
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Configure</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                disabled={!activeReport}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Document Preview</span>
                {activeReport && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={closeReportModal}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              title="Close Dialog"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Progress Overlay during Generation */}
          {isGenerating && (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">
                  sync
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface">Compiling Incident Report</h3>
                <p className="text-xs text-on-surface-variant mt-1 font-mono">
                  {generationStatusText}
                </p>
              </div>
              <div className="w-full max-w-md bg-surface-container rounded-full h-2 overflow-hidden border border-outline-variant/40">
                <div
                  className="bg-primary h-full transition-all duration-300 rounded-full"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <span className="text-[11px] font-mono font-bold text-primary">
                {generationProgress}%
              </span>
            </div>
          )}

          {/* Error Message */}
          {generationError && !isGenerating && (
            <div className="mb-4 p-4 rounded-xl bg-error-container/60 border border-error text-on-error-container text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error">error</span>
                <span>{generationError}</span>
              </div>
              <button 
                type="button" 
                onClick={() => handleResetRecommendedSections()} 
                className="underline font-bold"
              >
                Reset &amp; Retry
              </button>
            </div>
          )}

          {!isGenerating && activeTab === 'config' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Report Type Selector */}
              <div>
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-2">
                  1. Select Report Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'root_cause_analysis' as ReportType,
                      title: 'Root Cause Analysis',
                      icon: 'account_tree',
                      desc: 'Mechanistic evaluation of hydraulic failure, Bayesian plausibility, and evidence traceability.',
                      badge: 'Investigative',
                    },
                    {
                      id: 'incident_intelligence' as ReportType,
                      title: 'Incident Intelligence',
                      icon: 'radar',
                      desc: 'Multi-signal sensor fusion, operational telemetry, confidence assessment, and timeline.',
                      badge: 'Operations',
                    },
                    {
                      id: 'executive_summary' as ReportType,
                      title: 'Executive Summary',
                      icon: 'summarize',
                      desc: 'Concise high-level briefing with key metrics, zone impact, and priority action directives.',
                      badge: 'Leadership',
                    },
                    {
                      id: 'post_incident_review' as ReportType,
                      title: 'Post-Incident Review (PIR)',
                      icon: 'rate_review',
                      desc: 'Retrospective audit of detection latency, operator interventions, and infrastructure lessons.',
                      badge: 'Audit & Compliance',
                    },
                    {
                      id: 'multi_incident_operations' as ReportType,
                      title: 'Multi-Incident Operations',
                      icon: 'hub',
                      desc: 'Cross-district overview aggregating all active incidents, sector alerts, and concurrent telemetry.',
                      badge: 'District Wide',
                    },
                  ].map((card) => {
                    const isSelected = reportType === card.id;
                    return (
                      <div
                        key={card.id}
                        onClick={() => handleReportTypeChange(card.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-secondary-fixed/20 border-primary ring-1 ring-primary shadow-xs'
                            : 'bg-surface-container/30 border-outline-variant hover:bg-surface-container/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`material-symbols-outlined text-[20px] ${
                              isSelected ? 'text-primary' : 'text-on-surface-variant'
                            }`}>
                              {card.icon}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                              {card.badge}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-on-surface">{card.title}</h4>
                          <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Target Scope & Reference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-container/20 p-4 rounded-xl border border-outline-variant/40">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Incident Scope
                  </label>
                  <select
                    value={incidentId}
                    onChange={(e) => setIncidentId(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="INC-2026-8841">INC-2026-8841 • Waterlogging &amp; Inundation (Junction 14)</option>
                    <option value="INC-2048">INC-2048 • Possible Localized Flooding (Sector 4)</option>
                    <option value="INC-2026-8839">INC-2026-8839 • Flash Flood Risk (Culvert 9B Lowlands)</option>
                    <option value="INC-2026-8835">INC-2026-8835 • Secondary Traffic Congestion (King Circle)</option>
                    <option value="all">All District Incidents (Multi-Incident Scope)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Report Reference Identifier
                  </label>
                  <input
                    type="text"
                    value={reportReference}
                    onChange={(e) => setReportReference(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono focus:outline-none focus:border-primary"
                    placeholder="e.g. REP-2026-8841-RCA-REV1"
                  />
                </div>
              </div>

              {/* 3. Metadata, Audience & Markings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Authorizing Organisation
                  </label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Department / Fusion Unit
                  </label>
                  <input
                    type="text"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Target Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="operations_command">Operations Command</option>
                    <option value="executive_leadership">Executive Leadership</option>
                    <option value="inter_agency">Inter-Agency Task Force</option>
                    <option value="audit_board">Audit &amp; Oversight Board</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Reporting Operational Period
                  </label>
                  <input
                    type="text"
                    value={reportingPeriod}
                    onChange={(e) => setReportingPeriod(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Confidentiality Marking
                  </label>
                  <select
                    value={confidentialityMarking}
                    onChange={(e) => setConfidentialityMarking(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="CONFIDENTIAL // MUNICIPAL EMERGENCY RESPONSE">
                      CONFIDENTIAL // MUNICIPAL EMERGENCY RESPONSE
                    </option>
                    <option value="RESTRICTED // OPERATIONAL INTELLIGENCE">
                      RESTRICTED // OPERATIONAL INTELLIGENCE
                    </option>
                    <option value="INTERNAL OFFICIAL USE ONLY">INTERNAL OFFICIAL USE ONLY</option>
                    <option value="PUBLIC SAFETY ADVISORY">PUBLIC SAFETY ADVISORY</option>
                  </select>
                </div>
              </div>

              {/* 4. Sections Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    2. Sections to Include ({selectedSections.length} of {REPORT_SECTIONS_CATALOG.length})
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleSelectAllSections}
                      className="text-secondary hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-outline-variant">•</span>
                    <button
                      type="button"
                      onClick={handleResetRecommendedSections}
                      className="text-secondary hover:underline"
                    >
                      Reset to Recommended
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 bg-surface-container/20 p-3.5 rounded-xl border border-outline-variant/40">
                  {REPORT_SECTIONS_CATALOG.map((sec) => {
                    const isChecked = selectedSections.includes(sec.key);
                    return (
                      <label
                        key={sec.key}
                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-surface-container-lowest border border-outline-variant shadow-2xs'
                            : 'hover:bg-surface-container/60 opacity-60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSection(sec.key)}
                          className="mt-0.5 rounded text-primary focus:ring-primary border-outline-variant"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-on-surface block truncate">
                            {sec.label}
                          </span>
                          <span className="text-[10px] text-on-surface-variant block leading-tight truncate">
                            {sec.description}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 5. Output Format and Footer Submit */}
              <div className="pt-4 border-t border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-on-surface">Target Format:</span>
                  <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value="pdf"
                      checked={format === 'pdf'}
                      onChange={() => setFormat('pdf')}
                    />
                    <span>Vector PDF Document</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value="json"
                      checked={format === 'json'}
                      onChange={() => setFormat('json')}
                    />
                    <span>Structured JSON Data</span>
                  </label>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={closeReportModal}
                    className="h-9 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="h-9 px-5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    <span>Generate &amp; Download Report</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {!isGenerating && activeTab === 'preview' && activeReport && (
            <ReportPreviewView
              report={activeReport}
              onDownloadPdf={() => downloadReport(activeReport, 'pdf')}
              onDownloadJson={() => downloadReport(activeReport, 'json')}
              onRegenerate={() => regenerateReport(activeReport.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
