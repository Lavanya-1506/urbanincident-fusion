import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface AuditRecord {
  id: string;
  txId: string;
  time: string;
  relativeTime: string;
  actor: string;
  actorInitials: string;
  actorRole: string;
  actorBadge?: string;
  action: string;
  actionColor: string;
  actionClass: string;
  target: string;
  stateFrom: string;
  stateTo: string;
  stateToClass: string;
  rationale: string;
  hash: string;
  fullHash: string;
  diff: Array<{ type: 'remove' | 'add' | 'comment'; text: string }>;
  operatorJustification: string;
  snapshots?: Array<{
    title: string;
    sub: string;
    img: string;
  }>;
  ip: string;
  sessionToken: string;
  fipsKey: string;
  sigScheme: string;
}

const AUDIT_RECORDS: AuditRecord[] = [
  {
    id: 'aud-1',
    txId: '#88921-ELENA-2048',
    time: '10:38:12 EST',
    relativeTime: '42m ago',
    actor: 'Elena Vance',
    actorInitials: 'EV',
    actorRole: 'Lead Incident Analyst',
    actorBadge: 'Badge #ANL-9402',
    action: 'Severity Escalated',
    actionColor: 'text-error',
    actionClass: 'CRITICAL_SEVERITY_ESCALATION',
    target: 'INC-2048',
    stateFrom: 'Moderate',
    stateTo: 'High Alert',
    stateToClass: 'bg-error-container text-on-error-container font-semibold',
    rationale: 'Corroborated by water level spike + DOT camera queue formation',
    hash: '0x7f4a...e12d',
    fullHash: '0x7f4a88bc331d20ef88914c1aa9381e4b88d0f11c79a9c802e12d4889c104beef',
    diff: [
      { type: 'comment', text: '// Incident Delta: INC-2048 Parameter Revisions' },
      { type: 'remove', text: '- severity_level: "MODERATE" (score: 0.44)' },
      { type: 'add', text: '+ severity_level: "HIGH_ALERT" (score: 0.89)' },
      { type: 'remove', text: '- dispatch_readiness: "STANDBY_MONITOR"' },
      { type: 'add', text: '+ dispatch_readiness: "ACTIVE_EVAC_ZONE_PREP"' },
      { type: 'add', text: '+ supervisor_override: true' },
      { type: 'add', text: '+ justification_ref: "AUDIO_SENSOR_912_CONFIRMED"' },
    ],
    operatorJustification:
      'Corroborated by water level spike (+1.8m in 12 mins at Riverwalk Sensor 4B) combined with DOT camera 104 showing live queue formation and vehicle stall at Underpass 8. Automated ML model lagged 8 minutes on gauge integration.',
    snapshots: [
      {
        title: 'DOT Cam 104 • Underpass',
        sub: 'Timestamp: 10:37:48 EST',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9Rd2K0Nw3dGCEGOCwMdUPCtw805hdoKI8CCQEehmjmwAb_yNHXQB4QEdfz7YQg4yqrSY_yga9g6pGo6w10o1v9or1uzLw5iSAkeuNOGLGVg-KvzATeI4TXoDdtkqFWMWinu7HNBTcJ0TTNCUsnTMpCvgvl6jZqdxSK42A6EFP4w6S8X2JdQy0YsEhPUFlLEJa91XIDAi5OM7F3WgGdXlUtGErrvQnDmkxB7Agl8DBpaKOi1h5aEf6jQ',
      },
      {
        title: 'USGS Hydro-Sensor 4B',
        sub: 'Level: +1.8m Spike (Severe)',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC5rj5naF1fbFA2a4iCkJ7VOgdCj39lfYo5DClmsOW6uCEdgZRZKZ_euDkbxhMBTaKKiy0OyZcpuCmwnMEVyO2uVlfoV638c2KgSLaVSkLFEY9gfnGJDgMqOw1o0l1qEygMFuQcacqJMUqMrC_JJmheswzM5prFvDunaA3A5Wxq4btUYyNljteQ7XrA3qpj8o2C6SwD0KHBbTEf_K4hRhizhexFFWBqUFUUadPM8O2ghz_JjBYMFXvaA',
      },
    ],
    ip: '10.240.12.89 (GovVPN-Auth)',
    sessionToken: 'tk_cjis_9942a10bf8',
    fipsKey: 'YubiKey-SecP256',
    sigScheme: 'ECDSA-SHA256',
  },
  {
    id: 'aud-2',
    txId: '#88919-UFCORE-2048',
    time: '10:34:05 EST',
    relativeTime: '46m ago',
    actor: 'UrbanFusion Engine',
    actorInitials: 'AI',
    actorRole: 'v4.2.1 • Algorithmic Core',
    action: 'Hypothesis H-1 Primary',
    actionColor: 'text-secondary',
    actionClass: 'ALGORITHMIC_HYPOTHESIS_PROMOTION',
    target: 'INC-2048',
    stateFrom: 'Hypo H-3',
    stateTo: 'Hypo H-1 Flash Flood',
    stateToClass: 'bg-secondary-fixed text-on-secondary-fixed font-semibold',
    rationale: 'Algorithmic correlation threshold exceeded 0.80',
    hash: '0x3b1c...99a0',
    fullHash: '0x3b1ca490218817bcde8420119283e1cbb3019842aef283109a018449198399a0',
    diff: [
      { type: 'comment', text: '// Bayesian Posterior Update' },
      { type: 'remove', text: '- primary_hypothesis: "H3_WATER_MAIN_BURST" (prob: 0.38)' },
      { type: 'add', text: '+ primary_hypothesis: "H1_FLASH_FLOOD_OVERFLOW" (prob: 0.82)' },
      { type: 'add', text: '+ confidence_score: 0.78' },
    ],
    operatorJustification:
      'Multi-source fusion engine ingested 3 corroborating signals from rainfall rate, stormwater sensor telemetry, and 911 calls, shifting prior probabilities.',
    ip: '10.240.0.12 (Internal Cluster K8s)',
    sessionToken: 'tk_svc_daemon_core',
    fipsKey: 'KMS-HSM-CloudManaged',
    sigScheme: 'RSA-PSS-4096',
  },
  {
    id: 'aud-3',
    txId: '#88914-MBRODY-2042',
    time: '10:19:40 EST',
    relativeTime: '1h 00m ago',
    actor: 'Marcus Brody',
    actorInitials: 'MB',
    actorRole: 'Field Ops Supervisor (Unit 9)',
    actorBadge: 'Badge #FLD-3301',
    action: 'Incident Confirmed',
    actionColor: 'text-tertiary-container',
    actionClass: 'FIELD_VERIFICATION_CONFIRM',
    target: 'INC-2042',
    stateFrom: 'Under Review',
    stateTo: 'Confirmed Active',
    stateToClass: 'bg-tertiary-fixed text-on-tertiary-fixed font-semibold',
    rationale: 'Field crew confirmed culvert debris clearance underway',
    hash: '0x99dd...01cc',
    fullHash: '0x99dd74828114efbb92019488319cd8201a0948cba094891901848191919201cc',
    diff: [
      { type: 'comment', text: '// Field Dispatch Confirmation' },
      { type: 'remove', text: '- status: "UNDER_REVIEW"' },
      { type: 'add', text: '+ status: "CONFIRMED_ACTIVE"' },
      { type: 'add', text: '+ field_unit_dispatched: "UNIT_9_CREW"' },
    ],
    operatorJustification:
      'Unit 9 supervisor visually verified culvert blockage at 8th and Elm. Crew positioned with vacuum loader.',
    ip: '172.56.21.90 (Mobile MDT FirstNet)',
    sessionToken: 'tk_firstnet_mb_9901',
    fipsKey: 'MDT-Hardware-TPM2.0',
    sigScheme: 'ECDSA-SHA256',
  },
  {
    id: 'aud-4',
    txId: '#88909-USGS-8912',
    time: '10:12:18 EST',
    relativeTime: '1h 08m ago',
    actor: 'System Ingestion',
    actorInitials: 'SI',
    actorRole: 'USGS Telemetry Feed',
    action: 'Evidence Correlated',
    actionColor: 'text-secondary',
    actionClass: 'EVIDENCE_CORRELATION_BIND',
    target: 'OBS-8912',
    stateFrom: '2 Evidence',
    stateTo: '4 Evidence Items',
    stateToClass: 'bg-surface-container-high text-on-surface font-semibold',
    rationale: 'Acoustic hydrophone anomaly flagged at Station 14-B',
    hash: '0x12e0...8b77',
    fullHash: '0x12e0984819283748201948271039848192837461928374619283746192838b77',
    diff: [
      { type: 'comment', text: '// Ingestion Auto-Link' },
      { type: 'add', text: '+ bound_observation_id: "OBS-8912"' },
      { type: 'add', text: '+ correlation_weight: 0.91' },
    ],
    operatorJustification: 'Acoustic hydrophone anomaly matched temporal signature within 300s window.',
    ip: '10.240.4.19 (Ingress Gateway)',
    sessionToken: 'tk_ingest_usgs_prod',
    fipsKey: 'KMS-HSM-CloudManaged',
    sigScheme: 'ECDSA-SHA256',
  },
  {
    id: 'aud-5',
    txId: '#88901-ELENA-2048',
    time: '09:55:02 EST',
    relativeTime: '1h 25m ago',
    actor: 'Elena Vance',
    actorInitials: 'EV',
    actorRole: 'Lead Incident Analyst',
    actorBadge: 'Badge #ANL-9402',
    action: 'Manual Note Appended',
    actionColor: 'text-on-surface-variant',
    actionClass: 'ANALYST_NOTE_MUTATION',
    target: 'INC-2048',
    stateFrom: 'Revision 2',
    stateTo: 'Revision 3',
    stateToClass: 'bg-surface-container font-medium text-on-surface',
    rationale: 'Dispatched notification to Transit Authority liaison office',
    hash: '0x6a04...c81f',
    fullHash: '0x6a0488192837461928374619283746192837461928374619283746192837c81f',
    diff: [
      { type: 'comment', text: '// Operator Note Append' },
      { type: 'add', text: '+ note_entry: "Transit liaison notified re: route 4 detour."' },
      { type: 'add', text: '+ revision: 3' },
    ],
    operatorJustification: 'Standard inter-agency communications protocol executed.',
    ip: '10.240.12.89 (GovVPN-Auth)',
    sessionToken: 'tk_cjis_9942a10bf8',
    fipsKey: 'YubiKey-SecP256',
    sigScheme: 'ECDSA-SHA256',
  },
  {
    id: 'aud-6',
    txId: '#88894-WATCHDOG-W18',
    time: '09:41:50 EST',
    relativeTime: '1h 38m ago',
    actor: 'System Ingestion',
    actorInitials: 'SI',
    actorRole: 'Sensor Watchdog',
    action: 'Sensor Calibration',
    actionColor: 'text-outline',
    actionClass: 'TELEMETRY_BASELINE_LOCK',
    target: 'SRC-W18',
    stateFrom: 'Uncalibrated',
    stateTo: 'Locked Baseline',
    stateToClass: 'bg-surface-container-high text-on-surface',
    rationale: 'Scheduled hourly telemetry baseline resynchronization',
    hash: '0x44aa...28fd',
    fullHash: '0x44aa8192837461928374619283746192837461928374619283746192837428fd',
    diff: [
      { type: 'comment', text: '// Hourly Sensor Drift Calibration' },
      { type: 'remove', text: '- drift_delta: +0.08m' },
      { type: 'add', text: '+ drift_delta: 0.00m (Reset to hydrostatic datum)' },
    ],
    operatorJustification: 'Hourly automated drift correction cycle completed.',
    ip: '10.240.4.19 (Ingress Gateway)',
    sessionToken: 'tk_watchdog_hourly_cycle',
    fipsKey: 'KMS-HSM-CloudManaged',
    sigScheme: 'ECDSA-SHA256',
  },
];

