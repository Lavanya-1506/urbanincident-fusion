import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

interface IngestionNode {
  id: string;
  name: string;
  host: string;
  provider: string;
  protocol: string;
  protocolDetails: string;
  status: 'healthy' | 'degraded' | 'offline';
  cadence: string;
  latency: string;
  lastSync: string;
  volume24h: string;
  errorRate: string;
  icon: string;
  inspectionTitle?: string;
  inspectionDesc?: string;
  upstreamProvider?: string;
  schemaStandard?: string;
  transportStream?: string;
  relayNode?: string;
  fieldAngle?: string;
  snapshotUrl?: string;
  recentRuns?: Array<{ id: string; time: string; details: string; status: 'PASS' | 'FAIL' }>;
  linkedIncidents?: Array<{ id: string; title: string; note: string; badgeClass: string }>;
}

const DEFAULT_NODES: IngestionNode[] = [
  {
    id: 'TF-04',
    name: 'DOT Highway Feeder CCTV TF-04',
    host: 'node-cam-highway-ne-04.massdot.gov',
    provider: 'MassDOT Optical',
    protocol: 'RTMP / Optical OCR',
    protocolDetails: 'Optical stream with AI OCR frame extraction',
    status: 'degraded',
    cadence: '10s stream',
    latency: '4.2s latency (Jitter spike)',
    lastSync: '14s ago',
    volume24h: '28,400 frames',
    errorRate: '3.8% Dropped',
    icon: 'videocam',
    inspectionTitle: 'Packet Jitter & Optical Obstruction',
    inspectionDesc: 'High packet jitter (3.8% drop) and physical PTZ pan angle obstructed by overpass pier footing at Route 9 Interchange.',
    upstreamProvider: 'MassDOT Operations Center',
    schemaStandard: 'v2.4-optical-edge',
    transportStream: 'H.264 / RTMP (1080p 15fps)',
    relayNode: 'edge-gateway-east-2.internal',
    fieldAngle: 'Field Angle 244° WSW',
    snapshotUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiBHace8cLI-pAqU3GZNxOAyLeHRT891rQseiPOOhN5W27O33yGaVPlImrU1Hohkn_XB2zBSiP4f5vKU4iKb7EZnmI2BJgMWAeEDSFPbtTI8eceKfUpJW5qAuTD8PEBQ1f11pAysOsOrN5M8dkI0DYMYjEsnhhbb8-1ut8u_HjZKVWEa1NPUU5glrgXqZtujRwqymEidiEOs8aPLnAxd0D89zOHy4fRYNgyX4qY7AVrT9Jbk5P8hqRwA',
    recentRuns: [
      { id: 'RUN-992', time: '10:24:12 EST', details: 'Warning: 4 consecutive dropped heartbeats; RTSP pipe stall', status: 'FAIL' },
      { id: 'RUN-991', time: '10:19:12 EST', details: 'Sync OK • 1,420 frames • 820ms response', status: 'PASS' },
      { id: 'RUN-990', time: '10:14:12 EST', details: 'Sync OK • 1,419 frames • 790ms response', status: 'PASS' },
      { id: 'RUN-989', time: '10:09:12 EST', details: 'Sync OK • 1,420 frames • 810ms response', status: 'PASS' },
    ],
    linkedIncidents: [
      { id: 'INC-2048', title: 'Rt 9 Tanker Collision & Spill', note: 'Critical Fusion Node: Visual verification hindered', badgeClass: 'bg-error-container text-on-error-container' },
      { id: 'INC-2051', title: 'Overpass Clearance Audit', note: 'Moderate Alert: Pier occlusion telemetry', badgeClass: 'bg-surface-container-highest text-on-surface' },
    ],
  },
  {
    id: 'W-18',
    name: 'USGS Stream Gauge W-18',
    host: 'usgs-hydro-telemetry.cr.usgs.gov/w-18',
    provider: 'USGS Hydrology',
    protocol: 'REST / JSON (Geo)',
    protocolDetails: 'Stage height and volumetric flow rate telemetry',
    status: 'healthy',
    cadence: 'Every 30s',
    latency: '420ms latency',
    lastSync: '22s ago',
    volume24h: '142,800 packets',
    errorRate: '0.00%',
    icon: 'water_loss',
    inspectionTitle: 'Nominal Hydrologic Baseline',
    inspectionDesc: 'Continuous hydrograph streaming within standard tolerance bands.',
    upstreamProvider: 'USGS Water Services',
    schemaStandard: 'WaterML 2.0 / GeoJSON',
    transportStream: 'HTTPS / TLS 1.3 REST polling',
    relayNode: 'edge-gateway-river-1.internal',
    fieldAngle: 'Fixed Submersible Sonar Transducer',
    snapshotUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC5rj5naF1fbFA2a4iCkJ7VOgdCj39lfYo5DClmsOW6uCEdgZRZKZ_euDkbxhMBTaKKiy0OyZcpuCmwnMEVyO2uVlfoV638c2KgSLaVSkLFEY9gfnGJDgMqOw1o0l1qEygMFuQcacqJMUqMrC_JJmheswzM5prFvDunaA3A5Wxq4btUYyNljteQ7XrA3qpj8o2C6SwD0KHBbTEf_K4hRhizhexFFWBqUFUUadPM8O2ghz_JjBYMFXvaA',
    recentRuns: [
      { id: 'RUN-884', time: '10:24:00 EST', details: 'Sync OK • Stage 4.82m • Flow 142 cfs', status: 'PASS' },
      { id: 'RUN-883', time: '10:23:30 EST', details: 'Sync OK • Stage 4.81m • Flow 141 cfs', status: 'PASS' },
    ],
    linkedIncidents: [
      { id: 'INC-2048', title: 'Lower Riverside Inundation', note: 'Primary Hydrologic Corroborator', badgeClass: 'bg-error-container text-on-error-container' },
    ],
  },
  {
    id: 'D-4',
    name: 'Doppler Central Radar D-4',
    host: 'nexrad-level2.radar.noaa.gov/d4',
    provider: 'NOAA Atmospheric',
    protocol: 'NOAA NEXRAD binary',
    protocolDetails: 'Dual-pol reflectivity & differential reflectivity matrices',
    status: 'healthy',
    cadence: 'Every 5m',
    latency: '1.1s latency',
    lastSync: '3m ago',
    volume24h: '1,240 volumes',
    errorRate: '0.00%',
    icon: 'radar',
    inspectionTitle: 'Dual-Pol Atmospheric Sweep Active',
    inspectionDesc: 'Volumetric elevation sweeps updating every 300 seconds. Precipitation rate calibrated.',
    upstreamProvider: 'National Weather Service NEXRAD Network',
    schemaStandard: 'Level-II ICD-2620001',
    transportStream: 'UDP Multicast via Local WFO Interconnect',
    relayNode: 'edge-met-gateway-north.internal',
    fieldAngle: '360° Azimuthal 0.5° Elevation Scan',
  },
  {
    id: '311-GW',
    name: 'Municipal 311 Dispatch Gateway',
    host: 'api.cityhall.gov/v2/ingest/dispatch',
    provider: 'Civil Response CRM',
    protocol: 'Webhook / GeoJSON',
    protocolDetails: 'Citizen call intake and automated NLP dispatch clustering',
    status: 'healthy',
    cadence: 'Real-time Push',
    latency: '190ms latency',
    lastSync: '4s ago',
    volume24h: '4,890 records',
    errorRate: '0.04% Drift',
    icon: 'contact_phone',
    inspectionTitle: 'Civilian Emergency Webhook Ingest',
    inspectionDesc: 'Real-time HTTPS POST delivery with HMAC signature verification.',
    upstreamProvider: 'City Communications Bureau',
    schemaStandard: 'Open311 GeoReport v2',
    transportStream: 'Webhook JSON over HTTPS',
    relayNode: 'edge-ingress-api.internal',
  },
  {
    id: 'SUB-9',
    name: 'SCADA Water District Sub-9',
    host: 'broker.districtwater.org:8883/scada/sub9',
    provider: 'District Water SCADA',
    protocol: 'Industrial MQTT TLS',
    protocolDetails: 'Stormwater retention sump level and gate telemetry',
    status: 'healthy',
    cadence: 'Every 5s',
    latency: '110ms latency',
    lastSync: '2s ago',
    volume24h: '172,400 msgs',
    errorRate: '0.00%',
    icon: 'valve',
    inspectionTitle: 'Stormwater Pump Status Nominal',
    inspectionDesc: 'Retention basin capacity at 64%. Pumps P1-P4 running on automated duty cycle.',
    upstreamProvider: 'Regional Water Resources Authority',
    schemaStandard: 'DNP3-over-MQTT JSON',
    transportStream: 'MQTTS TLS 1.3 Port 8883',
    relayNode: 'edge-scada-substation-9.internal',
  },
  {
    id: 'AVL-BUS',
    name: 'City Transit AVL Stream',
    host: 'gtfs-rt.metrotransit.net/tripupdates',
    provider: 'Metro Transit Fleet',
    protocol: 'GTFS-Realtime Protocol',
    protocolDetails: 'Bus & light rail GPS position and delay telemetry',
    status: 'healthy',
    cadence: 'Every 15s',
    latency: '340ms latency',
    lastSync: '11s ago',
    volume24h: '518,000 vectors',
    errorRate: '0.00%',
    icon: 'directions_bus',
    inspectionTitle: 'Vehicle Location Stream Active',
    inspectionDesc: '420 active municipal transit vehicles reporting positional coordinates and headway delays.',
    upstreamProvider: 'Regional Transit Operating Authority',
    schemaStandard: 'GTFS-rt v2.0 Protocol Buffers',
    transportStream: 'HTTPS GET / Binary Protobuf',
    relayNode: 'edge-transit-gateway.internal',
  },
];

