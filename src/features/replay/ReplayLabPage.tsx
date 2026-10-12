import React, { useState, useEffect } from 'react';
import { useSimulationStore } from '../../store/simulationStore';

interface ScenarioDef {
  id: 'SC-04' | 'SC-01' | 'SC-02' | 'SC-03';
  code: string;
  name: string;
  description: string;
  impactTitle: string;
  impactDetail: string;
  defaultDeltaPct: number;
}

const SCENARIOS: ScenarioDef[] = [
  {
    id: 'SC-04',
    code: 'SC-04',
    name: 'Exclude USGS Stream Gauge W-18 Telemetry',
    description: 'Evaluates causal dependence on hydrological water volume elevation sensor.',
    impactTitle: 'Causal Impact Detected: Primary Assessment Shift',
    impactDetail:
      'Removing Stream Gauge W-18 drops incident confidence below dispatch threshold (-27% Δ), pivoting from high-tier drainage response to passive monitoring.',
    defaultDeltaPct: -27,
  },
  {
    id: 'SC-02',
    code: 'SC-02',
    name: 'Delayed SCADA Telemetry (+4m Latency)',
    description: 'Simulates delayed ingestion of critical pump station overload trip packets.',
    impactTitle: 'Causal Impact Detected: Operational Dispatch Lag',
    impactDetail:
      'A 4-minute telemetry lag in pump switchgear trip alerts delayed emergency response by 18 minutes (-18% Δ early confidence), leading to unchecked surface ponding.',
    defaultDeltaPct: -18,
  },
  {
    id: 'SC-03',
    code: 'SC-03',
    name: 'Contradictory Invert Reading (False Negative)',
    description: 'Simulates uncalibrated drain sensor reporting dry basin during cloudburst.',
    impactTitle: 'Causal Impact Detected: Sensor Drift Conflict',
    impactDetail:
      'Conflicting readings between Doppler radar and dry drain sensor degraded classification to Inconclusive (-35% Δ), suppressing automated flood barrier activation.',
    defaultDeltaPct: -35,
  },
  {
    id: 'SC-01',
    code: 'SC-01',
    name: 'Normal Sequential Arrival (Full Concordance)',
    description: 'Reference baseline with all telemetry streams reporting without latency or dropouts.',
    impactTitle: 'Baseline Concordance: Synthetic Stream Matches Production',
    impactDetail:
      'Multi-sensor fusion establishes confirmed causal ground with 0% delta divergence. All independent sensors corroborate physical event onset.',
    defaultDeltaPct: 0,
  },
];

const INCIDENTS_LIST = [
  { id: 'INC-2048', title: 'Possible localized flooding (Sector 4)', zone: 'Sector 4' },
  { id: 'INC-2026-8841', title: 'Waterlogging & Severe Road Inundation - Junction 14', zone: 'Sector 4' },
  { id: 'INC-2026-9012', title: 'Corridor Traffic Speed Anomaly - Western Express', zone: 'Zone H-East' },
];

