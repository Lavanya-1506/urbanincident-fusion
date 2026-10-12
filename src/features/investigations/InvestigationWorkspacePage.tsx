import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IncidentRelationshipGraph } from './IncidentRelationshipGraph';
import { INITIAL_INCIDENTS } from '../../services/mockData';

export const InvestigationWorkspacePage: React.FC = () => {
  const { id = 'INC-2048' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'summary' | 'evidence' | 'hypotheses' | 'timeline' | 'relationships' | 'audit'>('summary');
  const [operatorActionState, setOperatorActionState] = useState<string | null>(null);
  const [notes, setNotes] = useState('Reviewed Doppler radar band; correlation with Gauge W-18 surge confirms localized retention basin threshold breach. Pending drone visual pass.');
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Cross-reference Doppler cell intensity', sub: 'Confirmed 38mm/h by analyst at 10:20', done: true },
    { id: 2, text: 'Validate Gauge W-18 health status', sub: 'Battery 98%, no drift flags reported', done: true },
    { id: 3, text: 'Dispatch mobile scout or patrol drone', sub: 'Pending dispatcher response queue', done: false },
    { id: 4, text: 'Notify District 4 Highway Command', sub: 'Awaiting primary confirmation threshold', done: false },
  ]);

  const incident = INITIAL_INCIDENTS.find(i => i.id === id) || INITIAL_INCIDENTS[0];

  const toggleChecklist = (checkId: number) => {
    setChecklist(prev => prev.map(item => item.id === checkId ? { ...item, done: !item.done } : item));
  };

  return (
    <div className="w-full flex flex-col select-none">
      {/* Top Incident Header Ribbon (Stitch exact layout) */}
      <section className="w-full bg-surface-container-lowest border-b border-outline-variant px-margin-desktop py-space-md shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-sm">
          {/* Top Row: Back & Title Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => navigate('/incidents')}
                  className="font-caption text-caption text-secondary hover:underline flex items-center gap-1 mr-2"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Incidents</span>
                </button>
                <span className="font-label-mono text-label-mono font-bold text-on-surface bg-surface-container px-2 py-0.5 rounded">
                  {id}
                </span>
                <h1 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                  Possible localized flooding
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-label-mono-sm text-label-mono-sm font-semibold bg-error-container text-on-error-container">
                  High Alert
                </span>
                <span className="px-2 py-0.5 rounded-full font-caption text-caption font-semibold bg-surface-container-high text-[#A15C07] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A15C07]"></span>
                  Plausible but uncertain
                </span>
              </div>

              {/* Metadata Sub-bar */}
              <div className="flex flex-wrap items-center gap-x-space-lg gap-y-1 font-label-mono-sm text-label-mono-sm text-on-surface-variant pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  <span>First Observed: <span className="text-on-surface font-medium">09:42 AM EST</span> (1h 12m ago)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">update</span>
                  <span>Assessment: <span className="text-on-surface font-medium">Rev v3</span> (10:38 AM EST)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">pin_drop</span>
                  <span>Location: <span className="text-on-surface font-medium">Lower Riverside Underpass (Sector 4)</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">security</span>
                  <span>Confidence Index: <span className="text-on-surface font-semibold">78%</span></span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center flex-wrap gap-space-sm shrink-0">
              <button
                type="button"
                onClick={() => setOperatorActionState('Incident Confirmed and Dispatched')}
                className="h-9 px-space-md rounded bg-primary-container hover:bg-primary text-on-primary font-title-sm text-title-sm flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Confirm Incident</span>
              </button>
              <button
                type="button"
                onClick={() => setOperatorActionState('Incident Marked for Continuous Monitoring')}
                className="h-9 px-space-md rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface font-title-sm text-title-sm flex items-center gap-1.5 shadow-sm transition-colors border border-outline-variant/40"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                <span>Mark for Monitoring</span>
              </button>
              <button
                type="button"
                onClick={() => setOperatorActionState('Incident Dismissed as False Correlation')}
                className="h-9 px-space-md rounded bg-surface-container-lowest hover:bg-error-container text-error hover:text-on-error-container font-title-sm text-title-sm flex items-center gap-1.5 shadow-sm transition-colors border border-outline-variant/40"
              >
                <span className="material-symbols-outlined text-[18px]">block</span>
                <span>Dismiss Incident</span>
              </button>
            </div>
          </div>

          {operatorActionState && (
            <div className="mt-2 p-2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-caption text-caption font-semibold flex items-center justify-between">
              <span>{operatorActionState}</span>
              <button onClick={() => setOperatorActionState(null)} className="font-bold">×</button>
            </div>
          )}

          {/* Workspace Navigation Tabs (Stitch exact layout) */}
          <div className="flex items-center gap-1 mt-space-md overflow-x-auto border-t border-outline-variant/30 pt-2">
            {[
              { id: 'summary', label: 'Summary', count: null },
              { id: 'evidence', label: 'Evidence', count: '4' },
              { id: 'hypotheses', label: 'Hypotheses', count: '3' },
              { id: 'timeline', label: 'Timeline', count: '8' },
              { id: 'relationships', label: 'Relationships', count: '2' },
              { id: 'audit', label: 'Audit History', count: '5' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-space-md py-2 font-title-sm text-title-sm rounded flex items-center gap-1.5 shrink-0 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'hover:bg-surface-container text-on-surface-variant font-medium'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count && (
                  <span className={`px-1.5 py-0.2 rounded-full font-label-mono-sm text-label-mono-sm ${
                    activeTab === tab.id ? 'bg-primary-container text-on-primary' : 'bg-surface-container-high text-on-surface'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Investigation Workspace Grid */}
      <main className="w-full max-w-7xl mx-auto p-space-lg grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* LEFT MAIN COLUMN: 65% width equivalent (8 columns) */}
        <div className="xl:col-span-8 flex flex-col gap-space-lg">
          {activeTab === 'summary' && (
            <>
              {/* 1. Grounded Summary Callout */}
              <section className="bg-surface-container-lowest rounded p-space-lg shadow-sm relative overflow-hidden border border-outline-variant/30">
                <div className="flex items-start gap-space-md">
                  <div className="w-10 h-10 rounded bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">water_damage</span>
                  </div>
                  <div className="flex flex-col gap-space-xs flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                        Incident Grounded Summary
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">
                        Algorithmic Correlation Confidence: 0.81
                      </span>
                    </div>
                    <p className="font-headline-sm text-headline-sm text-on-surface leading-snug">
                      Multiple observations indicate a possible localized flooding event. Rising water-level readings (+0.84m) and reduced traffic speed (14 km/h avg) are temporally aligned. Direct visual or municipal confirmation of road inundation is still missing.
                    </p>
                    <div className="mt-space-sm pt-space-sm bg-surface-container-low rounded p-space-sm flex flex-wrap items-center gap-x-space-lg gap-y-2 text-on-surface font-caption text-caption">
                      <span className="flex items-center gap-1 text-on-surface font-semibold">
                        <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                        3 Consistent Sensor Telemetries
                      </span>
                      <span className="flex items-center gap-1 text-[#A15C07] font-semibold">
                        <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                        1 Critical Verification Void (Road Camera Footage)
                      </span>
                      <span className="flex items-center gap-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">history</span>
                        Synthesized automatically at 10:38:12 EST
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Ranked Hypotheses Analysis */}
              <section className="bg-surface-container-lowest rounded p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Hypotheses Analysis</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-label-mono-sm text-label-mono-sm bg-surface-container-high text-on-surface font-medium">
                      Ranked by Evidence Weight
                    </span>
                  </div>
                </div>

                {/* H-1 Primary */}
                <div className="p-space-md bg-surface-container-low rounded shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
                  <div className="flex flex-wrap items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm">
                      <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-label-mono-sm text-label-mono-sm font-semibold">
                        H-1 Primary
                      </span>
                      <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                        Stormwater conduit overflow exacerbated by high tide runoff
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-caption text-caption font-semibold bg-surface-container-high text-[#A15C07] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A15C07]"></span> Plausible but uncertain
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    High tide peaked at 10:00 AM EST, reducing gravity outflow capacity of Sector 4 conduit culverts. In combination with 38mm/h precipitation, pooling in the underpass basin is mechanically probable.
                  </p>
                  <div className="flex flex-wrap items-center gap-space-md pt-1">
                    <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                      3 Supporting
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                      0 Contradictory
                    </span>
                    <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-mono-sm text-label-mono-sm font-semibold">
                      1 Missing Verification
                    </span>
                  </div>
                  <div className="p-space-sm rounded bg-surface-container-lowest flex items-center justify-between gap-space-md border border-outline-variant/30">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[18px] text-secondary">explore</span>
                      <span className="font-caption text-caption text-on-surface">
                        <strong>Suggested verification:</strong> Dispatch mobile visual check to Lower Riverside underpass.
                      </span>
                    </div>
                    <button 
                      onClick={() => alert('Dispatch Request Created for Sector 4 Patrol')}
                      className="h-7 px-3 rounded bg-secondary text-on-secondary font-caption text-caption font-semibold hover:bg-on-secondary-fixed transition-colors shrink-0"
                    >
                      Create Dispatch Request
                    </button>
                  </div>
                </div>

                {/* H-2 Alternative */}
                <div className="p-space-md bg-surface-container-low rounded shadow-sm flex flex-col gap-space-sm opacity-90 border border-outline-variant/20">
                  <div className="flex flex-wrap items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-mono-sm text-label-mono-sm font-semibold">
                        H-2 Alternative
                      </span>
                      <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                        Localized sensor calibration drift / false gauge telemetry
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-caption text-caption font-semibold bg-surface-container-high text-on-surface-variant flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> Contradicted by available evidence
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Single-point hydro gauge acoustic transducer failure or drift would produce false elevation spikes without corroboration.
                  </p>
                  <div className="flex flex-wrap items-center gap-space-md pt-1">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                      1 Supporting (Sensor drift history)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-mono-sm text-label-mono-sm font-semibold">
                      2 Contradictory
                    </span>
                  </div>
                </div>
              </section>
            </>
          )}

          {(activeTab === 'evidence' || activeTab === 'summary') && (
            /* 3. Structured Evidence Ledger */
            <section className="bg-surface-container-lowest rounded p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex flex-wrap items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">Structured Evidence Ledger</span>
                  <span className="px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm bg-surface-container-high text-on-surface">
                    4 items logged
                  </span>
                </div>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="h-9 bg-surface-container text-on-surface-variant font-caption text-caption uppercase tracking-wider font-semibold border-b border-outline-variant/30">
                      <th className="px-space-md">Source / Sensor</th>
                      <th className="px-space-md">Observed Parameter</th>
                      <th className="px-space-md font-label-mono-sm text-label-mono-sm">Event Time</th>
                      <th className="px-space-md font-label-mono-sm text-label-mono-sm">Ingest Time</th>
                      <th className="px-space-md">Relationship</th>
                      <th className="px-space-md text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high font-table-data text-table-data text-on-surface">
                    <tr className="h-12 hover:bg-surface-container-low transition-colors">
                      <td className="px-space-md">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                          <span className="font-medium text-on-surface">Hydrological Gauge W-18</span>
                        </div>
                        <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant pl-4">Sector 4 Culvert Intake</span>
                      </td>
                      <td className="px-space-md font-label-mono font-semibold text-error">+0.84m (Thr: +0.60m)</td>
                      <td className="px-space-md font-label-mono text-label-mono text-on-surface-variant">10:14:22 EST</td>
                      <td className="px-space-md font-label-mono text-label-mono text-on-surface-variant">10:15:01 EST</td>
                      <td className="px-space-md">
                        <span className="px-2 py-0.5 rounded font-caption text-caption font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                          Supports H-1
                        </span>
                      </td>
                      <td className="px-space-md text-right font-label-mono font-medium">99.4%</td>
                    </tr>

                    <tr className="h-12 hover:bg-surface-container-low transition-colors">
                      <td className="px-space-md">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                          <span className="font-medium text-on-surface">Doppler Rain Station D-4</span>
                        </div>
                        <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant pl-4">Metro Central Radar</span>
                      </td>
                      <td className="px-space-md font-label-mono font-semibold text-on-surface">38 mm/h</td>
                      <td className="px-space-md font-label-mono text-label-mono text-on-surface-variant">10:08:00 EST</td>
                      <td className="px-space-md font-label-mono text-label-mono text-on-surface-variant">10:09:12 EST</td>
                      <td className="px-space-md">
                        <span className="px-2 py-0.5 rounded font-caption text-caption font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                          Supports H-1
                        </span>
                      </td>
                      <td className="px-space-md text-right font-label-mono font-medium">94.1%</td>
                    </tr>

                    <tr className="h-12 hover:bg-surface-container-low transition-colors">
                      <td className="px-space-md">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-secondary"></span>
                          <span className="font-medium text-on-surface">DOT Camera TF-04 Telemetry</span>
                        </div>
                        <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant pl-4">Speed Sensor / VMT Stream</span>
                      </td>
                      <td className="px-space-md font-label-mono font-semibold text-on-surface">14 km/h avg (-64%)</td>
                      <td className="px-space-md font-label-mono text-label-mono text-on-surface-variant">10:22:15 EST</td>
                      <td className="px-space-md font-label-mono text-label-mono text-on-surface-variant">10:24:05 EST</td>
                      <td className="px-space-md">
                        <span className="px-2 py-0.5 rounded font-caption text-caption font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                          Supports H-1
                        </span>
                      </td>
                      <td className="px-space-md text-right font-label-mono font-medium">88.5%</td>
                    </tr>

                    <tr className="h-12 bg-error-container/20 hover:bg-error-container/30 transition-colors">
                      <td className="px-space-md">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-error"></span>
                          <span className="font-medium text-on-surface">Road Inundation Cam #402</span>
                        </div>
                        <span className="font-label-mono-sm text-label-mono-sm text-error font-medium pl-4">Missing Physical Check</span>
                      </td>
                      <td className="px-space-md text-caption text-on-surface-variant italic">Direct road video feed offline</td>
                      <td className="px-space-md font-label-mono text-label-mono text-on-surface-variant">—</td>
                      <td className="px-space-md font-label-mono text-label-mono text-on-surface-variant">—</td>
                      <td className="px-space-md">
                        <span className="px-2 py-0.5 rounded font-caption text-caption font-semibold bg-error-container text-on-error-container">
                          Critical Gap
                        </span>
                      </td>
                      <td className="px-space-md text-right font-label-mono font-medium text-error">Missing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {(activeTab === 'timeline' || activeTab === 'summary') && (
            /* 4. Chronological Timeline Strip */
            <section className="bg-surface-container-lowest rounded p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex flex-wrap items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">Chronological Timeline Strip</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">Temporal alignment &amp; Latency delta</span>
                </div>
                <div className="flex items-center gap-space-md font-caption text-caption text-on-surface-variant">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Physical Event</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-outline"></span> System Ingest</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span> Analyst Decision</span>
                </div>
              </div>
              <div className="relative pl-6 flex flex-col gap-space-md before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
                <div className="relative flex flex-col sm:flex-row sm:items-baseline justify-between gap-space-xs">
                  <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-surface-container-lowest"></span>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">High Tide Peak + Heavy Rain Surge</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Radar D-4 records continuous 38mm/h cloudburst cells crossing Sector 4.</span>
                  </div>
                  <div className="flex sm:flex-col items-end shrink-0 font-label-mono-sm text-label-mono-sm">
                    <span className="text-on-surface font-medium">10:08:00 EST</span>
                    <span className="text-on-surface-variant">Ingested +72s</span>
                  </div>
                </div>

                <div className="relative flex flex-col sm:flex-row sm:items-baseline justify-between gap-space-xs">
                  <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-surface-container-lowest"></span>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">Water Level Threshold Breach (+0.84m)</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Gauge W-18 crossed trigger value (+0.60m) inside underpass retention channel.</span>
                  </div>
                  <div className="flex sm:flex-col items-end shrink-0 font-label-mono-sm text-label-mono-sm">
                    <span className="text-on-surface font-medium">10:14:22 EST</span>
                    <span className="text-on-surface-variant">Ingested +39s</span>
                  </div>
                </div>

                <div className="relative flex flex-col sm:flex-row sm:items-baseline justify-between gap-space-xs">
                  <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-outline ring-4 ring-surface-container-lowest"></span>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">Automated Fusion Engine Alert INC-2048</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">System linked Gauge W-18 surge with Radar precipitation; incident opened.</span>
                  </div>
                  <div className="flex sm:flex-col items-end shrink-0 font-label-mono-sm text-label-mono-sm">
                    <span className="text-on-surface font-medium">10:15:30 EST</span>
                    <span className="text-on-surface-variant">Latency 29s</span>
                  </div>
                </div>

                <div className="relative flex flex-col sm:flex-row sm:items-baseline justify-between gap-space-xs">
                  <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-primary-container ring-4 ring-surface-container-lowest"></span>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">Analyst Vance Claimed Investigation</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Escalated severity level from Moderate to High Alert based on traffic corroboration.</span>
                  </div>
                  <div className="flex sm:flex-col items-end shrink-0 font-label-mono-sm text-label-mono-sm">
                    <span className="text-on-surface font-medium">10:38:12 EST</span>
                    <span className="text-on-surface-variant">Manual Rev v3</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'relationships' && (
            <section className="bg-surface-container-lowest rounded p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-title-md text-title-md text-on-surface font-semibold">Evidence Relationship Graph</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">Interactive causal and observational DAG</span>
              </div>
              <div className="w-full h-[520px] rounded border border-outline-variant/40 overflow-hidden">
                <IncidentRelationshipGraph incident={incident} />
              </div>
            </section>
          )}

          {activeTab === 'audit' && (
            <section className="bg-surface-container-lowest rounded p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
              <span className="font-title-md text-title-md text-on-surface font-semibold">Audit History &amp; Decision Record</span>
              <div className="divide-y divide-surface-container-high text-body-sm">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <strong className="text-on-surface">Severity Escalated to High Alert</strong> by Elena Vance (Lead Incident Analyst)
                    <div className="font-caption text-caption text-on-surface-variant">Corroborated by 3 telemetries + 911 triad</div>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">10:38:12 EST</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <strong className="text-on-surface">Auto-Fusion Engine Ingestion</strong>
                    <div className="font-caption text-caption text-on-surface-variant">Matched Gauge W-18 (+0.84m) with Radar band D-4</div>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">10:15:30 EST</span>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: 35% width equivalent (4 columns) */}
        <div className="xl:col-span-4 flex flex-col gap-space-lg">
          {/* Geographic Context Map Card */}
          <section className="bg-surface-container-lowest rounded p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">map</span>
                <span className="font-title-sm text-title-sm text-on-surface font-semibold">Geographic Context Map</span>
              </div>
              <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-surface-container text-on-surface">
                Sector 4 Lower Riverside
              </span>
            </div>
            <div className="relative w-full h-48 bg-surface-container-high rounded overflow-hidden cursor-pointer" onClick={() => navigate('/map')}>
              <svg className="w-full h-full text-on-surface" fill="none" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                <rect fill="#EAECE6" height="200" width="400"></rect>
                <path d="M 180 0 C 190 60, 170 110, 210 150 C 240 180, 280 190, 400 200" fill="none" opacity="0.6" stroke="#92C5FD" strokeWidth="12"></path>
                <circle cx="210" cy="120" r="14" fill="#B42318" fillOpacity="0.25"></circle>
                <circle cx="210" cy="120" r="5" fill="#B42318"></circle>
              </svg>
              <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded bg-surface-container-lowest/95 backdrop-blur shadow-sm flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface text-[10px]">
                <span>W-18 (0.12km)</span>
                <span>TF-04 (0.28km)</span>
                <span className="text-secondary font-semibold">Open Live Map →</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant pt-1">
              <span>Coords: 42.3601° N, 71.0589° W</span>
              <span>Basin Drainage B</span>
            </div>
          </section>

          {/* Telemetry Freshness & Health */}
          <section className="bg-surface-container-lowest rounded p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">Telemetry Freshness &amp; Health</span>
              <span className="font-caption text-caption text-on-surface-variant">Real-time Ingest</span>
            </div>
            <div className="flex flex-col gap-space-xs">
              <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">USGS Stream Gauge W-18</span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">Telemetry interval: 30s</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-caption text-caption font-semibold text-tertiary">Healthy</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">42s ago</span>
                </div>
              </div>

              <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A15C07]"></span>
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">DOT Camera TF-04 Feed</span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">High packet jitter</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-caption text-caption font-semibold text-[#A15C07]">Degraded</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">Latency 4.2s</span>
                </div>
              </div>
            </div>
          </section>

          {/* Verification Checklist */}
          <section className="bg-surface-container-lowest rounded p-space-md shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">Verification Checklist</span>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant font-medium">
                {checklist.filter(c => c.done).length} / {checklist.length} complete
              </span>
            </div>
            <div className="flex flex-col gap-space-sm">
              {checklist.map(item => (
                <label key={item.id} className="flex items-start gap-space-sm p-space-xs rounded hover:bg-surface-container-low cursor-pointer">
                  <input
                    checked={item.done}
                    onChange={() => toggleChecklist(item.id)}
                    className="mt-1 h-4 w-4 rounded accent-primary cursor-pointer"
                    type="checkbox"
                  />
                  <div className="flex flex-col">
                    <span className={`font-body-sm text-body-sm text-on-surface font-medium ${item.done ? 'line-through opacity-70' : ''}`}>
                      {item.text}
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      {item.sub}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Notes Section */}
            <div className="flex flex-col gap-space-xs pt-space-xs border-t border-outline-variant/30">
              <label className="font-caption text-caption text-on-surface-variant uppercase font-semibold tracking-wider">
                Investigator Note
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full p-2 rounded bg-surface border border-outline-variant text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-secondary"
              />
              <button 
                type="button" 
                onClick={() => alert('Investigator note saved to audit ledger.')}
                className="self-end px-3 py-1 rounded bg-surface-container text-on-surface font-caption text-caption font-semibold hover:bg-surface-container-high transition-colors"
              >
                Save Note
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
