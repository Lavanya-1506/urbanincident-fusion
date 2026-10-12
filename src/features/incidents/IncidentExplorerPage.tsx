import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidentStore } from '../../store/incidentStore';
import { useReportStore } from '../../store/reportStore';

interface IncidentRecord {
  id: string;
  title: string;
  category: string;
  categoryBg: string;
  categoryText: string;
  subtitle: string;
  location: string;
  sector: string;
  severity: 'High' | 'Moderate' | 'Unassessed' | 'Low';
  severityBg: string;
  severityText: string;
  severityDot: string;
  status: string;
  statusBg: string;
  statusText: string;
  statusIcon?: string;
  assessmentSummary: string;
  evidenceRatio: string;
  supportedPct: number;
  missingPct: number;
  updatedAgo: string;
}

export const IncidentExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedIncidentId } = useIncidentStore();
  const { openReportModal } = useReportStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['INC-2048']));
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);

  const incidents: IncidentRecord[] = [
    {
      id: 'INC-2048',
      title: 'Possible localized flooding',
      category: 'HYDRO',
      categoryBg: 'bg-error-container',
      categoryText: 'text-on-error-container',
      subtitle: 'Water level surge + rain spike (+14mm/h)',
      location: 'Lower Riverside & 4th Ave',
      sector: 'Sector 4 • Grid C-12',
      severity: 'High',
      severityBg: 'bg-error-container',
      severityText: 'text-on-error-container',
      severityDot: 'bg-error',
      status: 'Under Review',
      statusBg: 'bg-surface-container',
      statusText: 'text-on-surface-variant',
      statusIcon: 'sync',
      assessmentSummary: 'Plausible but uncertain',
      evidenceRatio: '3 Supp / 0 Contra / 1 Miss',
      supportedPct: 75,
      missingPct: 25,
      updatedAgo: '4m ago',
    },
    {
      id: 'INC-2051',
      title: 'Traffic bottleneck cascade',
      category: 'MOBILITY',
      categoryBg: 'bg-secondary-fixed',
      categoryText: 'text-on-secondary-fixed',
      subtitle: 'CCTV speed drops under 8mph across 3 segments',
      location: 'Crosstown Expy & Mile 14',
      sector: 'Sector 3 • Grid F-08',
      severity: 'Moderate',
      severityBg: 'bg-surface-container-high',
      severityText: 'text-on-surface',
      severityDot: 'bg-surface-tint',
      status: 'Monitoring',
      statusBg: 'bg-tertiary-fixed',
      statusText: 'text-on-tertiary-fixed',
      statusIcon: 'visibility',
      assessmentSummary: 'Supported by traffic obs',
      evidenceRatio: '4 Supp / 0 Contra / 0 Miss',
      supportedPct: 100,
      missingPct: 0,
      updatedAgo: '12m ago',
    },
    {
      id: 'INC-2054',
      title: 'Telemetry deviation detected',
      category: 'GRID',
      categoryBg: 'bg-surface-container-highest',
      categoryText: 'text-on-surface',
      subtitle: 'Transducer discrepancy between Sub-station 9 & weir',
      location: 'North Station Water District',
      sector: 'Sector 1 • Grid A-04',
      severity: 'Unassessed',
      severityBg: 'bg-surface-container-high',
      severityText: 'text-on-surface-variant',
      severityDot: 'bg-secondary',
      status: 'Under Review',
      statusBg: 'bg-secondary-fixed',
      statusText: 'text-on-secondary-fixed-variant',
      statusIcon: 'pending',
      assessmentSummary: 'Insufficient corroboration',
      evidenceRatio: '1 Supp / 1 Contra / 0 Miss',
      supportedPct: 50,
      missingPct: 0,
      updatedAgo: '18m ago',
    },
    {
      id: 'INC-2057',
      title: 'Civic Plaza drain clogged',
      category: 'HYDRO',
      categoryBg: 'bg-surface-container',
      categoryText: 'text-on-surface-variant',
      subtitle: 'Trash barrier blockage; curb ponding',
      location: 'Civic Plaza East Conduit',
      sector: 'Sector 4 • Grid C-19',
      severity: 'Low',
      severityBg: 'bg-surface-container',
      severityText: 'text-on-surface-variant',
      severityDot: 'bg-outline',
      status: 'Detected',
      statusBg: 'bg-surface-container-highest',
      statusText: 'text-on-surface-variant',
      statusIcon: 'radio_button_checked',
      assessmentSummary: 'DPW verified dispatch',
      evidenceRatio: '2 Supp / 0 Contra / 0 Miss',
      supportedPct: 100,
      missingPct: 0,
      updatedAgo: '27m ago',
    },
    {
      id: 'INC-2042',
      title: 'Structural clearance obstruction',
      category: 'INFRA',
      categoryBg: 'bg-tertiary-fixed',
      categoryText: 'text-on-tertiary-fixed',
      subtitle: 'Scaffolding displacement reported on track 2',
      location: 'Harbor Freight Line Km 18.2',
      sector: 'Sector 2 • Grid B-22',
      severity: 'Moderate',
      severityBg: 'bg-surface-container-high',
      severityText: 'text-on-surface',
      severityDot: 'bg-outline',
      status: 'Human Confirmed',
      statusBg: 'bg-tertiary-fixed',
      statusText: 'text-on-tertiary-fixed',
      statusIcon: 'verified',
      assessmentSummary: 'Transit crew on site',
      evidenceRatio: '3 Supp / 0 Contra / 0 Miss',
      supportedPct: 100,
      missingPct: 0,
      updatedAgo: '45m ago',
    },
  ];

  const filtered = incidents.filter(inc => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!inc.id.toLowerCase().includes(q) && !inc.title.toLowerCase().includes(q) && !inc.location.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (severityFilter && inc.severity !== severityFilter) return false;
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(i => i.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleInvestigate = (id: string) => {
    setSelectedIncidentId(id);
    navigate(`/incidents/${id}`);
  };

  return (
    <div className="w-full flex flex-col select-none">
      {/* Top Filter and Ribbon Area (Stitch exact layout) */}
      <section className="w-full bg-surface-container-lowest border-b border-outline-variant px-margin-desktop py-space-sm shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-sm">
          {/* Search & Action Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-sm">
            <div className="relative flex-1 max-w-xl">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">
                filter_list
              </span>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-24 rounded bg-surface text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest transition-colors shadow-sm border border-outline-variant/40"
                placeholder="Filter by ID, keywords, street, or telemetry..."
                type="text"
              />
              {searchQuery && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="px-1.5 py-0.5 text-[10px] font-label-mono-sm text-label-mono-sm text-on-surface-variant hover:text-on-surface bg-surface-container rounded"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Filter Action Buttons */}
            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                onClick={() => openReportModal(undefined, 'multi_incident_operations')}
                className="h-9 px-3 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-caption text-caption font-semibold flex items-center gap-1.5 transition-colors border border-outline-variant shadow-xs"
                title="Generate and download operations report"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">download</span>
                <span>Download Report</span>
              </button>
              <button 
                type="button" 
                onClick={() => setSeverityFilter(severityFilter ? null : 'High')}
                className="h-9 px-3 rounded bg-surface text-on-surface font-caption text-caption flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-sm border border-outline-variant/40"
              >
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">tune</span>
                <span>{severityFilter ? `Filter: ${severityFilter}` : '+ Add Filter'}</span>
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setSearchQuery('');
                  setSeverityFilter(null);
                }}
                className="h-9 px-2.5 rounded text-error hover:bg-error-container hover:text-on-error-container font-caption text-caption transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>

          {/* Active Filter Pills & Summary Counter */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-caption text-caption">
                <span className="text-on-surface-variant">Severity:</span>
                <span className="font-semibold text-error">High &amp; Critical</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-caption text-caption">
                <span className="text-on-surface-variant">Status:</span>
                <span className="font-semibold">Active, Under Review</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-caption text-caption">
                <span className="text-on-surface-variant">Sector:</span>
                <span className="font-semibold">Sector 4</span>
              </span>
            </div>

            <div className="flex items-center gap-space-sm font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-error"></span>
                Showing <strong className="text-on-surface font-semibold">{filtered.length} matching incidents</strong> (1 critical, 2 under review)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Area */}
      <main className="w-full max-w-7xl mx-auto px-margin-desktop py-space-md space-y-space-md">
        {/* Visual Sector Quick-View Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-sm">
          <div className="p-3 bg-surface-container-lowest rounded shadow-sm flex items-center justify-between border border-outline-variant/30">
            <div>
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider text-[10px]">Critical Severity</span>
              <div className="font-headline-sm text-headline-sm text-error font-semibold flex items-center gap-1">
                03 <span className="text-[12px] font-label-mono-sm text-on-surface-variant font-normal">Active</span>
              </div>
            </div>
            <div className="p-2 rounded bg-error-container text-on-error-container">
              <span className="material-symbols-outlined text-[20px]">e911_emergency</span>
            </div>
          </div>

          <div className="p-3 bg-surface-container-lowest rounded shadow-sm flex items-center justify-between border border-outline-variant/30">
            <div>
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider text-[10px]">Under Review</span>
              <div className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-1">
                05 <span className="text-[12px] font-label-mono-sm text-on-surface-variant font-normal">Triage Queue</span>
              </div>
            </div>
            <div className="p-2 rounded bg-surface-container-high text-on-surface">
              <span className="material-symbols-outlined text-[20px]">assignment_late</span>
            </div>
          </div>

          <div className="p-3 bg-surface-container-lowest rounded shadow-sm flex items-center justify-between border border-outline-variant/30">
            <div>
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider text-[10px]">Telemetry Feed Health</span>
              <div className="font-headline-sm text-headline-sm text-tertiary-container font-semibold flex items-center gap-1">
                98.4% <span className="text-[12px] font-label-mono-sm text-on-surface-variant font-normal">Nominal</span>
              </div>
            </div>
            <div className="p-2 rounded bg-tertiary-fixed text-on-tertiary-fixed">
              <span className="material-symbols-outlined text-[20px]">sensors</span>
            </div>
          </div>

          <div className="p-3 bg-surface-container-lowest rounded shadow-sm flex items-center justify-between border border-outline-variant/30">
            <div>
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider text-[10px]">Avg Triage Latency</span>
              <div className="font-headline-sm text-headline-sm text-secondary font-semibold flex items-center gap-1">
                2.3m <span className="text-[12px] font-label-mono-sm text-on-surface-variant font-normal">-14s vs avg</span>
              </div>
            </div>
            <div className="p-2 rounded bg-secondary-fixed text-on-secondary-container">
              <span className="material-symbols-outlined text-[20px]">pace</span>
            </div>
          </div>
        </div>

        {/* High-Density Incident Data Table */}
        <div className="bg-surface-container-lowest rounded shadow-sm overflow-hidden flex flex-col border border-outline-variant/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-caption text-caption font-semibold tracking-wider uppercase text-[11px] select-none border-b border-outline-variant/30">
                  <th className="py-2.5 px-3 w-10 text-center" scope="col">
                    <input
                      checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Select all incidents"
                      className="rounded accent-primary w-4 h-4 cursor-pointer"
                      type="checkbox"
                    />
                  </th>
                  <th className="py-2.5 px-3 w-28 font-label-mono-sm text-label-mono-sm" scope="col">ID</th>
                  <th className="py-2.5 px-4 min-w-[260px]" scope="col">Incident Title &amp; Core Evidence</th>
                  <th className="py-2.5 px-4 min-w-[190px]" scope="col">Sector &amp; Location</th>
                  <th className="py-2.5 px-3 w-32" scope="col">Severity</th>
                  <th className="py-2.5 px-3 w-36" scope="col">Status</th>
                  <th className="py-2.5 px-4 min-w-[240px]" scope="col">Telemetry &amp; Evidence Balance</th>
                  <th className="py-2.5 px-3 w-24 text-right font-label-mono-sm text-label-mono-sm" scope="col">Updated</th>
                  <th className="py-2.5 px-3 w-28 text-center" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high text-on-surface font-body-sm text-body-sm">
                {filtered.map(inc => (
                  <tr
                    key={inc.id}
                    onClick={() => handleInvestigate(inc.id)}
                    className="hover:bg-surface-container-low transition-colors group cursor-pointer bg-surface-container-lowest"
                  >
                    <td className="py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                      <input
                        checked={selectedIds.has(inc.id)}
                        onChange={() => toggleSelectOne(inc.id)}
                        aria-label={`Select ${inc.id}`}
                        className="rounded accent-primary w-4 h-4 cursor-pointer"
                        type="checkbox"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-label-mono text-label-mono font-semibold text-primary">
                        <span>{inc.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-title-sm text-title-sm font-semibold text-on-surface group-hover:text-secondary transition-colors">
                            {inc.title}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded ${inc.categoryBg} ${inc.categoryText} font-caption text-caption text-[10px] font-bold`}>
                            {inc.category}
                          </span>
                        </div>
                        <span className="font-caption text-caption text-on-surface-variant">
                          {inc.subtitle}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-body-sm text-body-sm font-medium text-on-surface">
                          {inc.location}
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> {inc.sector}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-label-mono-sm text-label-mono-sm font-semibold ${inc.severityBg} ${inc.severityText}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${inc.severityDot}`}></span> {inc.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-label-mono-sm text-label-mono-sm font-medium ${inc.statusBg} ${inc.statusText}`}>
                        {inc.statusIcon && (
                          <span className="material-symbols-outlined text-[13px]">{inc.statusIcon}</span>
                        )}
                        <span>{inc.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[11px] font-label-mono-sm text-label-mono-sm">
                          <span className="font-semibold text-on-surface">{inc.assessmentSummary}</span>
                          <span className="text-on-surface-variant">{inc.evidenceRatio}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden flex">
                          <div className="h-full bg-tertiary-container" style={{ width: `${inc.supportedPct}%` }}></div>
                          {inc.missingPct > 0 && (
                            <div className="h-full bg-outline-variant" style={{ width: `${inc.missingPct}%` }}></div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      {inc.updatedAgo}
                    </td>
                    <td className="py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleInvestigate(inc.id)}
                          className="px-2 py-1 rounded bg-surface hover:bg-surface-container-high text-on-surface font-caption text-caption flex items-center gap-1 transition-colors shadow-sm border border-outline-variant/30"
                        >
                          <span>Investigate</span>
                          <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3 bg-surface-container-low flex items-center justify-between text-caption text-on-surface-variant border-t border-outline-variant/30">
            <span>Showing 1-5 of {filtered.length} incidents</span>
            <div className="flex items-center gap-2">
              <button disabled className="px-2 py-1 rounded bg-surface opacity-50 font-label-mono-sm">Prev</button>
              <button disabled className="px-2 py-1 rounded bg-surface opacity-50 font-label-mono-sm">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
