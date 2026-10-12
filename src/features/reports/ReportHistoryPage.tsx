import React, { useEffect, useState } from 'react';
import { useReportStore } from '../../store/reportStore';
import { GeneratedReport, ReportVersionRecord } from '../../types/reports';
import { reportService } from '../../services/reportService';
import { ReportPreviewView } from './ReportPreviewView';

export const ReportHistoryPage: React.FC = () => {
  const {
    reportHistory,
    loadReportHistory,
    downloadReport,
    regenerateReport,
    openReportModal,
  } = useReportStore();

  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null);
  const [reportVersions, setReportVersions] = useState<ReportVersionRecord[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  useEffect(() => {
    loadReportHistory();
  }, [loadReportHistory]);

  useEffect(() => {
    if (reportHistory.length > 0 && !selectedReport) {
      setSelectedReport(reportHistory[0]);
    }
  }, [reportHistory, selectedReport]);

  useEffect(() => {
    if (selectedReport) {
      reportService.getReportVersions(selectedReport.id).then(setReportVersions);
    }
  }, [selectedReport]);

  const handleRegenerate = async (reportId: string) => {
    setIsRegenerating(true);
    try {
      const updated = await regenerateReport(reportId);
      if (updated) {
        setSelectedReport(updated);
      }
    } finally {
      setIsRegenerating(false);
    }
  };

  const filteredReports = reportHistory.filter((rep) => {
    const matchesType = filterType === 'all' || rep.config.reportType === filterType;
    const matchesSearch =
      !searchQuery ||
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rep.config.reportReference && rep.config.reportReference.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="w-full flex-1 flex flex-col p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">
              folder_managed
            </span>
            <h1 className="text-xl font-bold text-on-surface tracking-tight">
              Report History &amp; Causal Dossiers
            </h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Access previous incident reports, download vector PDFs and JSON, or issue versioned updates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => openReportModal()}
            className="h-9 px-4 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Generate New Report</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left Register & Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {/* Filters Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-2.5 top-2.5">
                search
              </span>
              <input
                type="text"
                placeholder="Search reports or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-9 px-2 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="root_cause_analysis">Root Cause</option>
              <option value="incident_intelligence">Intelligence</option>
              <option value="executive_summary">Executive</option>
              <option value="post_incident_review">PIR</option>
              <option value="multi_incident_operations">Multi-Incident</option>
            </select>
          </div>

          {/* List of Reports */}
          <div className="space-y-2.5 max-h-[72vh] overflow-y-auto pr-1">
            {filteredReports.map((rep) => {
              const isSelected = selectedReport?.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-surface-container-lowest border-primary ring-1 ring-primary shadow-sm'
                      : 'bg-surface-container/20 border-outline-variant hover:bg-surface-container/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-secondary">
                      {rep.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-secondary-fixed text-on-secondary-fixed">
                        v{rep.version}.0
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {rep.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-on-surface line-clamp-2">
                    {rep.title}
                  </h3>

                  <div className="mt-2 text-[11px] text-on-surface-variant flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="truncate max-w-[140px]">{rep.createdBy}</span>
                  </div>

                  {/* Quick Download Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-outline-variant/40 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-on-surface-variant uppercase">
                      {rep.config.reportType.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => downloadReport(rep, 'pdf')}
                        className="h-7 px-2 rounded bg-surface-container hover:bg-primary hover:text-on-primary text-[11px] font-semibold text-on-surface flex items-center gap-1 transition-colors border border-outline-variant/50"
                        title="Download PDF"
                      >
                        <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
                        <span>PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadReport(rep, 'json')}
                        className="h-7 px-2 rounded bg-surface-container hover:bg-surface-container-high text-[11px] font-semibold text-on-surface flex items-center gap-1 transition-colors border border-outline-variant/50"
                        title="Export JSON"
                      >
                        <span className="material-symbols-outlined text-[14px]">data_object</span>
                        <span>JSON</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredReports.length === 0 && (
              <div className="p-8 text-center bg-surface-container/20 rounded-xl border border-outline-variant/40">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                  description
                </span>
                <p className="text-xs text-on-surface-variant mt-2 font-medium">
                  No reports match your search query.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Preview Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedReport ? (
            <div className="space-y-4">
              {/* Version History Sub-block */}
              {reportVersions.length > 1 && (
                <div className="p-3.5 rounded-xl bg-surface-container/30 border border-outline-variant/60 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      history
                    </span>
                    <span className="font-semibold text-on-surface">
                      Document Version History ({reportVersions.length} revisions issued):
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {reportVersions.map((v) => (
                      <span
                        key={v.version}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          v.version === selectedReport.version
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container text-on-surface-variant border border-outline-variant'
                        }`}
                      >
                        v{v.version}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <ReportPreviewView
                report={selectedReport}
                onDownloadPdf={() => downloadReport(selectedReport, 'pdf')}
                onDownloadJson={() => downloadReport(selectedReport, 'json')}
                onRegenerate={() => handleRegenerate(selectedReport.id)}
                isRegenerating={isRegenerating}
              />
            </div>
          ) : (
            <div className="p-12 text-center bg-surface-container/20 rounded-xl border border-outline-variant/40">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                visibility
              </span>
              <p className="text-xs text-on-surface-variant mt-2">
                Select a report from the register on the left to inspect its contents.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
