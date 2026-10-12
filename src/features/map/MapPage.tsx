import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RealisticGeoMap } from './RealisticGeoMap';
import { useIncidentStore } from '../../store/incidentStore';
import { useComplaintStore } from '../../store/complaintStore';

interface MapIncidentItem {
  id: string;
  severity: 'high' | 'moderate' | 'unassessed' | 'low';
  type: string;
  title: string;
  location: string;
  status: string;
  updatedAgo: string;
  levelVal?: string;
  rainVal?: string;
  trafficVal?: string;
  signalsCount: number;
  supportingCount: number;
  contradictoryCount: number;
  missingCount: number;
  confidence: number;
  synthesis: string;
  missingReason: string;
  telemetryTag?: string;
}

const MAP_INCIDENTS: Record<string, MapIncidentItem> = {
  'INC-2048': {
    id: 'INC-2048',
    severity: 'high',
    type: 'Flooding',
    title: 'Possible localized flooding',
    location: 'Lower Riverside & 4th Avenue • Sector 4 Central',
    status: 'Under Review',
    updatedAgo: '4m ago',
    levelVal: '+0.84m',
    rainVal: '38 mm / hr',
    trafficVal: '-64% speed',
    signalsCount: 4,
    supportingCount: 3,
    contradictoryCount: 0,
    missingCount: 1,
    confidence: 78,
    synthesis: 'Multiple observations indicate a possible localized flooding event. Rising stormwater level readings and reduced traffic speeds are temporally aligned. Direct confirmation of road inundation is still missing.',
    missingReason: 'Direct road inundation confirmation (CCTV cam #402 offline, awaiting drone pass or field verification).',
    telemetryTag: 'Critical Rise',
  },
  'INC-2051': {
    id: 'INC-2051',
    severity: 'moderate',
    type: 'Traffic',
    title: 'Expressway corridor slowdown',
    location: 'Crosstown Expressway & East Spine',
    status: 'Monitoring',
    updatedAgo: '12m ago',
    levelVal: '+0.12m',
    rainVal: '24 mm / hr',
    trafficVal: '-42% speed',
    signalsCount: 3,
    supportingCount: 2,
    contradictoryCount: 0,
    missingCount: 1,
    confidence: 65,
    synthesis: 'Radar precipitation band coincided with expressway velocity drop. Traffic sensors report localized queuing.',
    missingReason: 'Upstream highway sensor telemetry delayed by 180s.',
    telemetryTag: 'Moderate Alert',
  },
  'INC-2054': {
    id: 'INC-2054',
    severity: 'unassessed',
    type: 'Sensors',
    title: 'Telemetry deviation detected',
    location: 'Water Sub-station 9 (Telemetry)',
    status: 'Unassessed',
    updatedAgo: '18m ago',
    levelVal: '+0.45m',
    rainVal: '12 mm / hr',
    signalsCount: 2,
    supportingCount: 1,
    contradictoryCount: 1,
    missingCount: 0,
    confidence: 42,
    synthesis: 'Single sensor discrepancy between hydraulic pressure and downstream weir transducer.',
    missingReason: 'Physical calibration verification required for sub-station sensor #9.',
    telemetryTag: 'Telemetry Dev',
  },
  'INC-2057': {
    id: 'INC-2057',
    severity: 'low',
    type: 'Flooding',
    title: 'Civic Plaza drain clogged',
    location: 'Civic Plaza East Conduit',
    status: 'Active',
    updatedAgo: '24m ago',
    levelVal: '+0.22m',
    rainVal: '18 mm / hr',
    signalsCount: 2,
    supportingCount: 2,
    contradictoryCount: 0,
    missingCount: 0,
    confidence: 89,
    synthesis: 'Trash barrier blockage reported by DPW field sensors. Surface ponding confined to sidewalk curb.',
    missingReason: 'No critical verification gaps. Municipal crew dispatched.',
    telemetryTag: 'Low Drain',
  },
};

