import React, { useState } from 'react';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'6h' | '24h' | '7d' | '30d'>('24h');

  return (
    <div className="w-full flex flex-col select-none">
      {/* Top Header Strip (Stitch exact layout) */}
      <section className="w-full bg-surface-container-lowest border-b border-outline-variant px-margin-desktop py-space-md shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-mono text-label-mono font-bold text-on-surface bg-surface-container px-2 py-0.5 rounded">
                OPS-METRICS
              </span>
              <h1 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                Operational Analytics &amp; Causal Performance
              </h1>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Empirical multi-source evaluation, fusion reliability, and triage latency telemetry
            </p>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="flex items-center bg-surface-container rounded p-0.5">
              {(['6h', '24h', '7d', '30d'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeRange(t)}
                  className={`px-2.5 py-1 font-label-mono-sm text-label-mono-sm rounded transition-colors ${
                    timeRange === t
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => alert('Dispatch Briefing exported as PDF.')}
              className="h-9 px-3 bg-primary-container text-on-primary hover:bg-primary rounded font-body-sm text-body-sm shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              <span className="font-medium">Dispatch Briefing</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-margin-desktop py-space-lg flex flex-col gap-space-lg">
        {/* High-Density Operational KPI Metric Strip (4 Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Metric 1 */}
          <div className="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                  Total Ingested Incidents
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">142</span>
                  <span className="inline-flex items-center text-label-mono-sm text-label-mono-sm text-tertiary-container font-semibold">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>+14%
                  </span>
                </div>
              </div>
              <div className="w-9 h-9 rounded bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">crisis_alert</span>
              </div>
            </div>
            <div className="mt-3 pt-2 bg-surface-container-low -mx-space-md -mb-space-md px-space-md py-2 flex items-center justify-between text-label-mono-sm font-label-mono-sm border-t border-outline-variant/20">
              <span className="text-on-surface-variant">Auto-Correlated</span>
              <span className="font-semibold text-on-surface">89.2% (127 nodes)</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                  Mean Time To Review (MTTR)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                    8.4<span className="text-title-sm text-on-surface-variant font-normal ml-0.5">m</span>
                  </span>
                  <span className="inline-flex items-center text-label-mono-sm text-label-mono-sm text-tertiary-container font-semibold">
                    <span className="material-symbols-outlined text-[14px]">arrow_downward</span>-2.1m faster
                  </span>
                </div>
              </div>
              <div className="w-9 h-9 rounded bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">timer</span>
              </div>
            </div>
            <div className="mt-3 pt-2 bg-surface-container-low -mx-space-md -mb-space-md px-space-md py-2 flex items-center justify-between text-label-mono-sm font-label-mono-sm border-t border-outline-variant/20">
              <span className="text-on-surface-variant">Benchmark Threshold</span>
              <span className="text-on-surface font-semibold">12.0m target</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                  False Positive / Drift Rate
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">3.2%</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-label-mono-sm text-label-mono-sm bg-error-container text-on-error-container font-semibold">
                    Cluster E-9
                  </span>
                </div>
              </div>
              <div className="w-9 h-9 rounded bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">sensors_off</span>
              </div>
            </div>
            <div className="mt-3 pt-2 bg-surface-container-low -mx-space-md -mb-space-md px-space-md py-2 flex items-center justify-between text-label-mono-sm font-label-mono-sm border-t border-outline-variant/20">
              <span className="text-on-surface-variant">Acoustic Triangulation</span>
              <span className="text-error font-semibold">1 Degraded Sensor</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                  Multi-Source Corroboration
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">78.6%</span>
                  <span className="inline-flex items-center text-label-mono-sm text-label-mono-sm text-secondary font-semibold">
                    ≥3 Telemetry Streams
                  </span>
                </div>
              </div>
              <div className="w-9 h-9 rounded bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </div>
            </div>
            <div className="mt-3 pt-2 bg-surface-container-low -mx-space-md -mb-space-md px-space-md py-2 flex items-center justify-between text-label-mono-sm font-label-mono-sm border-t border-outline-variant/20">
              <span className="text-on-surface-variant">High-Fidelity Consensus</span>
              <span className="text-on-surface font-semibold">111 / 142 Incidents</span>
            </div>
          </div>
        </section>

        {/* Primary Analytical Visualizations (60% / 40% Bento Split) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* Visual 1 (Left 7 Cols): Timeline Histogram */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded shadow-sm flex flex-col justify-between border border-outline-variant/30">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-4">
                <div>
                  <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                    Incident Velocity &amp; Distribution Timeline
                  </h2>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Categorical telemetry volume aggregated across 6-hour operational windows
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-caption font-caption text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-secondary"></span>
                    <span>Hydro / Flood</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-primary-container"></span>
                    <span>Mobility</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-tertiary-container"></span>
                    <span>Grid / Power</span>
                  </div>
                </div>
              </div>

              {/* Stacked Histogram & Timeline Canvas */}
              <div className="relative w-full h-64 bg-surface-container-low rounded p-3 flex flex-col justify-end overflow-hidden border border-outline-variant/20">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 680 220">
                  <line className="text-surface-variant" stroke="#E1E3DD" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="660" y1="30" y2="30"></line>
                  <line className="text-surface-variant" stroke="#E1E3DD" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="660" y1="80" y2="80"></line>
                  <line className="text-surface-variant" stroke="#E1E3DD" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="660" y1="130" y2="130"></line>

                  {/* Group 1: 00:00 - 06:00 */}
                  <g transform="translate(80, 0)">
                    <rect fill="#747874" height="12" rx="1" width="44" x="0" y="168"></rect>
                    <rect fill="#004225" height="18" rx="1" width="44" x="0" y="150"></rect>
                    <rect fill="#343a35" height="24" rx="1" width="44" x="0" y="126"></rect>
                    <rect fill="#2a6194" height="16" rx="1" width="44" x="0" y="110"></rect>
                  </g>
                  {/* Group 2: 06:00 - 12:00 */}
                  <g transform="translate(230, 0)">
                    <rect fill="#747874" height="14" rx="1" width="44" x="0" y="166"></rect>
                    <rect fill="#004225" height="26" rx="1" width="44" x="0" y="140"></rect>
                    <rect fill="#343a35" height="64" rx="1" width="44" x="0" y="76"></rect>
                    <rect fill="#2a6194" height="32" rx="1" width="44" x="0" y="44"></rect>
                  </g>
                  {/* Group 3: 12:00 - 18:00 (Peak Surge) */}
                  <g transform="translate(385, 0)">
                    <rect fill="#747874" height="20" rx="1" width="44" x="0" y="160"></rect>
                    <rect fill="#004225" height="44" rx="1" width="44" x="0" y="116"></rect>
                    <rect fill="#343a35" height="72" rx="1" width="44" x="0" y="44"></rect>
                    <rect fill="#2a6194" height="56" rx="1" width="44" x="0" y="-12"></rect>
                  </g>
                  {/* Group 4: 18:00 - Current */}
                  <g transform="translate(540, 0)">
                    <rect fill="#747874" height="16" rx="1" width="44" x="0" y="164"></rect>
                    <rect fill="#004225" height="28" rx="1" width="44" x="0" y="136"></rect>
                    <rect fill="#343a35" height="40" rx="1" width="44" x="0" y="96"></rect>
                    <rect fill="#2a6194" height="32" rx="1" width="44" x="0" y="64"></rect>
                  </g>
                  {/* MTTR Trend Line */}
                  <polyline fill="none" points="102,140 252,90 407,60 562,110" stroke="#BA1A1A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></polyline>
                  <circle cx="102" cy="140" r="3.5" fill="#ffffff" stroke="#BA1A1A" strokeWidth="2"></circle>
                  <circle cx="252" cy="90" r="3.5" fill="#ffffff" stroke="#BA1A1A" strokeWidth="2"></circle>
                  <circle cx="407" cy="60" r="3.5" fill="#ffffff" stroke="#BA1A1A" strokeWidth="2"></circle>
                  <circle cx="562" cy="110" r="3.5" fill="#ffffff" stroke="#BA1A1A" strokeWidth="2"></circle>
                </svg>
                <div className="grid grid-cols-4 pl-10 pr-4 pt-1 font-label-mono-sm text-label-mono-sm text-on-surface-variant text-center">
                  <div>00:00 - 06:00</div>
                  <div>06:00 - 12:00</div>
                  <div>12:00 - 18:00 (Peak)</div>
                  <div>18:00 - Current</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-surface-container-high">
              <div className="flex flex-col">
                <span className="font-caption text-caption text-on-surface-variant">Peak Incident Surge</span>
                <span className="font-title-sm text-title-sm text-on-surface font-semibold mt-0.5">14:22 UTC • 48 events</span>
              </div>
              <div className="flex flex-col">
                <span className="font-caption text-caption text-on-surface-variant">Dominant Classification</span>
                <span className="font-title-sm text-title-sm text-on-surface font-semibold mt-0.5">Mobility / Arterial (39%)</span>
              </div>
              <div className="flex flex-col">
                <span className="font-caption text-caption text-on-surface-variant">Automated Resolution</span>
                <span className="font-title-sm text-title-sm text-tertiary-container font-semibold mt-0.5">82 of 142 Cleared</span>
              </div>
            </div>
          </div>

          {/* Visual 2 (Right 5 Cols): Severity Ring & Outcomes */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded shadow-sm flex flex-col justify-between border border-outline-variant/30">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-title-md text-title-md text-on-surface font-semibold">Severity &amp; Triage Outcomes</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-label-mono-sm text-label-mono-sm bg-surface-container-high text-on-surface-variant font-medium">
                  100% Ingest
                </span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                Severity distribution coupled with validation audits
              </p>

              {/* Concentric Meter Ring */}
              <div className="my-4 flex items-center justify-between gap-4">
                <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#edefe8" strokeWidth="12"></circle>
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#2a6194" strokeDasharray="113.1 138.1" strokeDashoffset="-62.8" strokeWidth="12"></circle>
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#343a35" strokeDasharray="55.3 195.9" strokeDashoffset="-175.9" strokeWidth="12"></circle>
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#ba1a1a" strokeDasharray="20.1 231.1" strokeDashoffset="-231.2" strokeWidth="12"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-label-mono text-label-mono text-on-surface font-bold text-lg">142</span>
                    <span className="font-caption text-[10px] text-on-surface-variant uppercase tracking-wider">Signals</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                      <span className="font-medium text-on-surface">Critical Tier</span>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">8% (11)</span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                      <span className="font-medium text-on-surface">High Priority</span>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">22% (31)</span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                      <span className="font-medium text-on-surface">Moderate</span>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">45% (64)</span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-surface-tint"></span>
                      <span className="font-medium text-on-surface">Low Advisory</span>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">25% (36)</span>
                  </div>
                </div>
              </div>

              {/* Review Resolution Outcomes */}
              <div className="space-y-2.5 pt-3 border-t border-surface-container-high">
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                  Review Resolution Outcomes
                </span>
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-caption text-caption">
                    <span className="text-on-surface font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                      Human Confirmed &amp; Dispatched
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">71%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary-container rounded-full" style={{ width: '71%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-caption text-caption">
                    <span className="text-on-surface font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Monitored / Auto-Cleared
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">22%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