export const SourcesHealthPage: React.FC = () => {
  const { data: apiSources = [], refetch } = useQuery({
    queryKey: ['sources'],
    queryFn: () => api.fetchSources(),
  });

  const [selectedNode, setSelectedNode] = useState<IngestionNode>(DEFAULT_NODES[0]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'degraded' | 'offline'>('all');
  const [protocolFilter, setProtocolFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reconnecting, setReconnecting] = useState(false);

  const filteredNodes = DEFAULT_NODES.filter(node => {
    if (statusFilter !== 'all' && node.status !== statusFilter) return false;
    if (protocolFilter !== 'all' && !node.protocol.toLowerCase().includes(protocolFilter.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        node.name.toLowerCase().includes(q) ||
        node.host.toLowerCase().includes(q) ||
        node.provider.toLowerCase().includes(q) ||
        node.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleForceReconnect = () => {
    setReconnecting(true);
    setTimeout(() => {
      setReconnecting(false);
      refetch();
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* Status & Command Strip */}
      <div className="px-space-lg py-space-md bg-surface-container-low flex flex-col gap-space-md border-b border-outline-variant">
        {/* Header row with title & KPI badge */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-md text-headline-md text-on-surface">Data Sources &amp; Telemetry Ingestion</h1>
              <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-mono-sm text-label-mono-sm font-semibold tracking-wider uppercase">
                Live Mesh
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Monitor live feed health, packet latency, schema conformance, and sensor calibration across municipal providers.
            </p>
          </div>

          {/* Global Health Metric Capsule */}
          <div className="flex items-center gap-space-md bg-surface-container-lowest px-space-md py-2 rounded-lg shadow-sm border border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary-container"></span>
              </span>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">
                11 Healthy <span className="text-on-surface-variant font-normal">•</span>{' '}
                <span className="text-amber-800">1 Degraded</span> <span className="text-on-surface-variant font-normal">•</span>{' '}
                0 Offline
              </span>
            </div>
            <div className="h-4 w-px bg-outline-variant"></div>
            <div className="flex items-center gap-1.5">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider text-[11px]">
                Aggregated SLA:
              </span>
              <span className="font-label-mono-sm text-label-mono-sm text-tertiary-container font-semibold">
                99.4% Conformance
              </span>
            </div>
          </div>
        </div>

        {/* Filters & Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
          <div className="flex flex-wrap items-center gap-space-sm flex-1 max-w-4xl">
            {/* Search bar */}
            <div className="relative flex items-center min-w-[260px] flex-1 max-w-xs">
              <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded bg-surface-container-lowest border border-outline-variant font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="Search provider, telemetry ID, sensor node..."
                type="text"
              />
            </div>

            {/* Filter: Health Status */}
            <div className="flex items-center rounded bg-surface-container-lowest border border-outline-variant p-0.5">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 font-caption text-caption font-semibold rounded transition-colors ${
                  statusFilter === 'all'
                    ? 'text-on-surface bg-surface-container shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                All (12)
              </button>
              <button
                onClick={() => setStatusFilter('healthy')}
                className={`px-2.5 py-1 font-caption text-caption rounded transition-colors ${
                  statusFilter === 'healthy'
                    ? 'text-on-surface bg-surface-container font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Healthy (11)
              </button>
              <button
                onClick={() => setStatusFilter('degraded')}
                className={`px-2.5 py-1 font-caption text-caption rounded flex items-center gap-1 transition-colors ${
                  statusFilter === 'degraded'
                    ? 'text-on-surface bg-surface-container font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>Degraded</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              </button>
              <button
                onClick={() => setStatusFilter('offline')}
                className={`px-2.5 py-1 font-caption text-caption rounded transition-colors ${
                  statusFilter === 'offline'
                    ? 'text-on-surface bg-surface-container font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Offline (0)
              </button>
            </div>

            {/* Filter: Ingestion Protocol Dropdown */}
            <div className="relative">
              <select
                value={protocolFilter}
                onChange={(e) => setProtocolFilter(e.target.value)}
                className="h-9 pl-8 pr-7 rounded bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm appearance-none cursor-pointer focus:outline-none"
              >
                <option value="all">Protocol: All Types</option>
                <option value="rtmp">RTMP Optical</option>
                <option value="rest">REST / JSON</option>
                <option value="radar">NEXRAD Binary</option>
                <option value="webhook">Webhook GeoJSON</option>
                <option value="mqtt">Industrial MQTT</option>
                <option value="gtfs">GTFS-Realtime</option>
              </select>
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[16px] text-on-surface-variant pointer-events-none">
                tune
              </span>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-[16px] text-on-surface-variant pointer-events-none">
                arrow_drop_down
              </span>
            </div>

            {/* Telemetry Mesh State quick badge */}
            <div className="hidden xl:flex items-center gap-2 pl-space-xs text-on-surface-variant font-label-mono-sm text-label-mono-sm">
              <span className="material-symbols-outlined text-[16px] text-secondary">hub</span>
              <span>Mesh Topology: 6 Edge Relays Active</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => {
                refetch();
              }}
              className="h-9 px-3 rounded bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container transition-colors font-body-sm text-body-sm flex items-center gap-1.5"
              title="Force telemetry cycle refresh"
            >
              <span className="material-symbols-outlined text-[18px]">sync</span>
              <span className="hidden sm:inline">Poll Feeds</span>
            </button>
            <button
              className="h-9 px-3.5 rounded bg-surface-container-high text-on-surface-variant font-body-sm text-body-sm flex items-center gap-1.5 cursor-not-allowed opacity-75"
              disabled
              title="Requires Root Incident Commander authorization"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Register Source</span>
              <span className="ml-1 px-1 py-0.2 rounded bg-surface-dim font-label-mono-sm text-[10px] uppercase font-semibold text-on-surface-variant">
                Admin
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Overview Bento Strip */}
      <div className="px-space-lg py-space-sm grid grid-cols-2 lg:grid-cols-4 gap-space-sm">
        <div className="p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-caption text-caption uppercase tracking-wider">Ingestion Throughput (24h)</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">database</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">4.82 GB</span>
            <span className="font-label-mono-sm text-label-mono-sm text-tertiary-container font-medium">+14.2% vs avg</span>
          </div>
          <div className="mt-1 font-caption text-caption text-on-surface-variant">
            874,210 packets ingested across 12 nodes
          </div>
        </div>

        <div className="p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-caption text-caption uppercase tracking-wider">Mean Transport Latency</span>
            <span className="material-symbols-outlined text-[18px] text-tertiary-container">speed</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">384 ms</span>
            <span className="font-label-mono-sm text-label-mono-sm text-tertiary-container font-medium">Nominal (&lt;500ms)</span>
          </div>
          <div className="mt-1 font-caption text-caption text-on-surface-variant">
            Jitter threshold violated in 1 sub-region
          </div>
        </div>

        <div className="p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-caption text-caption uppercase tracking-wider">Schema Conformance</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">schema</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">99.96%</span>
            <span className="font-label-mono-sm text-label-mono-sm text-tertiary-container font-medium">1 minor drift</span>
          </div>
          <div className="mt-1 font-caption text-caption text-on-surface-variant">
            GeoJSON RFC 7946 &amp; RTMP H.264 stream parity
          </div>
        </div>

        <div className="p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-caption text-caption uppercase tracking-wider">Active Incident Bindings</span>
            <span className="material-symbols-outlined text-[18px] text-amber-800">link</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">8 Feeds</span>
            <span className="font-label-mono-sm text-label-mono-sm text-amber-800 font-medium">1 bound to INC-2048</span>
          </div>
          <div className="mt-1 font-caption text-caption text-on-surface-variant">
            Automated fusion triggering operational alerts
          </div>
        </div>
      </div>

      {/* Primary Workspace: Dense Ledger & Diagnosis Inspector Panel */}
      <div className="px-space-lg py-space-sm flex flex-col xl:flex-row gap-space-md items-start">
        {/* Ledger Container */}
        <div className="flex-1 w-full bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div className="px-space-md py-2.5 bg-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">data_table</span>
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">Registered Ingestion Nodes</span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-label-mono-sm text-label-mono-sm bg-surface-container-high text-on-surface-variant">
                6 active protocols
              </span>
            </div>
            <div className="flex items-center gap-space-sm">
              <span className="font-caption text-caption text-on-surface-variant">Sorted by: Latency / Alert Priority</span>
            </div>
          </div>

          {/* High-Density Ledger Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-caption text-caption uppercase tracking-wider text-[11px] h-9 select-none border-b border-outline-variant">
                  <th className="px-space-md font-semibold">Source Identifier &amp; Host</th>
                  <th className="px-space-sm font-semibold">Protocol / Standard</th>
                  <th className="px-space-sm font-semibold">Health State</th>
                  <th className="px-space-sm font-semibold">Cadence &amp; Jitter</th>
                  <th className="px-space-sm font-semibold">Last Sync</th>
                  <th className="px-space-sm font-semibold text-right">24h Vol</th>
                  <th className="px-space-sm font-semibold text-right">Error / Loss</th>
                  <th className="px-space-md font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50 text-on-surface font-body-sm text-body-sm">
                {filteredNodes.map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  const isDegraded = node.status === 'degraded';
                  return (
                    <tr
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? isDegraded
                            ? 'bg-amber-50/80 hover:bg-amber-100/60'
                            : 'bg-secondary-fixed/20 hover:bg-secondary-fixed/30'
                          : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <td className="px-space-md py-2.5">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`p-1 rounded mt-0.5 ${
                              isDegraded
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">{node.icon}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">
                                {node.name}
                              </span>
                              {isSelected && (
                                <span
                                  className={`px-1 py-0.2 rounded font-label-mono-sm text-[10px] font-semibold ${
                                    isDegraded
                                      ? 'bg-amber-200 text-amber-900'
                                      : 'bg-secondary-fixed text-on-secondary-fixed'
                                  }`}
                                >
                                  INSPECTING
                                </span>
                              )}
                            </div>
                            <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant truncate">
                              {node.host}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-space-sm py-2.5">
                        <div className="flex flex-col">
                          <span className="font-title-sm text-title-sm font-medium">{node.provider}</span>
                          <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant truncate">
                            {node.protocol}
                          </span>
                        </div>
                      </td>

                      <td className="px-space-sm py-2.5 whitespace-nowrap">
                        {node.status === 'healthy' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                            Healthy
                          </span>
                        ) : node.status === 'degraded' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm font-semibold bg-amber-100 text-amber-900">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                            Degraded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm font-semibold bg-error-container text-on-error-container">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                            Offline
                          </span>
                        )}
                      </td>

                      <td className="px-space-sm py-2.5">
                        <div className="flex flex-col">
                          <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-medium">
                            {node.cadence}
                          </span>
                          <span
                            className={`font-label-mono-sm text-label-mono-sm truncate ${
                              isDegraded ? 'text-amber-800 font-semibold' : 'text-on-surface-variant'
                            }`}
                          >
                            {node.latency}
                          </span>
                        </div>
                      </td>

                      <td className="px-space-sm py-2.5 whitespace-nowrap">
                        <span className="font-label-mono-sm text-label-mono-sm text-on-surface">{node.lastSync}</span>
                      </td>

                      <td className="px-space-sm py-2.5 text-right whitespace-nowrap">
                        <span className="font-label-mono-sm text-label-mono-sm font-medium">{node.volume24h}</span>
                      </td>

                      <td className="px-space-sm py-2.5 text-right whitespace-nowrap">
                        <span
                          className={`font-label-mono-sm text-label-mono-sm font-semibold ${
                            isDegraded
                              ? 'text-amber-800'
                              : node.errorRate === '0.00%'
                              ? 'text-tertiary-container'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {node.errorRate}
                        </span>
                      </td>

                      <td className="px-space-md py-2.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedNode(node);
                            }}
                            className={`p-1 rounded transition-colors ${
                              isSelected
                                ? 'bg-amber-200 text-amber-900'
                                : 'hover:bg-surface-container text-on-surface-variant'
                            }`}
                            title="Inspect Telemetry"
                          >
                            <span className="material-symbols-outlined text-[18px]">query_stats</span>
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded hover:bg-surface-container text-on-surface-variant"
                            title="View Config"
                          >
                            <span className="material-symbols-outlined text-[18px]">settings</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Ledger Footer Pagination / Metadata */}
          <div className="px-space-md py-2 bg-surface-container-low border-t border-outline-variant flex items-center justify-between font-caption text-caption text-on-surface-variant">
            <span>Showing {filteredNodes.length} of 12 configured streams across 4 districts</span>
            <div className="flex items-center gap-2">
              <span>Page 1 of 2</span>
              <button
                className="p-1 rounded bg-surface-container hover:bg-surface-container-high transition-colors disabled:opacity-50"
                disabled
              >
                <span className="material-symbols-outlined text-[14px]">chevron_left</span>
              </button>
              <button className="p-1 rounded bg-surface-container hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inspector / Diagnosis Drawer for Selected Feed */}
        <div className="w-full xl:w-[420px] bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm flex flex-col shrink-0 overflow-hidden">
          {/* Drawer Header */}
          <div className="p-space-md bg-surface-container flex items-center justify-between border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[18px] ${
                  selectedNode.status === 'degraded' ? 'text-amber-800' : 'text-tertiary-container'
                }`}
              >
                {selectedNode.status === 'degraded' ? 'warning' : 'verified'}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">Feed Diagnostics</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant truncate">
                  {selectedNode.name}
                </span>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm font-semibold uppercase ${
                selectedNode.status === 'degraded'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-tertiary-fixed text-on-tertiary-fixed'
              }`}
            >
              {selectedNode.status}
            </span>
          </div>

          {/* Main Diagnosis Body */}
          <div className="p-space-md flex flex-col gap-space-md">
            {/* Live Alert Banner */}
            <div
              className={`p-space-sm rounded flex flex-col gap-1 ${
                selectedNode.status === 'degraded' ? 'bg-amber-50 text-amber-950' : 'bg-surface-container-low text-on-surface'
              }`}
            >
              <div
                className={`flex items-center gap-1.5 font-title-sm text-title-sm font-semibold ${
                  selectedNode.status === 'degraded' ? 'text-amber-900' : 'text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {selectedNode.status === 'degraded' ? 'report_problem' : 'check_circle'}
                </span>
                <span>{selectedNode.inspectionTitle || 'Feed Running Within Tolerance'}</span>
              </div>
              <p className="font-body-sm text-body-sm">
                {selectedNode.inspectionDesc || 'Continuous telemetry ingestion operational.'}
              </p>
            </div>

            {/* Telemetry Attributes List */}
            <div className="flex flex-col gap-2 font-body-sm text-body-sm">
              <div className="flex items-center justify-between py-1 bg-surface-container-low px-2 rounded">
                <span className="text-on-surface-variant">Upstream Provider</span>
                <span className="font-title-sm text-title-sm text-on-surface font-medium truncate max-w-[220px]">
                  {selectedNode.upstreamProvider || selectedNode.provider}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 bg-surface-container-low px-2 rounded">
                <span className="text-on-surface-variant">Schema Standard</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold truncate max-w-[220px]">
                  {selectedNode.schemaStandard || selectedNode.protocol}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 bg-surface-container-low px-2 rounded">
                <span className="text-on-surface-variant">Transport Stream</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold truncate max-w-[220px]">
                  {selectedNode.transportStream || selectedNode.protocolDetails}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 bg-surface-container-low px-2 rounded">
                <span className="text-on-surface-variant">Relay Target Node</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface truncate max-w-[220px]">
                  {selectedNode.relayNode || 'edge-gateway-central-1.internal'}
                </span>
              </div>
            </div>

            {/* Sensor Camera Feed Snapshot / Spatial View */}
            {selectedNode.snapshotUrl && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                    Optical Sensor Telemetry Frame
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-amber-800">
                    {selectedNode.fieldAngle || 'Field Angle 244° WSW'}
                  </span>
                </div>
                <div className="relative w-full h-40 bg-surface-container-high rounded overflow-hidden border border-outline-variant">
                  <img
                    className="w-full h-full object-cover"
                    src={selectedNode.snapshotUrl}
                    alt="Surveillance Camera Telemetry"
                  />
                  <div className="absolute bottom-2 left-2 bg-primary/80 backdrop-blur-sm text-on-primary px-2 py-0.5 rounded font-label-mono-sm text-[10px]">
                    {selectedNode.id} [{selectedNode.latency}]
                  </div>
                  {selectedNode.status === 'degraded' && (
                    <div className="absolute top-2 right-2 bg-amber-600 text-on-primary px-1.5 py-0.5 rounded font-label-mono-sm text-[10px] font-bold">
                      FRAME LOSS: 3.8%
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Ingestion Runs Log */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                  Recent Ingestion Cycles
                </span>
                <span className="font-caption text-caption text-on-surface-variant">Past 30 mins</span>
              </div>
              <div className="flex flex-col gap-1 font-label-mono-sm text-label-mono-sm">
                {(selectedNode.recentRuns || [
                  { id: 'RUN-104', time: '10:24:12 EST', details: 'Sync OK • 1,420 frames • 820ms response', status: 'PASS' },
                  { id: 'RUN-103', time: '10:19:12 EST', details: 'Sync OK • 1,419 frames • 790ms response', status: 'PASS' },
                ]).map((run) => (
                  <div
                    key={run.id}
                    className={`p-2 rounded flex items-start justify-between ${
                      run.status === 'FAIL'
                        ? 'bg-amber-100 text-amber-950'
                        : 'bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className={`font-semibold ${run.status === 'FAIL' ? 'text-amber-900' : 'text-on-surface'}`}>
                        {run.id} ({run.time})
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">{run.details}</span>
                    </div>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        run.status === 'FAIL'
                          ? 'bg-amber-200 text-amber-950'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {run.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Linked Incidents */}
            <div className="flex flex-col gap-2">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                Active Impacted Incidents
              </span>
              <div className="flex flex-col gap-1.5">
                {(selectedNode.linkedIncidents || [
                  {
                    id: 'INC-2048',
                    title: 'Lower Riverside Inundation',
                    note: 'Primary Sensor Correlation',
                    badgeClass: 'bg-error-container text-on-error-container',
                  },
                ]).map((inc) => (
                  <Link
                    key={inc.id}
                    to={`/incidents/${inc.id}`}
                    className="p-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded font-label-mono-sm text-[11px] font-bold ${inc.badgeClass}`}>
                        {inc.id}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-title-sm text-title-sm text-on-surface font-semibold group-hover:text-secondary">
                          {inc.title}
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">{inc.note}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Remediation Actions Button Group */}
            <div className="flex flex-col gap-2 pt-space-xs">
              <button
                className="h-9 px-4 rounded bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-inverse-surface transition-colors flex items-center justify-center gap-2"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">build</span>
                <span>Request Field Maintenance Dispatch</span>
              </button>
              <button
                onClick={handleForceReconnect}
                disabled={reconnecting}
                className="h-9 px-4 rounded bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2"
                type="button"
              >
                <span className={`material-symbols-outlined text-[18px] ${reconnecting ? 'animate-spin' : ''}`}>
                  restart_alt
                </span>
                <span>{reconnecting ? 'Reconnecting Buffer...' : 'Force Stream Reconnect & Clear Buffer'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Realtime Telemetry Pulse Graph / Stream Health Summary */}
      <div className="px-space-lg py-space-md">
        <div className="p-space-md bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">monitoring</span>
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                24-Hour Telemetry Jitter &amp; Packet Ingestion Curve
              </span>
            </div>
            <div className="flex items-center gap-space-md font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-secondary rounded"></span> Ingest Packets (k/hr)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-amber-600 rounded"></span> Jitter Anomaly Index
              </span>
            </div>
          </div>

          {/* SVG Ingestion & Jitter Area Line Curve */}
          <div className="w-full h-32 pt-2">
            <svg viewBox="0 0 1000 120" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="ingestGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2a6194" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2a6194" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="1000" y2="20" stroke="#e1e3dd" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="1000" y2="60" stroke="#e1e3dd" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="1000" y2="100" stroke="#e1e3dd" strokeDasharray="3 3" />

              {/* Area */}
              <polygon
                points="0,100 0,85 80,82 160,78 240,65 320,70 400,50 480,45 560,35 640,40 720,25 800,28 880,32 960,30 1000,28 1000,100"
                fill="url(#ingestGradient)"
              />

              {/* Ingest Packets Line */}
              <polyline
                points="0,85 80,82 160,78 240,65 320,70 400,50 480,45 560,35 640,40 720,25 800,28 880,32 960,30 1000,28"
                fill="none"
                stroke="#2a6194"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Jitter Spike Line */}
              <polyline
                points="0,100 160,98 320,95 480,92 640,88 720,35 760,42 800,85 880,95 1000,97"
                fill="none"
                stroke="#a15c07"
                strokeWidth="2"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />

              {/* Jitter Spike Marker */}
              <circle cx="720" cy="35" r="4" fill="#a15c07" />
              <text x="725" y="30" fontSize="10" fontFamily="JetBrains Mono" fill="#a15c07" fontWeight="bold">
                Jitter Event (TF-04)
              </text>

              {/* X Axis labels */}
              <text x="5" y="116" fontSize="10" fontFamily="JetBrains Mono" fill="#747874">00:00</text>
              <text x="245" y="116" fontSize="10" fontFamily="JetBrains Mono" fill="#747874">06:00</text>
              <text x="495" y="116" fontSize="10" fontFamily="JetBrains Mono" fill="#747874">12:00</text>
              <text x="735" y="116" fontSize="10" fontFamily="JetBrains Mono" fill="#747874">18:00</text>
              <text x="965" y="116" fontSize="10" fontFamily="JetBrains Mono" fill="#747874">NOW</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