const INCIDENT_KEYS = ['INC-2048', 'INC-2051', 'INC-2054', 'INC-2057'];

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedIncidentId, setSelectedIncidentId } = useIncidentStore();
  const { setIsRaiseComplaintOpen, setSelectedAreaPreset } = useComplaintStore();

  const [activeSevFilter, setActiveSevFilter] = useState<'All' | 'High/Crit' | 'Mod' | 'Low'>('All');
  const [activeTypeFilter, setActiveTypeFilter] = useState<'All' | 'Flooding' | 'Traffic' | 'Sensors'>('All');
  const [selectedIncidentKey, setSelectedIncidentKey] = useState<string>('INC-2048');
  const [isQueueExpanded, setIsQueueExpanded] = useState<boolean>(false);
  const [operatorActionState, setOperatorActionState] = useState<string | null>(null);

  const activeIncident = MAP_INCIDENTS[selectedIncidentKey] || MAP_INCIDENTS['INC-2048'];

  // Handle J/K keyboard shortcut to cycle through incidents
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'j' || e.key === 'J') {
        const currIdx = INCIDENT_KEYS.indexOf(selectedIncidentKey);
        const nextIdx = (currIdx + 1) % INCIDENT_KEYS.length;
        setSelectedIncidentKey(INCIDENT_KEYS[nextIdx]);
        setSelectedIncidentId(INCIDENT_KEYS[nextIdx]);
      } else if (e.key === 'k' || e.key === 'K') {
        const currIdx = INCIDENT_KEYS.indexOf(selectedIncidentKey);
        const prevIdx = (currIdx - 1 + INCIDENT_KEYS.length) % INCIDENT_KEYS.length;
        setSelectedIncidentKey(INCIDENT_KEYS[prevIdx]);
        setSelectedIncidentId(INCIDENT_KEYS[prevIdx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIncidentKey, setSelectedIncidentId]);

  const selectIncident = (id: string) => {
    setSelectedIncidentKey(id);
    setSelectedIncidentId(id);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-3.5rem)] overflow-hidden select-none">
      {/* Top Operational Control Bar (Stitch exact layout) */}
      <div className="w-full bg-surface-container-lowest px-space-lg py-2.5 flex flex-wrap items-center justify-between gap-space-md shadow-sm z-30 border-b border-outline-variant/40">
        {/* Left: Search coordinates input */}
        <div className="flex items-center gap-space-md flex-1 min-w-[320px] max-w-xl">
          <div className="relative w-full flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[18px] text-on-surface-variant pointer-events-none">
              my_location
            </span>
            <input
              readOnly
              className="w-full h-9 pl-9 pr-24 rounded bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest transition-all"
              placeholder="Search coordinates, district, or incident..."
              type="text"
              defaultValue="Sector 4 • Lower Riverside (42.3601° N, 71.0589° W)"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-label-mono-sm text-label-mono-sm bg-surface-container-highest text-on-surface-variant font-medium">
                GEO:WGS84
              </span>
            </div>
          </div>
        </div>

        {/* Center: Segmented Operational Filter Pills */}
        <div className="hidden xl:flex items-center gap-space-sm">
          {/* Severity Filter Group */}
          <div className="flex items-center bg-surface-container-low p-0.5 rounded">
            <span className="px-2 py-1 font-caption text-caption text-on-surface-variant uppercase text-[10px] font-semibold tracking-wider">
              Sev
            </span>
            <button
              onClick={() => setActiveSevFilter('All')}
              className={`px-2.5 py-1 rounded font-caption text-caption transition-colors ${
                activeSevFilter === 'All'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-highest font-medium'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveSevFilter('High/Crit')}
              className={`px-2.5 py-1 rounded font-caption text-caption flex items-center gap-1 transition-colors ${
                activeSevFilter === 'High/Crit'
                  ? 'bg-surface-container-lowest text-error shadow-sm font-semibold'
                  : 'text-error hover:bg-surface-container-highest font-medium'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
              High/Crit
            </button>
            <button
              onClick={() => setActiveSevFilter('Mod')}
              className={`px-2.5 py-1 rounded font-caption text-caption transition-colors ${
                activeSevFilter === 'Mod'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-highest font-medium'
              }`}
            >
              Mod
            </button>
            <button
              onClick={() => setActiveSevFilter('Low')}
              className={`px-2.5 py-1 rounded font-caption text-caption transition-colors ${
                activeSevFilter === 'Low'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-highest font-medium'
              }`}
            >
              Low
            </button>
          </div>

          {/* Type Pills */}
          <div className="flex items-center bg-surface-container-low p-0.5 rounded">
            <span className="px-2 py-1 font-caption text-caption text-on-surface-variant uppercase text-[10px] font-semibold tracking-wider">
              Type
            </span>
            <button
              onClick={() => setActiveTypeFilter('All')}
              className={`px-2.5 py-1 rounded font-caption text-caption transition-colors ${
                activeTypeFilter === 'All'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              All (9)
            </button>
            <button
              onClick={() => setActiveTypeFilter('Flooding')}
              className={`px-2.5 py-1 rounded font-caption text-caption transition-colors ${
                activeTypeFilter === 'Flooding'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              Flooding (4)
            </button>
            <button
              onClick={() => setActiveTypeFilter('Traffic')}
              className={`px-2.5 py-1 rounded font-caption text-caption transition-colors ${
                activeTypeFilter === 'Traffic'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              Traffic (3)
            </button>
            <button
              onClick={() => setActiveTypeFilter('Sensors')}
              className={`px-2.5 py-1 rounded font-caption text-caption transition-colors ${
                activeTypeFilter === 'Sensors'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              Sensors (2)
            </button>
          </div>

          {/* Live Vector Layers Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
            <span className="text-on-surface font-semibold">Sensors</span>
            <span className="text-outline-variant">•</span>
            <span className="text-on-surface font-semibold">Radar</span>
            <span className="text-outline-variant">•</span>
            <span className="text-on-surface-variant line-through opacity-75">Traffic VMT</span>
          </div>
        </div>

        {/* Right: Quick Canvas Actions & Vector 2D / 3D Switcher */}
        <div className="flex items-center gap-space-sm">
          <div className="flex items-center rounded bg-surface-container-low p-0.5">
            <button
              aria-label="Zoom in"
              className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
            <button
              aria-label="Zoom out"
              className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <button
              onClick={() => selectIncident('INC-2048')}
              className="px-2.5 h-8 rounded flex items-center gap-1 text-on-surface hover:bg-surface-container-lowest transition-colors font-body-sm text-body-sm"
              title="Recenter to Sector 4"
            >
              <span className="material-symbols-outlined text-[16px]">filter_center_focus</span>
              <span className="font-label-mono-sm text-label-mono-sm hidden md:inline">Sector 4 Focus</span>
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedAreaPreset(activeIncident.location);
              setIsRaiseComplaintOpen(true);
            }}
            className="px-3 h-8 rounded flex items-center gap-1.5 bg-primary text-on-primary hover:bg-primary-container transition-colors font-title-sm text-title-sm shadow-xs cursor-pointer"
            title="Report incident or file a complaint for this map area"
          >
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            <span className="font-semibold hidden sm:inline">Report Area Issue</span>
          </button>
        </div>
      </div>

      {/* Primary Workspace: Split Canvas Viewport (68%) & Synchronized Incident Drawer (32%) */}
      <div className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden relative">
        {/* Left / Center Viewport: Realistic Cartographic Map Canvas (68%) */}
        <div className="relative w-full lg:w-[68%] h-full bg-surface-container overflow-hidden select-none">
          <RealisticGeoMap
            selectedIncidentId={selectedIncidentKey}
            onSelectIncident={selectIncident}
            showSensors={activeTypeFilter === 'All' || activeTypeFilter === 'Sensors'}
            showRadar={activeTypeFilter === 'All' || activeTypeFilter === 'Flooding'}
            showTraffic={activeTypeFilter === 'All' || activeTypeFilter === 'Traffic'}
          />

          {/* Floating Map Legend & Telemetry Card (Layer 2) */}
          <div className="absolute left-space-md bottom-space-md z-20 bg-surface-container-lowest p-space-md rounded-xl shadow-lg border border-outline-variant/30 max-w-xs hidden sm:flex flex-col gap-space-sm backdrop-blur-md bg-opacity-95">
            <div className="flex items-center justify-between">
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">Active Cartography Feed</span>
              <span className="font-label-mono-sm text-label-mono-sm text-tertiary font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span> SYNC OK
              </span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-error"></span>Critical / High
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">1 event</span>
              </div>
              <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A15C07]"></span>Moderate Alert
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">1 event</span>
              </div>
              <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>Telemetry Discrepancy
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">1 event</span>
              </div>
              <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></span>Clustered Low / Monitor
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">4 events</span>
              </div>
            </div>
            <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant text-[10px]">
              <span>GRID: SP-US-MA 10m</span>
              <span>UPDATED: 14s AGO</span>
            </div>
          </div>

          {/* Quick Canvas Overlay Toolsets (Layer 2) */}
          <div className="absolute right-space-md top-space-md z-20 flex flex-col gap-1.5">
            <button
              className="w-9 h-9 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-md flex items-center justify-center border border-outline-variant/30 transition-all"
              title="Toggle Hydro Layers"
            >
              <span className="material-symbols-outlined text-[18px]">water</span>
            </button>
            <button
              className="w-9 h-9 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-md flex items-center justify-center border border-outline-variant/30 transition-all"
              title="Camera Feed Insets"
            >
              <span className="material-symbols-outlined text-[18px]">videocam</span>
            </button>
            <button
              className="w-9 h-9 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-md flex items-center justify-center border border-outline-variant/30 transition-all"
              title="Public Call Reports Heatmap"
            >
              <span className="material-symbols-outlined text-[18px]">emergency</span>
            </button>
            <button
              className="w-9 h-9 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-md flex items-center justify-center border border-outline-variant/30 transition-all"
              title="Full Canvas Expansion"
            >
              <span className="material-symbols-outlined text-[18px]">fullscreen</span>
            </button>
          </div>
        </div>

        {/* Right Pane: Contextual Synchronized Incident Drawer (32%) */}
        <div className="w-full lg:w-[32%] h-full bg-surface-container-lowest flex flex-col justify-between overflow-y-auto border-l border-outline-variant/40 shadow-xl z-20">
          <div className="p-space-lg flex flex-col gap-space-md">
            {/* Telemetry meta bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="px-2 py-0.5 rounded font-label-mono text-label-mono font-bold bg-primary text-on-primary">
                  {activeIncident.id}
                </span>
                <span className="px-2 py-0.5 rounded font-caption text-caption font-semibold bg-secondary-fixed text-on-secondary-fixed">
                  {activeIncident.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-caption text-caption font-bold bg-error-container text-on-error-container flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span> High Alert
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant text-[11px]">
                  {activeIncident.updatedAgo}
                </span>
              </div>
            </div>

            {/* Incident Title & Location */}
            <div className="flex flex-col gap-1">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                {activeIncident.title}
              </h2>
              <div className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-error">location_on</span>
                <span>{activeIncident.location}</span>
              </div>
            </div>

            {/* Evidence-Grounded Natural Intelligence Synthesis */}
            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider text-[10px] font-semibold">
                  Automated Synthesis Report
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">
                  Confidence {activeIncident.confidence}%
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                {activeIncident.synthesis}
              </p>
            </div>

            {/* Evidence Breakdown Matrix */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider text-[10px] font-semibold">
                  Evidence Breakdown
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant text-[11px]">
                  {activeIncident.signalsCount} Signals Evaluated
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded bg-tertiary-fixed/30 flex flex-col gap-0.5">
                  <span className="font-label-mono text-label-mono font-bold text-on-tertiary-container text-base">
                    {activeIncident.supportingCount}
                  </span>
                  <span className="font-caption text-caption text-on-tertiary-container text-[11px] font-semibold">
                    Supporting
                  </span>
                </div>
                <div className="p-2.5 rounded bg-surface-container-low flex flex-col gap-0.5">
                  <span className="font-label-mono text-label-mono font-bold text-on-surface-variant text-base">
                    {activeIncident.contradictoryCount}
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant text-[11px]">
                    Contradictory
                  </span>
                </div>
                <div className="p-2.5 rounded bg-error-container/40 flex flex-col gap-0.5">
                  <span className="font-label-mono text-label-mono font-bold text-on-error-container text-base">
                    {activeIncident.missingCount}
                  </span>
                  <span className="font-caption text-caption text-on-error-container text-[11px] font-semibold">
                    Missing Gap
                  </span>
                </div>
              </div>

              {/* Missing verification highlight banner */}
              <div className="mt-1 px-3 py-2 rounded bg-surface-container flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant mt-0.5">
                  report_problem
                </span>
                <div className="flex flex-col">
                  <span className="font-caption text-caption font-semibold text-on-surface">
                    Critical Verification Gap
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant text-[11px]">
                    {activeIncident.missingReason}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Sensor Telemetry Strip */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider text-[10px] font-semibold">
                  Active Sensor Telemetry
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-error font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span> Critical Rise
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="font-caption text-caption text-[11px]">Stormwater Level</span>
                    <span className="material-symbols-outlined text-[14px]">waterfall_chart</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-label-mono text-label-mono font-bold text-error text-[18px]">
                      {activeIncident.levelVal || '+0.84m'}
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant text-[11px]">/ +0.60m thr</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-error h-full rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="font-caption text-caption text-[11px]">Precip Rate</span>
                    <span className="material-symbols-outlined text-[14px]">rainy</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-label-mono text-label-mono font-bold text-on-surface text-[18px]">
                      {activeIncident.rainVal ? activeIncident.rainVal.replace(/[^0-9]/g, '') : '38'}
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant text-[11px]">mm / hr</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Corroborating Signal Nodes */}
            <div className="flex flex-col gap-2">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider text-[10px] font-semibold">
                Aligned Supporting Signals
              </span>
              <div className="flex flex-col gap-1.5">
                <div className="px-3 py-2 rounded bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">traffic</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-sm text-body-sm font-semibold truncate">Transit VMT Drop</span>
                      <span className="font-caption text-caption text-on-surface-variant text-[11px]">
                        Lower Riverside avg speed -64%
                      </span>
                    </div>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">12:18</span>
                </div>
                <div className="px-3 py-2 rounded bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">call</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-sm text-body-sm font-semibold truncate">Public 911 Call Triad</span>
                      <span className="font-caption text-caption text-on-surface-variant text-[11px]">
                        3 calls: "Water rising over curb"
                      </span>
                    </div>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">12:21</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer Bar */}
          <div className="p-space-lg bg-surface-container-low border-t border-outline-variant/40 flex flex-col gap-2.5">
            {operatorActionState && (
              <div className="px-3 py-1.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-caption text-caption font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>{operatorActionState}</span>
              </div>
            )}
            <button
              onClick={() => navigate(`/incidents/${activeIncident.id}`)}
              className="w-full h-10 px-4 rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-primary transition-all active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              <span>Open Investigation Workspace</span>
            </button>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setOperatorActionState('Incident Confirmed by Operator Elena Vance')}
                className="h-8 px-2 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container font-caption text-caption font-semibold border border-outline-variant/40 flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px] text-tertiary">verified</span>
                <span>Confirm</span>
              </button>
              <button
                onClick={() => setOperatorActionState('Incident Placed Under Active Monitoring')}
                className="h-8 px-2 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container font-caption text-caption font-semibold border border-outline-variant/40 flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px] text-[#A15C07]">visibility</span>
                <span>Monitor</span>
              </button>
              <button
                onClick={() => setOperatorActionState('Incident Dismissed as False Correlation')}
                className="h-8 px-2 rounded bg-surface-container-lowest text-on-surface hover:bg-error/10 hover:text-error font-caption text-caption font-semibold border border-outline-variant/40 flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
                <span>Dismiss</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Bottom Collapsed List Drawer (Stitch exact layout) */}
      <div className="w-full bg-surface-container-lowest border-t border-outline-variant/40 z-30 transition-all flex flex-col">
        {/* Collapsible Bar Header */}
        <div
          onClick={() => setIsQueueExpanded(!isQueueExpanded)}
          className="h-9 px-space-lg flex items-center justify-between bg-surface-container-low select-none cursor-pointer hover:bg-surface-container transition-colors"
        >
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-1.5 text-on-surface font-title-sm text-title-sm">
              <span className="material-symbols-outlined text-[18px]">
                {isQueueExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
              </span>
              <span className="font-semibold text-xs tracking-wider uppercase">Active Live Queue</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-label-mono-sm text-label-mono-sm bg-surface-container-highest text-on-surface-variant font-bold">
              4 Spatial Items Visible in Viewport
            </span>
          </div>
          <div className="flex items-center gap-space-md font-caption text-caption text-on-surface-variant">
            <span className="hidden md:inline font-label-mono-sm text-label-mono-sm">
              Press [J/K] to cycle through incidents
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate('/incidents');
              }}
              className="flex items-center gap-1 text-on-surface hover:text-secondary font-medium"
            >
              <span>Expand Table</span>
              <span className="material-symbols-outlined text-[16px]">unfold_more</span>
            </button>
          </div>
        </div>

        {/* Horizontal Compact Data Strip */}
        <div className="px-space-lg py-2 flex items-center gap-space-md overflow-x-auto overflow-y-hidden">
          {/* Active Item 1: INC-2048 */}
          <div
            onClick={() => selectIncident('INC-2048')}
            className={`flex-shrink-0 flex items-center gap-3 px-3 py-1.5 rounded-lg ${
              selectedIncidentKey === 'INC-2048'
                ? 'bg-surface-container-high border-l-4 border-l-error shadow-sm'
                : 'bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30'
            } cursor-pointer min-w-[280px] transition-colors`}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-label-mono-sm text-label-mono-sm font-bold text-on-surface">INC-2048</span>
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                <span className="font-caption text-caption text-error font-semibold text-[11px]">High Flooding</span>
              </div>
              <span className="font-caption text-caption text-on-surface-variant text-[11px] truncate">
                Lower Riverside &amp; 4th Ave (+0.84m)
              </span>
            </div>
          </div>

          {/* Item 2: INC-2051 */}
          <div
            onClick={() => selectIncident('INC-2051')}
            className={`flex-shrink-0 flex items-center gap-3 px-3 py-1.5 rounded-lg ${
              selectedIncidentKey === 'INC-2051'
                ? 'bg-surface-container-high border-l-4 border-l-[#A15C07] shadow-sm'
                : 'bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30'
            } cursor-pointer min-w-[260px] transition-colors`}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">INC-2051</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#A15C07]"></span>
                <span className="font-caption text-caption text-on-surface-variant text-[11px]">Mod Traffic</span>
              </div>
              <span className="font-caption text-caption text-on-surface-variant text-[11px] truncate">
                Crosstown Expressway
              </span>
            </div>
          </div>

          {/* Item 3: INC-2054 */}
          <div
            onClick={() => selectIncident('INC-2054')}
            className={`flex-shrink-0 flex items-center gap-3 px-3 py-1.5 rounded-lg ${
              selectedIncidentKey === 'INC-2054'
                ? 'bg-surface-container-high border-l-4 border-l-secondary shadow-sm'
                : 'bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30'
            } cursor-pointer min-w-[260px] transition-colors`}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">INC-2054</span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="font-caption text-caption text-on-surface-variant text-[11px]">Sensor Deviation</span>
              </div>
              <span className="font-caption text-caption text-on-surface-variant text-[11px] truncate">
                Water Sub-station 9 (Telemetry)
              </span>
            </div>
          </div>

          {/* Item 4: INC-2057 */}
          <div
            onClick={() => selectIncident('INC-2057')}
            className={`flex-shrink-0 flex items-center gap-3 px-3 py-1.5 rounded-lg ${
              selectedIncidentKey === 'INC-2057'
                ? 'bg-surface-container-high border-l-4 border-l-outline shadow-sm'
                : 'bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30'
            } cursor-pointer min-w-[260px] transition-colors`}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">INC-2057</span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                <span className="font-caption text-caption text-on-surface-variant text-[11px]">Low Drain</span>
              </div>
              <span className="font-caption text-caption text-on-surface-variant text-[11px] truncate">
                Civic Plaza Drain Clogged
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
