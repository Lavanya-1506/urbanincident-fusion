import React, { useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore';

export const ReplayLabPage: React.FC = () => {
  const {
    currentStepIndex,
    setCurrentStepIndex,
    isPlaying,
    togglePlay,
    stepForward,
    stepBackward,
    playbackSpeed,
    setPlaybackSpeed,
    resetReplay,
  } = useSimulationStore();

  const [activeScenario, setActiveScenario] = useState<'SC-04' | 'SC-01' | 'SC-02' | 'SC-03'>('SC-04');
  const [isGaugeExcluded, setIsGaugeExcluded] = useState(true);

  return (
    <div className="w-full flex flex-col select-none">
      {/* Top Header Strip (Stitch exact layout) */}
      <section className="w-full bg-surface-container-lowest border-b border-outline-variant px-margin-desktop py-space-md shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-mono text-label-mono font-bold text-on-surface bg-surface-container px-2 py-0.5 rounded">
                LAB-04
              </span>
              <h1 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                Replay Lab &amp; Counterfactual Workspace
              </h1>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Evaluate causal impacts by simulating delayed, missing, or contradictory telemetry streams
            </p>
          </div>

          <div className="flex items-center gap-space-sm">
            <button
              type="button"
              onClick={() => alert('Delta JSON exported.')}
              className="h-9 px-space-md rounded bg-surface hover:bg-surface-container text-on-surface font-title-sm text-title-sm border border-outline-variant/40 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export Delta JSON</span>
            </button>
            <button
              type="button"
              onClick={() => setIsGaugeExcluded(!isGaugeExcluded)}
              className="h-9 px-space-md rounded bg-primary-container text-on-primary font-title-sm text-title-sm shadow-sm hover:bg-primary transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">play_circle</span>
              <span>{isGaugeExcluded ? 'Restore Baseline Stream' : 'Run Counterfactual'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Scenario Parameter Rail */}
      <div className="w-full bg-surface-container-lowest border-b border-outline-variant/40 px-margin-desktop py-space-sm shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-wrap items-center gap-space-md">
            {/* Active Incident */}
            <div className="flex items-center gap-space-xs">
              <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface-variant">Active Incident:</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm">
                <span className="font-label-mono text-label-mono font-semibold">INC-2048</span>
                <span className="text-on-surface-variant">•</span>
                <span className="truncate max-w-[260px]">Possible localized flooding (Sector 4)</span>
              </div>
            </div>

            {/* Scenario Selector */}
            <div className="flex items-center gap-space-xs">
              <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface-variant">Scenario Config:</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm">
                <span className="font-label-mono text-label-mono font-semibold text-secondary">{activeScenario}</span>
                <span className="text-on-surface-variant">•</span>
                <span className="truncate max-w-[320px]">
                  {activeScenario === 'SC-04' ? 'Exclude USGS Stream Gauge W-18 Telemetry' : 'Normal Sequential Arrival'}
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">tune</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-md font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
              <span className="text-on-surface">Execution Completed</span>
            </div>
            <span>Run time: <strong className="text-on-surface font-semibold">1.4s</strong></span>
            <span>Engine: <strong className="text-on-surface">v4.2.1-prod</strong></span>
          </div>
        </div>
      </div>

      {/* Main Workspace Content */}
      <main className="w-full max-w-7xl mx-auto px-margin-desktop py-space-lg flex flex-col gap-space-lg">
        {/* Playback Scrubber Control Bar */}
        <div className="p-space-md bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm">
            <button
              onClick={stepBackward}
              className="p-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
              title="Step backward"
            >
              <span className="material-symbols-outlined text-[18px]">skip_previous</span>
            </button>
            <button
              onClick={togglePlay}
              className="px-3 py-1.5 rounded bg-primary text-on-primary font-caption text-caption font-semibold flex items-center gap-1 hover:bg-primary-container transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
            </button>
            <button
              onClick={stepForward}
              className="p-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
              title="Step forward"
            >
              <span className="material-symbols-outlined text-[18px]">skip_next</span>
            </button>
            <button
              onClick={resetReplay}
              className="p-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
              title="Reset"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
            </button>
          </div>

          <div className="flex-1 w-full max-w-md mx-4 flex items-center gap-3">
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">T-120m</span>
            <input
              type="range"
              min="0"
              max="5"
              value={currentStepIndex}
              onChange={e => setCurrentStepIndex(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">T-0m (Now)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-caption text-caption text-on-surface-variant">Speed:</span>
            {[1, 2, 4].map(s => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm ${
                  playbackSpeed === s ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container text-on-surface'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Causal Delta Notice Banner */}
        <div className="p-space-md rounded bg-surface-container-high flex flex-col md:flex-row md:items-center justify-between gap-space-sm shadow-sm border border-outline-variant/30">
          <div className="flex items-start md:items-center gap-space-sm">
            <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px] text-on-surface">compare_arrows</span>
            </div>
            <div className="flex flex-col">
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                Causal Impact Detected: Primary Assessment Shift
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Removing <code className="font-label-mono-sm text-label-mono-sm bg-surface px-1 py-0.5 rounded text-on-surface">Stream Gauge W-18</code> drops incident confidence below dispatch threshold (<span className="font-label-mono text-label-mono font-semibold text-error">-27% Δ</span>), pivoting from high-tier drainage response to passive monitoring.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="font-label-mono-sm text-label-mono-sm px-2 py-1 rounded bg-surface text-on-surface shadow-sm">
              RUN HASH: #804-A71F
            </span>
          </div>
        </div>

        {/* Dual Workspace Split-Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-stretch">
          {/* LEFT PANEL: Production Baseline Assessment */}
          <div className="bg-surface-container-lowest rounded shadow-sm flex flex-col overflow-hidden border border-outline-variant/30">
            <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between border-b border-outline-variant/30">
              <div className="flex items-center gap-space-sm">
                <span className="w-2.5 h-2.5 rounded bg-primary"></span>
                <div>
                  <span className="font-caption text-caption uppercase text-on-surface-variant font-semibold tracking-wider">Baseline Stream</span>
                  <h2 className="font-title-md text-title-md text-on-surface font-semibold">Production Assessment (INC-2048 v3)</h2>
                </div>
              </div>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant px-2 py-0.5 rounded bg-surface-container">
                LOCKED STATE
              </span>
            </div>

            <div className="p-space-lg flex flex-col gap-space-lg flex-1">
              <div className="grid grid-cols-2 gap-space-md pb-space-md border-b border-outline-variant/30">
                <div className="flex flex-col gap-1">
                  <span className="font-caption text-caption text-on-surface-variant uppercase">Baseline Severity</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-error-container text-on-error-container font-label-mono text-label-mono font-semibold">
                      <span className="w-2 h-2 rounded-full bg-error"></span> High Alert
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">Level 3 / 4</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-caption text-caption text-on-surface-variant uppercase">Workflow Status</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container text-on-surface font-title-sm text-title-sm font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">hourglass_top</span>
                      Under Review
                    </span>
                  </div>
                </div>
              </div>

              {/* Assessment Box */}
              <div className="flex flex-col gap-space-xs p-space-md bg-surface-container-low rounded border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="font-caption text-caption font-semibold text-on-surface uppercase tracking-wider">
                    Algorithmic Assessment Summary
                  </span>
                  <span className="font-label-mono text-label-mono font-bold text-on-surface">CONF: 0.81</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                  Localized flooding event supported by 3 sensor telemetry streams. Hydrological volume elevation coincides with radar precipitation band in storm catchment area.
                </p>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-primary h-full rounded-full" style={{ width: '81%' }}></div>
                </div>
              </div>

              {/* Evidence Pipeline */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-caption text-caption uppercase text-on-surface-variant font-semibold">
                    Evidence Ingestion Pipeline (3 / 3 Active)
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">All inputs weighted</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[18px] text-secondary">waves</span>
                      <div>
                        <div className="font-title-sm text-title-sm text-on-surface font-medium">USGS Stream Gauge W-18</div>
                        <div className="font-caption text-caption text-on-surface-variant">Culvert junction sensor #912</div>
                      </div>
                    </div>
                    <span className="font-label-mono text-label-mono font-semibold text-error">+0.84m surge</span>
                  </div>
                  <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[18px] text-secondary">rainy</span>
                      <div>
                        <div className="font-title-sm text-title-sm text-on-surface font-medium">Doppler Rain Station D-4</div>
                        <div className="font-caption text-caption text-on-surface-variant">Precipitation radar telemetry</div>
                      </div>
                    </div>
                    <span className="font-label-mono text-label-mono font-semibold text-on-surface">38 mm/h</span>
                  </div>
                  <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[18px] text-secondary">videocam</span>
                      <div>
                        <div className="font-title-sm text-title-sm text-on-surface font-medium">DOT Camera TF-04</div>
                        <div className="font-caption text-caption text-on-surface-variant">Avenue intersection speed feed</div>
                      </div>
                    </div>
                    <span className="font-label-mono text-label-mono font-semibold text-on-surface">14 km/h avg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Counterfactual Replay Assessment */}
          <div className="bg-surface-container-lowest rounded shadow-sm flex flex-col overflow-hidden border border-outline-variant/30">
            <div className="px-space-lg py-space-md bg-surface-container-high flex items-center justify-between border-b border-outline-variant/30">
              <div className="flex items-center gap-space-sm">
                <span className="w-2.5 h-2.5 rounded bg-secondary"></span>
                <div>
                  <span className="font-caption text-caption uppercase text-secondary font-semibold tracking-wider">Simulated Branch</span>
                  <h2 className="font-title-md text-title-md text-on-surface font-semibold">Counterfactual Replay (Scenario SC-04)</h2>
                </div>
              </div>
              <span className="font-label-mono-sm text-label-mono-sm text-secondary bg-surface px-2 py-0.5 rounded shadow-sm font-semibold">
                SYNTHETIC RUN #R-804
              </span>
            </div>

            <div className="p-space-lg flex flex-col gap-space-lg flex-1">
              <div className="grid grid-cols-2 gap-space-md pb-space-md border-b border-outline-variant/30">
                <div className="flex flex-col gap-1">
                  <span className="font-caption text-caption text-on-surface-variant uppercase">Simulated Severity</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-mono text-label-mono font-semibold">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span> Moderate Alert
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">DOWNGRADED (-1)</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-caption text-caption text-on-surface-variant uppercase">Simulated Status</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container text-on-surface font-title-sm text-title-sm font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-outline">verified</span>
                      Insufficient Flood Evidence
                    </span>
                  </div>
                </div>
              </div>

              {/* Counterfactual Assessment Box */}
              <div className="flex flex-col gap-space-xs p-space-md bg-surface-container-low rounded border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="font-caption text-caption font-semibold text-on-surface uppercase tracking-wider">
                    Replay Assessment Summary
                  </span>
                  <span className="font-label-mono text-label-mono font-bold text-secondary">CONF: 0.54 (-0.27)</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                  Disruption detected via traffic slowdown and precipitation, but water elevation surge uncorroborated without Stream Gauge W-18. Cannot establish conduit breach.
                </p>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '54%' }}></div>
                </div>
              </div>

              {/* Counterfactual Evidence Pipeline */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-caption text-caption uppercase text-on-surface-variant font-semibold">
                    Evidence Ingestion Pipeline (2 Active / 1 Excluded)
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-error font-medium">1 Telemetry Stream Clamped</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="p-space-sm rounded bg-surface-container-highest flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[18px] text-outline">do_not_disturb_on</span>
                      <div>
                        <div className="font-title-sm text-title-sm text-on-surface-variant line-through">USGS Stream Gauge W-18</div>
                        <div className="font-caption text-caption text-outline">Culvert junction sensor #912</div>
                      </div>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">
                      EXCLUDED BY OPERATOR
                    </span>
                  </div>
                  <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[18px] text-secondary">rainy</span>
                      <div>
                        <div className="font-title-sm text-title-sm text-on-surface font-medium">Doppler Rain Station D-4</div>
                        <div className="font-caption text-caption text-on-surface-variant">Precipitation radar telemetry</div>
                      </div>
                    </div>
                    <span className="font-label-mono text-label-mono font-semibold text-on-surface">38 mm/h</span>
                  </div>
                  <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[18px] text-secondary">videocam</span>
                      <div>
                        <div className="font-title-sm text-title-sm text-on-surface font-medium">DOT Camera TF-04</div>
                        <div className="font-caption text-caption text-on-surface-variant">Avenue intersection speed feed</div>
                      </div>
                    </div>
                    <span className="font-label-mono text-label-mono font-semibold text-on-surface">14 km/h avg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
