import React, { useState } from 'react';
import { useUiStore } from '../../store/uiStore';
import { api } from '../../services/api';
import { UserRole } from '../../types';

export const SettingsPage: React.FC = () => {
  const { currentRole, setCurrentRole, layers, toggleLayer } = useUiStore();
  const [backendUrl, setBackendUrl] = useState(api.getBackendUrl());
  const [savedUrlSuccess, setSavedUrlSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // User preferences states
  const [reducedMotion, setReducedMotion] = useState(false);
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [densityMode, setDensityMode] = useState<'compact' | 'comfortable'>('compact');

  const roles: Array<{ role: UserRole; title: string; desc: string; perms: string[] }> = [
    {
      role: 'operations_analyst',
      title: 'Operations Analyst',
      desc: 'Monitors real-time city incidents, inspects incoming evidence, prioritizes investigations.',
      perms: ['View Incidents', 'Inspect Telemetry', 'Annotate Findings'],
    },
    {
      role: 'incident_investigator',
      title: 'Incident Investigator',
      desc: 'Reviews relationship graphs, compares hypotheses, records formal causal evaluations.',
      perms: ['View & Investigate', 'Propose Association Corrections', 'Adjudicate Hypotheses'],
    },
    {
      role: 'operations_supervisor',
      title: 'Operations Supervisor',
      desc: 'Reviews critical emergencies, approves operational overrides, assigns ownership.',
      perms: ['Supervisor Status Overrides', 'Assign Personnel', 'Authorize Emergency Dispatches'],
    },
    {
      role: 'ml_data_engineer',
      title: 'ML / Data Engineer',
      desc: 'Inspects model calibration, evaluation runs, feature drift, and replay parameters.',
      perms: ['Model Version Tracking', 'Replay Parameter Tweaks', 'Benchmark Evaluations'],
    },
    {
      role: 'platform_administrator',
      title: 'Platform Administrator',
      desc: 'Governs tenant access, data source adapters, and pipeline quarantine rules.',
      perms: ['Source Adapter Config', 'User Permissions Management', 'System Policy Audit'],
    },
  ];

  const handleSaveBackendUrl = (e: React.FormEvent) => {
    e.preventDefault();
    api.setBackendUrl(backendUrl);
    setSavedUrlSuccess(true);
    setTimeout(() => setSavedUrlSuccess(false), 3000);
  };

  const handleResetData = () => {
    api.resetToFactoryDemo();
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* Header */}
      <div className="px-space-lg py-space-md bg-surface-container-low border-b border-outline-variant flex flex-col gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <h1 className="font-headline-md text-headline-md text-on-surface">Platform Settings &amp; Preferences</h1>
          <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-mono-sm text-label-mono-sm font-semibold tracking-wider uppercase">
            RBAC &amp; Workstation
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Role-based access controls, geospatial viewport defaults, accessibility preferences, and cryptographic node gateway.
        </p>
      </div>

      <div className="p-space-lg space-y-space-lg max-w-5xl">
        {/* 1. Workstation & Accessibility Preferences */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-space-md">
          <div className="flex items-center gap-2 text-on-surface font-title-sm text-title-sm font-semibold">
            <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
            <span>Operator Workstation &amp; Accessibility</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between">
              <div>
                <div className="text-on-surface font-semibold font-title-sm text-title-sm">Reduced Motion Mode</div>
                <div className="font-caption text-caption text-on-surface-variant mt-0.5">
                  Minimizes camera fly-to transitions and canvas animations
                </div>
              </div>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`px-3 py-1 rounded font-label-mono-sm text-label-mono-sm font-bold uppercase transition-colors ${
                  reducedMotion
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {reducedMotion ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between">
              <div>
                <div className="text-on-surface font-semibold font-title-sm text-title-sm">Critical Auditory Alerts</div>
                <div className="font-caption text-caption text-on-surface-variant mt-0.5">
                  Audible acoustic chime for high-severity emergency triggers
                </div>
              </div>
              <button
                onClick={() => setAudioAlerts(!audioAlerts)}
                className={`px-3 py-1 rounded font-label-mono-sm text-label-mono-sm font-bold uppercase transition-colors ${
                  audioAlerts
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed font-semibold'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {audioAlerts ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between">
              <div>
                <div className="text-on-surface font-semibold font-title-sm text-title-sm">Workspace Density</div>
                <div className="font-caption text-caption text-on-surface-variant mt-0.5">
                  Compact command-center grid spacing
                </div>
              </div>
              <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded border border-outline-variant">
                <button
                  onClick={() => setDensityMode('compact')}
                  className={`px-2 py-0.5 rounded text-[11px] font-label-mono-sm ${
                    densityMode === 'compact' ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs' : 'text-on-surface-variant'
                  }`}
                >
                  Compact
                </button>
                <button
                  onClick={() => setDensityMode('comfortable')}
                  className={`px-2 py-0.5 rounded text-[11px] font-label-mono-sm ${
                    densityMode === 'comfortable' ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs' : 'text-on-surface-variant'
                  }`}
                >
                  Normal
                </button>
              </div>
            </div>

            <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between">
              <div>
                <div className="text-on-surface font-semibold font-title-sm text-title-sm">Interface Design System</div>
                <div className="font-caption text-caption text-on-surface-variant mt-0.5">
                  Google Stitch Operational Light Palette
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-mono-sm text-[11px] font-bold">
                STITCH LIGHT
              </span>
            </div>
          </div>
        </div>

        {/* 2. Geospatial Map Layers Configuration */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-space-md">
          <div className="flex items-center gap-2 text-on-surface font-title-sm text-title-sm font-semibold">
            <span className="material-symbols-outlined text-[18px] text-secondary">layers</span>
            <span>Default Geospatial &amp; 3D City Simulation Layers</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
            <button
              onClick={() => toggleLayer('waterFloodExtents')}
              className={`p-space-sm rounded-lg text-left border transition-all ${
                layers.waterFloodExtents
                  ? 'bg-secondary-fixed/30 border-secondary text-primary shadow-xs'
                  : 'bg-surface-container-low border-outline-variant text-on-surface-variant'
              }`}
            >
              <div className="font-caption text-caption uppercase text-on-surface-variant">Hydrology</div>
              <div className="font-semibold text-on-surface mt-0.5 font-body-sm text-body-sm">Inundation Plane</div>
              <div className="font-label-mono-sm text-[10px] mt-1 font-semibold">
                {layers.waterFloodExtents ? 'ACTIVE' : 'MUTED'}
              </div>
            </button>

            <button
              onClick={() => toggleLayer('waterSensors')}
              className={`p-space-sm rounded-lg text-left border transition-all ${
                layers.waterSensors
                  ? 'bg-secondary-fixed/30 border-secondary text-primary shadow-xs'
                  : 'bg-surface-container-low border-outline-variant text-on-surface-variant'
              }`}
            >
              <div className="font-caption text-caption uppercase text-on-surface-variant">IoT Telemetry</div>
              <div className="font-semibold text-on-surface mt-0.5 font-body-sm text-body-sm">Depth Gauges</div>
              <div className="font-label-mono-sm text-[10px] mt-1 font-semibold">
                {layers.waterSensors ? 'ACTIVE' : 'MUTED'}
              </div>
            </button>

            <button
              onClick={() => toggleLayer('trafficProbes')}
              className={`p-space-sm rounded-lg text-left border transition-all ${
                layers.trafficProbes
                  ? 'bg-secondary-fixed/30 border-secondary text-primary shadow-xs'
                  : 'bg-surface-container-low border-outline-variant text-on-surface-variant'
              }`}
            >
              <div className="font-caption text-caption uppercase text-on-surface-variant">Mobility</div>
              <div className="font-semibold text-on-surface mt-0.5 font-body-sm text-body-sm">Traffic Probes</div>
              <div className="font-label-mono-sm text-[10px] mt-1 font-semibold">
                {layers.trafficProbes ? 'ACTIVE' : 'MUTED'}
              </div>
            </button>

            <button
              onClick={() => toggleLayer('buildingFootprints')}
              className={`p-space-sm rounded-lg text-left border transition-all ${
                layers.buildingFootprints
                  ? 'bg-secondary-fixed/30 border-secondary text-primary shadow-xs'
                  : 'bg-surface-container-low border-outline-variant text-on-surface-variant'
              }`}
            >
              <div className="font-caption text-caption uppercase text-on-surface-variant">3D Geometry</div>
              <div className="font-semibold text-on-surface mt-0.5 font-body-sm text-body-sm">City Buildings</div>
              <div className="font-label-mono-sm text-[10px] mt-1 font-semibold">
                {layers.buildingFootprints ? 'ACTIVE' : 'MUTED'}
              </div>
            </button>
          </div>
        </div>

        {/* 3. Role-Based Access Control Switcher */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary-container">verified_user</span>
              <h2 className="font-title-sm text-title-sm font-semibold text-on-surface">
                Active Operator Role (Least-Privilege Enforcement)
              </h2>
            </div>
            <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">PRD 1.4 RBAC</span>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Switch active role to test how permission boundaries constrain status changes and override authorizations:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            {roles.map((r) => (
              <div
                key={r.role}
                onClick={() => setCurrentRole(r.role)}
                className={`p-space-sm rounded-lg border cursor-pointer transition-all ${
                  currentRole === r.role
                    ? 'bg-secondary-fixed/20 border-secondary shadow-sm ring-1 ring-secondary/30'
                    : 'bg-surface-container-low border-outline-variant hover:border-outline'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-title-sm text-title-sm text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">person</span>
                    <span>{r.title}</span>
                  </span>
                  {currentRole === r.role && (
                    <span className="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] font-label-mono-sm font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">{r.desc}</p>
                <div className="mt-2.5 pt-2 border-t border-outline-variant flex items-center gap-1.5 flex-wrap">
                  {r.perms.map((p, i) => (
                    <span
                      key={i}
                      className="font-label-mono-sm text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. External API Gateway & Connection Status */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">hub</span>
            <h2 className="font-title-sm text-title-sm font-semibold text-on-surface">
              External API Gateway &amp; Telemetry Relay
            </h2>
          </div>

          <form onSubmit={handleSaveBackendUrl} className="space-y-3">
            <div>
              <label className="block font-caption text-caption text-on-surface-variant mb-1 font-semibold uppercase">
                Backend REST &amp; WebSocket Endpoint:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-surface-container-low border border-outline-variant font-label-mono-sm text-label-mono-sm text-on-surface focus:outline-none focus:border-secondary"
                  placeholder="http://localhost:8000/api/v1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-primary text-on-primary font-title-sm text-title-sm font-semibold hover:bg-inverse-surface transition-colors"
                >
                  Save Endpoint
                </button>
              </div>
            </div>
            {savedUrlSuccess && (
              <div className="font-label-mono-sm text-label-mono-sm text-tertiary-container flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Gateway endpoint updated in local storage.</span>
              </div>
            )}
          </form>

          <div className="p-3 rounded bg-surface-container-low border border-outline-variant font-label-mono-sm text-label-mono-sm space-y-1 text-on-surface-variant">
            <div className="flex justify-between">
              <span>Connection Engine:</span>
              <span className={api.isUsingRealBackend() ? 'text-tertiary-container font-bold' : 'text-amber-800 font-semibold'}>
                {api.isUsingRealBackend() ? 'CONNECTED (Live Backend)' : 'STANDALONE (Deterministic Demo Adapter)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Credential Security:</span>
              <span className="text-tertiary-container font-semibold">No client secrets exposed (OAuth2 / Session Token)</span>
            </div>
          </div>

          {/* Factory Reset */}
          <div className="pt-3 border-t border-outline-variant flex items-center justify-between">
            <div className="font-body-sm text-body-sm text-on-surface-variant">
              Reset local incident ledger and reload original demonstration data fixtures.
            </div>
            <button
              onClick={handleResetData}
              className="px-3.5 py-2 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface font-title-sm text-title-sm flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>{resetSuccess ? 'Reloading...' : 'Reset to Initial Fixtures'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