export const AuditHistoryPage: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord>(AUDIT_RECORDS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('INC-2048');
  const [actorFilter, setActorFilter] = useState<string>('All');
  const [actionFilter, setActionFilter] = useState<string>('All');
  const [copiedHash, setCopiedHash] = useState(false);

  const filteredRecords = AUDIT_RECORDS.filter((rec) => {
    if (actorFilter !== 'All') {
      if (actorFilter === 'human' && rec.actorInitials === 'AI') return false;
      if (actorFilter === 'ai' && rec.actorInitials !== 'AI') return false;
      if (actorFilter === 'system' && rec.actorInitials !== 'SI') return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        rec.target.toLowerCase().includes(q) ||
        rec.actor.toLowerCase().includes(q) ||
        rec.action.toLowerCase().includes(q) ||
        rec.rationale.toLowerCase().includes(q) ||
        rec.hash.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyHash = () => {
    navigator.clipboard.writeText(selectedRecord.fullHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 1500);
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* Verification Bar (Sub-Header Top Status) */}
      <div className="w-full bg-surface-container-high px-space-lg py-2.5 flex flex-wrap items-center justify-between gap-space-md shadow-sm border-b border-outline-variant">
        <div className="flex items-center gap-space-sm min-w-0">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
          </span>
          <div className="flex items-center gap-space-xs font-label-mono text-label-mono text-on-surface truncate">
            <span className="font-semibold text-primary">Cryptographic ledger signed by Node #SECTOR4-K8</span>
            <span className="text-on-surface-variant">•</span>
            <span className="text-tertiary-container font-semibold">Chain verification status: OK (Zero gaps detected)</span>
          </div>
        </div>

        <div className="flex items-center gap-space-lg font-label-mono-sm text-label-mono-sm text-on-surface-variant">
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
            Synchronized block #4,912,804
          </span>
          <span className="hidden md:inline text-on-surface-variant">Epoch 92.1</span>
          <button className="text-secondary hover:text-on-surface flex items-center gap-1 transition-colors" type="button">
            <span className="material-symbols-outlined text-[15px]">refresh</span>
            Verify Merkle Proof
          </button>
        </div>
      </div>

      {/* Page Header & Action Controls */}
      <div className="px-space-lg pt-space-lg pb-space-md flex flex-col gap-space-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-space-sm mb-1">
              <span className="font-caption text-caption text-secondary uppercase tracking-wider font-semibold">
                System Audit Trail
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">ISO 27001 / CJIS Tier-4</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Audit History</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-1">
              Immutable tamper-evident record of operator determinations, algorithmic assessment revisions, and incident state changes.
            </p>
          </div>

          <div className="flex items-center gap-space-sm self-start lg:self-center">
            <button
              className="inline-flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-title-sm text-title-sm shadow-sm border border-outline-variant"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              <span>Ledger Keys</span>
            </button>
            <button
              className="inline-flex items-center gap-space-xs px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-title-sm text-title-sm shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Immutable Audit CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant flex flex-col xl:flex-row gap-space-md items-stretch xl:items-center justify-between">
          <div className="flex-1 flex flex-col md:flex-row gap-space-sm items-stretch md:items-center">
            {/* Search bar */}
            <div className="relative flex-1 min-w-[260px]">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all border border-outline-variant"
                placeholder="Search actor, incident ID (e.g. INC-2048), hash, rationale..."
                type="text"
              />
            </div>

            {/* Actor Filter Dropdown */}
            <div className="relative">
              <select
                value={actorFilter}
                onChange={(e) => setActorFilter(e.target.value)}
                className="appearance-none h-9 pl-3 pr-8 rounded-lg bg-surface-container-low border border-outline-variant font-body-sm text-body-sm text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="All">All Actors (Human &amp; Engine)</option>
                <option value="human">Human Analysts Only</option>
                <option value="ai">UrbanFusion Engine AI</option>
                <option value="system">System Ingest &amp; Telemetry</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[16px] text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Action Type Filter Dropdown */}
            <div className="relative">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="appearance-none h-9 pl-3 pr-8 rounded-lg bg-surface-container-low border border-outline-variant font-body-sm text-body-sm text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="All">All Action Types</option>
                <option value="severity">Severity Escalation</option>
                <option value="status">Status Change</option>
                <option value="hypo">Hypothesis Override</option>
                <option value="evidence">Evidence Dismissal / Correlation</option>
                <option value="note">Manual Annotation</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[16px] text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Date Range & Refresh */}
          <div className="flex items-center gap-space-sm self-end xl:self-center">
            <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant font-label-mono text-label-mono text-on-surface">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">calendar_today</span>
              <span>Last 24 Hours: 04:00 - 11:20 EST</span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant cursor-pointer">arrow_drop_down</span>
            </div>
            <button
              aria-label="Filter presets"
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-surface-container-low border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Badges Strip */}
      <div className="px-space-lg mb-space-md grid grid-cols-2 sm:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">Total Mutations</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">database</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-md text-headline-md text-primary font-bold">1,482</span>
            <span className="font-label-mono-sm text-label-mono-sm text-tertiary-container">+14% / shift</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">Human Overrides</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">person_check</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-md text-headline-md text-primary font-bold">47</span>
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">3.1% automated delta</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">Algorithmic Revisions</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">psychology</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-md text-headline-md text-primary font-bold">894</span>
            <span className="font-label-mono-sm text-label-mono-sm text-tertiary-container">99.8% conf. score</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">Chain Signature Health</span>
            <span className="material-symbols-outlined text-[18px] text-tertiary-container">shield</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-md text-headline-md text-primary font-bold">100%</span>
            <span className="font-label-mono-sm text-label-mono-sm text-tertiary-container">Signed &amp; Anchored</span>
          </div>
        </div>
      </div>

      {/* Primary Workspace: Split Table & Inspection Panel */}
      <div className="px-space-lg pb-space-xl grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Ledger Table (Spans 7 cols on XL) */}
        <div className="xl:col-span-7 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div className="p-space-md bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <span className="font-title-sm text-title-sm text-primary font-semibold">Audit Stream</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                {filteredRecords.length} Filtered Records
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-caption text-caption text-on-surface-variant">Live streaming</span>
              <span className="inline-block w-2 h-2 rounded-full bg-tertiary-container"></span>
            </div>
          </div>

          {/* Ledger Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-caption text-caption uppercase tracking-wider border-b border-outline-variant">
                  <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-3 font-semibold">Actor &amp; Role</th>
                  <th className="py-2.5 px-3 font-semibold">Action &amp; Target</th>
                  <th className="py-2.5 px-3 font-semibold">State Mutation</th>
                  <th className="py-2.5 px-3 font-semibold">Verification Hash</th>
                  <th className="py-2.5 px-3 font-semibold text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 font-table-data text-table-data">
                {filteredRecords.map((rec) => {
                  const isSelected = selectedRecord.id === rec.id;
                  return (
                    <tr
                      key={rec.id}
                      onClick={() => setSelectedRecord(rec)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-secondary-fixed/20 hover:bg-secondary-fixed/30' : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        <div className="font-label-mono text-label-mono font-medium text-primary">{rec.time}</div>
                        <div className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">{rec.relativeTime}</div>
                      </td>

                      <td className="py-3 px-3 align-top">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-label-mono-sm text-label-mono-sm font-semibold ${
                              rec.actorInitials === 'AI'
                                ? 'bg-secondary-fixed text-on-secondary-fixed'
                                : rec.actorInitials === 'SI'
                                ? 'bg-surface-container-high text-on-surface'
                                : 'bg-primary-container text-on-primary'
                            }`}
                          >
                            {rec.actorInitials}
                          </div>
                          <div>
                            <div className="font-title-sm text-title-sm text-primary leading-tight font-semibold">
                              {rec.actor}
                            </div>
                            <div className="font-caption text-caption text-on-surface-variant text-[11px]">{rec.actorRole}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 align-top">
                        <div className={`inline-flex items-center gap-1 font-semibold text-[12px] uppercase tracking-wide ${rec.actionColor}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {rec.action}
                        </div>
                        <div className="font-label-mono text-label-mono text-secondary font-medium">{rec.target}</div>
                      </td>

                      <td className="py-3 px-3 align-top">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-surface-container font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                            {rec.stateFrom}
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-on-surface-variant">arrow_forward</span>
                          <span className={`px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm ${rec.stateToClass}`}>
                            {rec.stateTo}
                          </span>
                        </div>
                        <div className="mt-1 text-on-surface-variant font-caption text-caption line-clamp-1 italic">
                          “{rec.rationale}”
                        </div>
                      </td>

                      <td className="py-3 px-3 align-top font-label-mono-sm text-label-mono-sm text-on-surface-variant whitespace-nowrap">
                        <span className="bg-surface-container px-1.5 py-0.5 rounded font-medium text-on-surface">
                          {rec.hash}
                        </span>
                      </td>

                      <td className="py-3 px-3 align-middle text-right">
                        <span
                          className={`material-symbols-outlined text-[20px] ${
                            isSelected ? 'text-secondary font-bold' : 'text-on-surface-variant'
                          }`}
                        >
                          chevron_right
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="p-space-md bg-surface-container-low border-t border-outline-variant flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <span>Displaying 1 - {filteredRecords.length} of 1,482 audit events</span>
            <div className="flex items-center gap-2">
              <button
                className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high disabled:opacity-50"
                disabled
                type="button"
              >
                Previous
              </button>
              <span className="px-2 font-semibold text-primary">Page 1 of 247</span>
              <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high" type="button">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Selected Audit Entry Detail Drawer (Spans 5 cols on XL) */}
        <div className="xl:col-span-5 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-md overflow-hidden flex flex-col">
            {/* Inspection Header */}
            <div className="p-space-md bg-surface-container border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">policy</span>
                <div className="flex flex-col">
                  <span className="font-title-sm text-title-sm text-primary font-bold">Audit Inspection Record</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                    TX-ID: {selectedRecord.txId}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-mono-sm text-label-mono-sm font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                VERIFIED VALID
              </span>
            </div>

            <div className="p-space-md flex flex-col gap-space-lg">
              {/* Actor & Target Context Block */}
              <div className="flex flex-col gap-space-sm p-space-md bg-surface-container-low rounded-lg border border-outline-variant">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">
                      Determining Operator
                    </span>
                    <div className="font-headline-sm text-headline-sm text-primary font-bold mt-0.5">
                      {selectedRecord.actor}
                    </div>
                    <div className="font-caption text-caption text-on-surface-variant">
                      {selectedRecord.actorRole} {selectedRecord.actorBadge ? `• ${selectedRecord.actorBadge}` : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">
                      Target Entity
                    </span>
                    <div className="font-title-md text-title-md text-secondary font-bold font-label-mono mt-0.5">
                      {selectedRecord.target}
                    </div>
                    <div className="font-caption text-caption text-on-surface-variant">Sector 4 Flood Plain</div>
                  </div>
                </div>

                <div className="mt-2 pt-2 bg-surface-container-high rounded p-2.5 flex items-center justify-between">
                  <span className="font-caption text-caption text-on-surface font-semibold">Action Classification</span>
                  <span className="font-label-mono-sm text-label-mono-sm font-bold text-error bg-error-container/60 px-2 py-0.5 rounded">
                    {selectedRecord.actionClass}
                  </span>
                </div>
              </div>

              {/* Parameter Diff Viewer */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-title-sm text-title-sm text-primary font-semibold">State Mutation Diff</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">JSON Payload Patch</span>
                </div>
                <div className="bg-primary text-on-primary rounded-lg p-3 font-label-mono-sm text-label-mono-sm space-y-1 shadow-inner overflow-x-auto">
                  {selectedRecord.diff.map((item, idx) => (
                    <div
                      key={idx}
                      className={
                        item.type === 'comment'
                          ? 'text-on-primary-container'
                          : item.type === 'remove'
                          ? 'text-error-container line-through opacity-80'
                          : 'text-tertiary-fixed font-semibold'
                      }
                    >
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Operator Justification Memo */}
              <div className="flex flex-col gap-1.5">
                <span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">
                  Operator Stated Justification
                </span>
                <div className="bg-surface-container-low border border-outline-variant p-3 rounded-lg font-body-sm text-body-sm text-on-surface leading-relaxed">
                  “{selectedRecord.operatorJustification}”
                </div>
              </div>

              {/* Associated Evidence Snapshot at Time of Decision */}
              {selectedRecord.snapshots && selectedRecord.snapshots.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-title-sm text-title-sm text-primary font-semibold">Evidence Snapshot at Decision</span>
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">
                      {selectedRecord.snapshots.length} Snapshots Locked
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-space-sm">
                    {selectedRecord.snapshots.map((snap, sIdx) => (
                      <div key={sIdx} className="rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant shadow-sm flex flex-col">
                        <img className="w-full h-24 object-cover" src={snap.img} alt={snap.title} />
                        <div className="p-2 font-caption text-caption flex flex-col">
                          <span className="font-semibold text-primary truncate">{snap.title}</span>
                          <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">{snap.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Session & Chain of Custody Technical Metadata */}
              <div className="flex flex-col gap-2 pt-2 bg-surface-container-low border border-outline-variant p-3 rounded-lg">
                <span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">
                  Authentication &amp; Chain-of-Custody
                </span>
                <div className="grid grid-cols-2 gap-y-2 font-label-mono-sm text-label-mono-sm text-on-surface">
                  <div>
                    <span className="text-on-surface-variant block">Client Source IP:</span>
                    <span className="font-semibold">{selectedRecord.ip}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Session Token:</span>
                    <span className="font-semibold truncate block">{selectedRecord.sessionToken}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">FIPS-140-3 Hardware Key:</span>
                    <span className="font-semibold">{selectedRecord.fipsKey}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Signature Scheme:</span>
                    <span className="font-semibold">{selectedRecord.sigScheme}</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 bg-surface-container-high rounded p-2 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                      Cryptographic Signature Digest:
                    </span>
                    <button
                      onClick={handleCopyHash}
                      className="text-[11px] font-label-mono-sm text-secondary hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {copiedHash ? 'check' : 'content_copy'}
                      </span>
                      <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="font-label-mono text-label-mono text-xs font-medium text-primary select-all break-all">
                    {selectedRecord.fullHash}
                  </span>
                </div>
              </div>

              {/* Bottom Action Buttons inside Drawer */}
              <div className="flex items-center gap-space-sm pt-2">
                <button
                  className="flex-1 py-2 rounded-lg bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high font-title-sm text-title-sm transition-colors text-center"
                  type="button"
                >
                  Inspect Raw JSON
                </button>
                <Link
                  to={`/incidents/${selectedRecord.target.replace('INC-', '')}`}
                  className="flex-1 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-title-sm text-title-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>View Incident Workspace</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Regulatory Compliance Watermark Card */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-[24px]">gavel</span>
              <div>
                <div className="font-title-sm text-title-sm text-primary font-semibold">CJIS Audit Seal • Append-Only Mode</div>
                <div className="font-caption text-caption text-on-surface-variant">
                  Zero deletions allowed. Records retained 7 years per statutory regulation.
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-tertiary-container text-[20px]">check_circle</span>
          </div>
        </div>
      </div>
    </div>
  );
};