export const ReplayLabPage: React.FC = () => {
  const {
    frames,
    currentStepIndex,
    setCurrentStepIndex,
    isPlaying,
    togglePlay,
    setPlaying,
    stepForward,
    stepBackward,
    playbackSpeed,
    setPlaybackSpeed,
    resetReplay,
  } = useSimulationStore();

  const [activeScenarioId, setActiveScenarioId] = useState<'SC-04' | 'SC-01' | 'SC-02' | 'SC-03'>('SC-04');
  const [isGaugeExcluded, setIsGaugeExcluded] = useState(true);
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-2048');
  const [showScenarioMenu, setShowScenarioMenu] = useState(false);
  const [showIncidentMenu, setShowIncidentMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];
  const selectedIncident = INCIDENTS_LIST.find((i) => i.id === selectedIncidentId) || INCIDENTS_LIST[0];

  // Playback Timer Loop: advances timeline smoothly based on playbackSpeed
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(350, Math.round(2200 / playbackSpeed));
    const interval = setInterval(() => {
      const state = useSimulationStore.getState();
      if (state.currentStepIndex < state.frames.length - 1) {
        state.stepForward();
      } else {
        state.setPlaying(false);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, stepForward, setPlaying]);

  // Toast Auto-Dismiss
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Current frame data
  const currentFrame = frames[currentStepIndex] || frames[0];

  // Dynamic step-derived values
  // Step 0: T-120m (06:00 UTC)
  // Step 1: T-75m  (06:12 UTC)
  // Step 2: T-50m  (06:18 UTC)
  // Step 3: T-30m  (06:25 UTC)
  // Step 4: T-15m  (06:28 UTC)
  // Step 5: T-0m   (06:38 UTC)
  const stepTimeLabels = ['T-120m (06:00 UTC)', 'T-75m (06:12 UTC)', 'T-50m (06:18 UTC)', 'T-30m (06:25 UTC)', 'T-15m (06:28 UTC)', 'T-0m (Now)'];

  // Baseline data per step
  const baselineSeverityLevels = [
    { label: 'Normal / Low', level: 'Level 1 / 4', color: 'bg-surface-container text-on-surface' },
    { label: 'Moderate Alert', level: 'Level 2 / 4', color: 'bg-secondary-fixed text-on-secondary-fixed' },
    { label: 'Moderate Alert', level: 'Level 2 / 4', color: 'bg-secondary-fixed text-on-secondary-fixed' },
    { label: 'High Alert', level: 'Level 3 / 4', color: 'bg-error-container text-on-error-container' },
    { label: 'High Alert', level: 'Level 3 / 4', color: 'bg-error-container text-on-error-container' },
    { label: 'Critical Alert', level: 'Level 4 / 4', color: 'bg-error-container text-on-error-container' },
  ];

  const baselineStatuses = ['Surveillance', 'Detected', 'Detected', 'Under Review', 'Under Review', 'Confirmed'];
  const baselineConfidences = [0.12, 0.62, 0.76, 0.81, 0.88, 0.94];
  const baselineSummaries = [
    'Ambient telemetry within nominal operational thresholds. No active hydrological ponding detected.',
    'Precipitation cell detected by C-band Doppler radar (72 mm/h). Initial candidate incident instantiated.',
    'IoT ultrasonic stormwater node US-402-A records depth climbing +1.8 cm/min. Spatial-temporal correlation confirmed.',
    'Localized flooding event supported by 3 sensor telemetry streams. Hydrological volume elevation coincides with radar precipitation band in storm catchment area.',
    'Transit probes report corridor collapse with velocity plunge to 4.8 km/h (-88%). Impact zone widened to 420m.',
    'Delayed SCADA telemetry confirms Station 4 sump pump electrical trip. Inflow volume exceeds gravity discharge capacity. Root cause confirmed.',
  ];

  const currentBaselineSeverity = baselineSeverityLevels[currentStepIndex] || baselineSeverityLevels[0];
  const currentBaselineStatus = baselineStatuses[currentStepIndex] || baselineStatuses[0];
  const currentBaselineConf = baselineConfidences[currentStepIndex] || 0.81;
  const currentBaselineSummary = baselineSummaries[currentStepIndex] || baselineSummaries[3];

  // Counterfactual Branch Data Calculation
  let simulatedSeverity = currentBaselineSeverity;
  let simulatedStatus = currentBaselineStatus;
  let simulatedConf = currentBaselineConf;
  let simulatedSummary = currentBaselineSummary;
  let deltaText = '0% Δ';
  let isDiverged = false;

  if (isGaugeExcluded && activeScenarioId === 'SC-04') {
    isDiverged = true;
    deltaText = '-27% Δ';
    if (currentStepIndex === 0) {
      simulatedConf = 0.12;
      simulatedSeverity = { label: 'Normal / Low', level: 'Level 1 / 4', color: 'bg-surface-container text-on-surface' };
      simulatedStatus = 'Surveillance';
    } else if (currentStepIndex === 1) {
      simulatedConf = 0.62;
      simulatedSeverity = { label: 'Moderate Alert', level: 'Level 2 / 4', color: 'bg-secondary-fixed text-on-secondary-fixed' };
      simulatedStatus = 'Detected';
    } else if (currentStepIndex === 2) {
      simulatedConf = 0.68;
      simulatedSeverity = { label: 'Moderate Alert', level: 'Level 2 / 4', color: 'bg-secondary-fixed text-on-secondary-fixed' };
      simulatedStatus = 'Detected';
    } else {
      simulatedConf = Math.max(0.1, Number((currentBaselineConf - 0.27).toFixed(2)));
      simulatedSeverity = { label: 'Moderate Alert', level: 'DOWNGRADED (-1)', color: 'bg-secondary-fixed text-on-secondary-fixed' };
      simulatedStatus = 'Insufficient Flood Evidence';
      simulatedSummary =
        'Disruption detected via traffic slowdown and precipitation, but water elevation surge uncorroborated without Stream Gauge W-18. Cannot establish conduit breach.';
    }
  } else if (activeScenarioId === 'SC-02') {
    isDiverged = true;
    deltaText = '-18% Δ';
    if (currentStepIndex < 5) {
      simulatedConf = Math.max(0.1, Number((currentBaselineConf - 0.18).toFixed(2)));
      simulatedSeverity = currentStepIndex >= 3
        ? { label: 'Moderate Alert', level: 'LAGGING (-1)', color: 'bg-secondary-fixed text-on-secondary-fixed' }
        : currentBaselineSeverity;
      simulatedStatus = 'Delayed Telemetry Ingest';
      simulatedSummary = 'SCADA pump station status uncorroborated due to 4m transmission latency. Operational alert delayed.';
    } else {
      simulatedConf = 0.94;
      simulatedSeverity = currentBaselineSeverity;
      simulatedStatus = 'Late Catch-Up Confirmed';
      simulatedSummary = 'Delayed SCADA packet finally received at T-0m. Retroactive severity escalation applied.';
    }
  } else if (activeScenarioId === 'SC-03') {
    isDiverged = true;
    deltaText = '-35% Δ';
    simulatedConf = Math.max(0.15, Number((currentBaselineConf - 0.35).toFixed(2)));
    simulatedSeverity = { label: 'Warning / Conflicted', level: 'UNVERIFIED', color: 'bg-surface-container-high text-on-surface' };
    simulatedStatus = 'Conflicted Telemetry';
    simulatedSummary = 'Sensor US-402-A reporting 0cm dry basin directly contradicts Doppler radar (72 mm/h). Algorithmic arbitration stalled.';
  } else {
    // SC-01 or Baseline Restored
    isDiverged = false;
    deltaText = '0% Δ';
    simulatedConf = currentBaselineConf;
    simulatedSeverity = currentBaselineSeverity;
    simulatedStatus = currentBaselineStatus;
    simulatedSummary = currentBaselineSummary;
  }

  // Export Delta JSON handler
  const handleExportDeltaJson = () => {
    const deltaPayload = {
      export_metadata: {
        system: 'UrbanIncident Fusion & Causal Intelligence',
        version: 'v4.2.1-prod',
        generated_at: new Date().toISOString(),
        run_hash: '#804-A71F',
        incident_id: selectedIncident.id,
        scenario_id: activeScenario.id,
        scenario_name: activeScenario.name,
      },
      playback_frame: {
        step_index: currentStepIndex,
        step_timestamp: currentFrame.timestamp,
        step_label: currentFrame.label,
        time_offset: stepTimeLabels[currentStepIndex],
      },
      baseline_assessment: {
        severity: currentBaselineSeverity.label,
        severity_level: currentBaselineSeverity.level,
        status: currentBaselineStatus,
        confidence: currentBaselineConf,
        summary: currentBaselineSummary,
        active_sensor_count: 3,
        sensors: [
          { name: 'USGS Stream Gauge W-18', status: 'active', metric: '+0.84m surge' },
          { name: 'Doppler Rain Station D-4', status: 'active', metric: '38 mm/h' },
          { name: 'DOT Camera TF-04', status: 'active', metric: '14 km/h avg' },
        ],
      },
      counterfactual_assessment: {
        is_gauge_excluded: isGaugeExcluded && activeScenarioId === 'SC-04',
        severity: simulatedSeverity.label,
        severity_level: simulatedSeverity.level,
        status: simulatedStatus,
        confidence: simulatedConf,
        confidence_delta: deltaText,
        summary: simulatedSummary,
        diverged_from_baseline: isDiverged,
        sensors: [
          {
            name: 'USGS Stream Gauge W-18',
            status: isGaugeExcluded && activeScenarioId === 'SC-04' ? 'excluded_by_operator' : 'active',
            metric: isGaugeExcluded && activeScenarioId === 'SC-04' ? 'clamped' : '+0.84m surge',
          },
          { name: 'Doppler Rain Station D-4', status: 'active', metric: '38 mm/h' },
          { name: 'DOT Camera TF-04', status: 'active', metric: '14 km/h avg' },
        ],
      },
      causal_intelligence_conclusions: {
        causal_impact_detected: isDiverged,
        primary_shift: activeScenario.impactTitle,
        operational_pivot: isDiverged
          ? 'Emergency Municipal Drainage Dispatch -> Passive Surveillance'
          : 'Standard Nominal Response Protocol Maintained',
      },
    };

    const blob = new Blob([JSON.stringify(deltaPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UIF-Delta-${selectedIncident.id}-${activeScenario.id}-step${currentStepIndex}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage(`Delta JSON exported: UIF-Delta-${selectedIncident.id}-${activeScenario.id}.json`);
  };

  return (
    <div className="w-full flex flex-col select-none relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-on-surface text-surface px-4 py-2.5 rounded shadow-lg flex items-center gap-2 font-body-sm text-body-sm transition-all animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

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
              onClick={handleExportDeltaJson}
              className="h-9 px-space-md rounded bg-surface hover:bg-surface-container text-on-surface font-title-sm text-title-sm border border-outline-variant/40 shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download counterfactual audit difference JSON"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export Delta JSON</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsGaugeExcluded(!isGaugeExcluded);
                setToastMessage(
                  !isGaugeExcluded
                    ? 'Counterfactual Activated: Stream Gauge W-18 excluded.'
                    : 'Baseline Restored: Stream Gauge W-18 re-synchronized.'
                );
              }}
              className="h-9 px-space-md rounded bg-primary text-on-primary font-title-sm text-title-sm shadow-sm hover:bg-primary-container transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isGaugeExcluded ? 'restore' : 'science'}
              </span>
              <span>{isGaugeExcluded ? 'Restore Baseline Stream' : 'Run Counterfactual'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Scenario Parameter Rail with interactive selectors */}
      <div className="w-full bg-surface-container-lowest border-b border-outline-variant/40 px-margin-desktop py-space-sm shadow-sm relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-wrap items-center gap-space-md">
            {/* Active Incident Selector */}
            <div className="relative">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface-variant">Active Incident:</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowIncidentMenu(!showIncidentMenu);
                    setShowScenarioMenu(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm border border-outline-variant/30 transition-colors cursor-pointer"
                >
                  <span className="font-label-mono text-label-mono font-semibold">{selectedIncident.id}</span>
                  <span className="text-on-surface-variant">•</span>
                  <span className="truncate max-w-[260px]">{selectedIncident.title}</span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
                </button>
              </div>

              {/* Incident Dropdown */}
              {showIncidentMenu && (
                <div className="absolute left-24 top-full mt-1 w-80 bg-surface-container-lowest rounded-md shadow-lg border border-outline-variant/40 p-1.5 z-40">
                  <div className="px-2 py-1 font-label-mono-sm text-label-mono-sm uppercase text-on-surface-variant">
                    Select Incident for Replay
                  </div>
                  {INCIDENTS_LIST.map((inc) => (
                    <button
                      key={inc.id}
                      onClick={() => {
                        setSelectedIncidentId(inc.id);
                        setShowIncidentMenu(false);
                        resetReplay();
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between font-body-sm text-body-sm hover:bg-surface-container transition-colors ${
                        selectedIncidentId === inc.id ? 'bg-surface-container text-primary font-medium' : 'text-on-surface'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-label-mono font-semibold mr-1.5">{inc.id}</span>
                        <span>{inc.title}</span>
                      </div>
                      {selectedIncidentId === inc.id && (
                        <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Scenario Selector */}
            <div className="relative">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface-variant">Scenario Config:</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowScenarioMenu(!showScenarioMenu);
                    setShowIncidentMenu(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm border border-outline-variant/30 transition-colors cursor-pointer"
                >
                  <span className="font-label-mono text-label-mono font-semibold text-secondary">{activeScenario.code}</span>
                  <span className="text-on-surface-variant">•</span>
                  <span className="truncate max-w-[320px]">{activeScenario.name}</span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">tune</span>
                </button>
              </div>

              {/* Scenario Dropdown */}
              {showScenarioMenu && (
                <div className="absolute left-28 top-full mt-1 w-96 bg-surface-container-lowest rounded-md shadow-lg border border-outline-variant/40 p-2 z-40">
                  <div className="px-2 py-1 font-label-mono-sm text-label-mono-sm uppercase text-on-surface-variant">
                    Select Counterfactual Perturbation
                  </div>
                  {SCENARIOS.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        setActiveScenarioId(sc.id);
                        setShowScenarioMenu(false);
                        setIsGaugeExcluded(sc.id === 'SC-04');
                        setToastMessage(`Switched scenario to ${sc.code}: ${sc.name}`);
                      }}
                      className={`w-full text-left p-2 rounded mb-1 flex flex-col gap-0.5 hover:bg-surface-container transition-colors ${
                        activeScenarioId === sc.id ? 'bg-surface-container border border-secondary/30' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-label-mono text-label-mono font-bold text-secondary">{sc.code}</span>
                        {activeScenarioId === sc.id && (
                          <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                        )}
                      </div>
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold">{sc.name}</span>
                      <span className="font-body-xs text-body-xs text-on-surface-variant">{sc.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-space-md font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-primary animate-pulse' : 'bg-tertiary-fixed-dim'}`}></span>
              <span className="text-on-surface">{isPlaying ? 'Simulating Live Stream' : 'Execution Completed'}</span>
            </div>
            <span>
              Step: <strong className="text-on-surface font-semibold">{currentStepIndex + 1} / {frames.length}</strong>
            </span>
            <span>
              Run time: <strong className="text-on-surface font-semibold">1.4s</strong>
            </span>
            <span>
              Engine: <strong className="text-on-surface">v4.2.1-prod</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace Content */}
      <main className="w-full max-w-7xl mx-auto px-margin-desktop py-space-lg flex flex-col gap-space-lg">
        {/* Playback Scrubber Control Bar */}
        <div className="p-space-md bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-space-md">
          {/* Playback Navigation Buttons */}
          <div className="flex items-center gap-space-sm">
            <button
              onClick={stepBackward}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Step backward"
            >
              <span className="material-symbols-outlined text-[18px]">skip_previous</span>
            </button>
            <button
              onClick={togglePlay}
              className={`px-3 py-1.5 rounded font-caption text-caption font-semibold flex items-center gap-1 transition-colors shadow-xs cursor-pointer ${
                isPlaying ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary hover:bg-primary-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
            </button>
            <button
              onClick={stepForward}
              disabled={currentStepIndex >= frames.length - 1}
              className="p-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Step forward"
            >
              <span className="material-symbols-outlined text-[18px]">skip_next</span>
            </button>
            <button
              onClick={resetReplay}
              className="p-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
              title="Reset Timeline to T-120m"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
            </button>
          </div>

          {/* Interactive Range Slider */}
          <div className="flex-1 w-full max-w-md mx-4 flex flex-col gap-1">
            <div className="flex items-center justify-between text-label-mono-sm font-label-mono-sm text-on-surface-variant">
              <span>T-120m (06:00)</span>
              <span className="text-on-surface font-bold text-primary">
                {stepTimeLabels[currentStepIndex]}
              </span>
              <span>T-0m (Now)</span>
            </div>
            <input
              type="range"
              min="0"
              max={frames.length - 1}
              value={currentStepIndex}
              onChange={(e) => setCurrentStepIndex(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer h-2 bg-surface-container rounded-lg"
            />
            <div className="flex items-center justify-between text-body-xs font-body-xs text-on-surface-variant truncate">
              <span className="truncate">Event: {currentFrame.label}</span>
            </div>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2">
            <span className="font-caption text-caption text-on-surface-variant">Speed:</span>
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm cursor-pointer transition-colors ${
                  playbackSpeed === s ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Causal Delta Notice Banner */}
        <div className={`p-space-md rounded flex flex-col md:flex-row md:items-center justify-between gap-space-sm shadow-sm border transition-all ${
          !isDiverged
            ? 'bg-surface-container border-outline-variant/30'
            : 'bg-surface-container-high border-outline-variant/40'
        }`}>
          <div className="flex items-start md:items-center gap-space-sm">
            <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
              !isDiverged ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container-highest text-on-surface'
            }`}>
              <span className="material-symbols-outlined text-[20px]">
                {!isDiverged ? 'sync' : 'compare_arrows'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                {!isDiverged
                  ? 'Baseline Synchronized: Both telemetry streams operating in full concordance'
                  : activeScenario.impactTitle}
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {!isDiverged ? (
                  <span>
                    Stream Gauge W-18 is restored and active. The synthetic branch mirrors baseline production assessment with <strong className="text-tertiary-fixed-dim">0% Δ divergence</strong>.
                  </span>
                ) : activeScenarioId === 'SC-04' ? (
                  <span>
                    Removing <code className="font-label-mono-sm text-label-mono-sm bg-surface px-1 py-0.5 rounded text-on-surface">Stream Gauge W-18</code> drops incident confidence below dispatch threshold (<span className="font-label-mono text-label-mono font-semibold text-error">-27% Δ</span>), pivoting from high-tier drainage response to passive monitoring.
                  </span>
                ) : (
                  <span>{activeScenario.impactDetail}</span>
                )}
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
                  <span className="font-caption text-caption uppercase text-on-surface-variant font-semibold tracking-wider">
                    Baseline Stream
                  </span>
                  <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                    Production Assessment ({selectedIncident.id} v{currentStepIndex + 1})
                  </h2>
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
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-label-mono text-label-mono font-semibold ${currentBaselineSeverity.color}`}>
                      <span className="w-2 h-2 rounded-full bg-error"></span> {currentBaselineSeverity.label}
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">{currentBaselineSeverity.level}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-caption text-caption text-on-surface-variant uppercase">Workflow Status</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container text-on-surface font-title-sm text-title-sm font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">hourglass_top</span>
                      {currentBaselineStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Baseline Assessment Box */}
              <div className="flex flex-col gap-space-xs p-space-md bg-surface-container-low rounded border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="font-caption text-caption font-semibold text-on-surface uppercase tracking-wider">
                    Algorithmic Assessment Summary
                  </span>
                  <span className="font-label-mono text-label-mono font-bold text-on-surface">
                    CONF: {currentBaselineConf.toFixed(2)}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                  {currentBaselineSummary}
                </p>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.round(currentBaselineConf * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Baseline Evidence Pipeline */}
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
                    <span className="font-label-mono text-label-mono font-semibold text-error">
                      {currentStepIndex >= 2 ? '+0.84m surge' : 'Baseline flow'}
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
                    <span className="font-label-mono text-label-mono font-semibold text-on-surface">
                      {currentStepIndex >= 1 ? '38 mm/h' : '0.0 mm/h'}
                    </span>
                  </div>
                  <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[18px] text-secondary">videocam</span>
                      <div>
                        <div className="font-title-sm text-title-sm text-on-surface font-medium">DOT Camera TF-04</div>
                        <div className="font-caption text-caption text-on-surface-variant">Avenue intersection speed feed</div>
                      </div>
                    </div>
                    <span className="font-label-mono text-label-mono font-semibold text-on-surface">
                      {currentStepIndex >= 3 ? '14 km/h avg' : '48 km/h avg'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Counterfactual Replay Assessment */}
          <div className="bg-surface-container-lowest rounded shadow-sm flex flex-col overflow-hidden border border-outline-variant/30">
            <div className="px-space-lg py-space-md bg-surface-container-high flex items-center justify-between border-b border-outline-variant/30">
              <div className="flex items-center gap-space-sm">
                <span className={`w-2.5 h-2.5 rounded ${!isDiverged ? 'bg-primary' : 'bg-secondary'}`}></span>
                <div>
                  <span className={`font-caption text-caption uppercase font-semibold tracking-wider ${
                    !isDiverged ? 'text-primary' : 'text-secondary'
                  }`}>
                    Simulated Branch
                  </span>
                  <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                    Counterfactual Replay ({activeScenario.code})
                  </h2>
                </div>
              </div>
              <span className={`font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded shadow-sm font-semibold ${
                !isDiverged
                  ? 'text-tertiary-fixed-dim bg-surface'
                  : 'text-secondary bg-surface'
              }`}>
                {!isDiverged ? 'BASELINE RESTORED' : 'SYNTHETIC RUN #R-804'}
              </span>
            </div>

            <div className="p-space-lg flex flex-col gap-space-lg flex-1">
              <div className="grid grid-cols-2 gap-space-md pb-space-md border-b border-outline-variant/30">
                <div className="flex flex-col gap-1">
                  <span className="font-caption text-caption text-on-surface-variant uppercase">Simulated Severity</span>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-label-mono text-label-mono font-semibold ${simulatedSeverity.color}`}>
                      <span className={`w-2 h-2 rounded-full ${!isDiverged ? 'bg-error' : 'bg-secondary'}`}></span> {simulatedSeverity.label}
                    </span>
                    <span className={`font-label-mono-sm text-label-mono-sm font-semibold ${
                      !isDiverged ? 'text-on-surface-variant' : 'text-secondary'
                    }`}>
                      {simulatedSeverity.level}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-caption text-caption text-on-surface-variant uppercase">Simulated Status</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container text-on-surface font-title-sm text-title-sm font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-outline">
                        {!isDiverged ? 'verified' : 'tune'}
                      </span>
                      {simulatedStatus}
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
                  <span className={`font-label-mono text-label-mono font-bold ${
                    !isDiverged ? 'text-on-surface' : 'text-secondary'
                  }`}>
                    CONF: {simulatedConf.toFixed(2)} {!isDiverged ? '(0% Δ)' : `(${deltaText})`}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                  {simulatedSummary}
                </p>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      !isDiverged ? 'bg-primary' : 'bg-secondary'
                    }`}
                    style={{ width: `${Math.round(simulatedConf * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Counterfactual Evidence Pipeline */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-caption text-caption uppercase text-on-surface-variant font-semibold">
                    Evidence Ingestion Pipeline ({isGaugeExcluded && activeScenarioId === 'SC-04' ? '2 Active / 1 Excluded' : '3 / 3 Active'})
                  </span>
                  <span className={`font-label-mono-sm text-label-mono-sm font-medium ${
                    isGaugeExcluded && activeScenarioId === 'SC-04' ? 'text-error' : 'text-tertiary-fixed-dim'
                  }`}>
                    {isGaugeExcluded && activeScenarioId === 'SC-04' ? '1 Telemetry Stream Clamped' : 'Full Telemetry Concordance'}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className={`p-space-sm rounded flex items-center justify-between ${
                    isGaugeExcluded && activeScenarioId === 'SC-04' ? 'bg-surface-container-highest' : 'bg-surface-container-low'
                  }`}>
                    <div className="flex items-center gap-space-sm">
                      <span className={`material-symbols-outlined text-[18px] ${
                        isGaugeExcluded && activeScenarioId === 'SC-04' ? 'text-outline' : 'text-secondary'
                      }`}>
                        {isGaugeExcluded && activeScenarioId === 'SC-04' ? 'do_not_disturb_on' : 'waves'}
                      </span>
                      <div>
                        <div className={`font-title-sm text-title-sm ${
                          isGaugeExcluded && activeScenarioId === 'SC-04'
                            ? 'text-on-surface-variant line-through'
                            : 'text-on-surface font-medium'
                        }`}>
                          USGS Stream Gauge W-18
                        </div>
                        <div className="font-caption text-caption text-outline">Culvert junction sensor #912</div>
                      </div>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">
                      {isGaugeExcluded && activeScenarioId === 'SC-04' ? 'EXCLUDED BY OPERATOR' : 'ACTIVE IN STREAM'}
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
                    <span className="font-label-mono text-label-mono font-semibold text-on-surface">
                      {currentStepIndex >= 1 ? '38 mm/h' : '0.0 mm/h'}
                    </span>
                  </div>
                  <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[18px] text-secondary">videocam</span>
                      <div>
                        <div className="font-title-sm text-title-sm text-on-surface font-medium">DOT Camera TF-04</div>
                        <div className="font-caption text-caption text-on-surface-variant">Avenue intersection speed feed</div>
                      </div>
                    </div>
                    <span className="font-label-mono text-label-mono font-semibold text-on-surface">
                      {currentStepIndex >= 3 ? '14 km/h avg' : '48 km/h avg'}
                    </span>
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
