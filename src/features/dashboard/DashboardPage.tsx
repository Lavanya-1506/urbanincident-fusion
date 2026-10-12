import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidentStore } from '../../store/incidentStore';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedIncidentId } = useIncidentStore();

  const [activeQueueFilter, setActiveQueueFilter] = useState<'All' | 'High / Critical' | 'Under Review' | 'Unassessed'>('All');
  const [timeRange, setTimeRange] = useState<'1 hr' | '6 hrs' | '24 hrs' | '7 days'>('6 hrs');

  const incidents = [
    {
      id: 'INC-2048',
      severity: 'High',
      severityBg: 'bg-[#FEFBE8]',
      severityText: 'text-[#A15C07]',
      severityDot: 'bg-[#A15C07]',
      status: 'Under Review',
      statusBg: 'bg-secondary-fixed',
      statusText: 'text-on-secondary-fixed-variant',
      time: 'Updated 4m ago',
      title: 'Possible localized flooding',
      location: 'Lower Riverside & 4th Avenue',
      assessment: 'Plauisble but uncertain (3 supporting / 0 contradictory / 1 missing)',
      telemetry: [
        { icon: 'water', label: '+0.84m level' },
        { icon: 'rainy', label: '38mm/h' },
      ],
    },
    {
      id: 'INC-2051',
      severity: 'Moderate',
      severityBg: 'bg-surface-container-high',
      severityText: 'text-on-surface',
      severityDot: 'bg-outline',
      status: 'Monitoring',
      statusBg: 'bg-tertiary-fixed',
      statusText: 'text-on-tertiary-fixed',
      time: 'Updated 12m ago',
      title: 'Traffic disruption & corridor slowdown',
      location: 'Crosstown Expressway & East Spine',
      assessment: 'Supported by 3 sensor telemetry streams (speed dropped from 65 to 18 km/h)',
      telemetry: [
        { icon: 'traffic', label: '18 km/h avg' },
        { icon: 'videocam', label: 'CCTV #312 online' },
      ],
    },
    {
      id: 'INC-2054',
      severity: 'Unassessed',
      severityBg: 'bg-surface-container-high',
      severityText: 'text-on-surface-variant',
      severityDot: 'bg-secondary',
      status: 'Under Review',
      statusBg: 'bg-secondary-fixed',
      statusText: 'text-on-secondary-fixed-variant',
      time: 'Updated 18m ago',
      title: 'Sensor anomaly & erratic pressure flux',
      location: 'North Station Water District Sub-station 9',
      assessment: 'Insufficient evidence — neighboring telemetry normal',
      telemetry: [
        { icon: 'sensors', label: 'Transducer Δ +14%' },
      ],
    },
    {
      id: 'INC-2057',
      severity: 'Low',
      severityBg: 'bg-surface-container',
      severityText: 'text-on-surface-variant',
      severityDot: 'bg-outline',
      status: 'Detected',
      statusBg: 'bg-surface-container-highest',
      statusText: 'text-on-surface-variant',
      time: 'Updated 27m ago',
      title: 'Conflicting public reports: power disruption',
      location: 'Civic Plaza Sector 2',
      assessment: 'Conflicting evidence (2 reports vs grid telemetric normal)',
      telemetry: [
        { icon: 'call', label: '2 citizen calls' },
      ],
    },
    {
      id: 'INC-2042',
      severity: 'Moderate',
      severityBg: 'bg-surface-container-high',
      severityText: 'text-on-surface',
      severityDot: 'bg-outline',
      status: 'Human Confirmed',
      statusBg: 'bg-tertiary-fixed',
      statusText: 'text-on-tertiary-fixed',
      time: 'Updated 45m ago',
      title: 'Structural clearance obstruction',
      location: 'Harbor Freight Line Km 18.2',
      assessment: 'Confirmed by transit field dispatch crew',
      telemetry: [
        { icon: 'train', label: 'Track #2 halted' },
      ],
    },
  ];

  const filteredIncidents = incidents.filter(inc => {
    if (activeQueueFilter === 'All') return true;
    if (activeQueueFilter === 'High / Critical') return inc.severity === 'High';
    if (activeQueueFilter === 'Under Review') return inc.status === 'Under Review';
    if (activeQueueFilter === 'Unassessed') return inc.severity === 'Unassessed';
    return true;
  });

  const handleInvestigate = (id: string) => {
    setSelectedIncidentId(id);
    navigate(`/incidents/${id}`);
  };

  return (
    <div className="p-space-lg max-w-7xl mx-auto space-y-space-lg select-none">
      {/* Page Header Strip (Stitch exact layout) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md border-b border-surface-container-high pb-space-md">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
            Operational Summary &amp; Triage Dashboard
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Real-time multi-source correlation &amp; city telemetry synthesis across Sector 4
          </p>
        </div>

        {/* Header Controls */}
        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Time Range Segmented Picker */}
          <div aria-label="Time Range" className="flex items-center bg-surface-container rounded p-0.5">
            {(['1 hr', '6 hrs', '24 hrs', '7 days'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 font-label-mono-sm text-label-mono-sm rounded transition-colors ${
                  timeRange === r
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-medium'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Auto-refresh Toggle */}
          <button 
            type="button" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-lowest text-on-surface font-body-sm text-body-sm hover:bg-surface-container transition-colors shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
            <span className="font-label-mono-sm text-label-mono-sm">Auto-refresh: 30s</span>
          </button>

          {/* Export Report */}
          <button 
            type="button" 
            onClick={() => alert('Operational Summary Exported to CSV.')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-lowest text-on-surface font-body-sm text-body-sm hover:bg-surface-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Report</span>
          </button>

          {/* Timestamp Badge */}
          <div className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-mono-sm text-label-mono-sm">
            Updated 10:42 AM EST
          </div>
        </div>
      </div>

      {/* Summary Metrics Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Active Incidents */}
        <div className="bg-surface-container-lowest rounded p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-caption text-caption uppercase tracking-wider font-semibold">Active Incidents</span>
            <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">14</span>
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">↑ 2 past 3h</span>
          </div>
          <div className="mt-space-xs text-on-surface-variant font-body-sm text-body-sm">
            Baseline operational volume normal
          </div>
        </div>

        {/* Critical / High Priority */}
        <div className="bg-surface-container-lowest rounded p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-caption text-caption uppercase tracking-wider font-semibold">Critical / High Priority</span>
            <span className="material-symbols-outlined text-[18px] text-error">priority_high</span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-[#A15C07] font-bold tracking-tight">3</span>
            <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-mono-sm text-label-mono-sm font-semibold">Alert</span>
          </div>
          <div className="mt-space-xs text-on-surface-variant font-body-sm text-body-sm">
            Requires immediate attention
          </div>
        </div>

        {/* Awaiting Review */}
        <div className="bg-surface-container-lowest rounded p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-caption text-caption uppercase tracking-wider font-semibold">Awaiting Review</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">pending_actions</span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">5</span>
            <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">Pending fusion</span>
          </div>
          <div className="mt-space-xs text-on-surface-variant font-body-sm text-body-sm">
            Evidence awaiting analyst confirmation
          </div>
        </div>

        {/* Data Sources Health */}
        <div className="bg-surface-container-lowest rounded p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-caption text-caption uppercase tracking-wider font-semibold">Data Sources Health</span>
            <span className="material-symbols-outlined text-[18px] text-[#A15C07]">sensors_off</span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-[#A15C07] font-bold tracking-tight">1</span>
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">Degraded</span>
          </div>
          <div className="mt-space-xs flex items-center justify-between font-body-sm text-body-sm">
            <span className="text-on-surface-variant truncate">TF-04 latency spike</span>
            <button onClick={() => navigate('/sources')} className="text-secondary hover:underline font-label-mono-sm text-label-mono-sm shrink-0">
              Sources →
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid (60% Queue / 40% Map & Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT COLUMN: Priority Incident Activity Queue (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30">
            {/* Queue Header */}
            <div className="p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-low rounded-t border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="font-title-md text-title-md text-on-surface font-semibold">Priority Incident Queue</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-mono-sm text-label-mono-sm font-medium">
                  {filteredIncidents.length} active
                </span>
              </div>
              {/* Queue Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {(['All', 'High / Critical', 'Under Review', 'Unassessed'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setActiveQueueFilter(f)}
                    className={`px-2.5 py-1 rounded-full font-caption text-caption transition-colors ${
                      activeQueueFilter === f
                        ? 'bg-primary text-on-primary font-medium'
                        : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Incident Items */}
            <div className="divide-y divide-surface-container-high">
              {filteredIncidents.map(inc => (
                <div key={inc.id} className="p-space-md hover:bg-surface-container-low/50 transition-colors">
                  <div className="flex items-start justify-between gap-space-sm mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-label-mono text-label-mono text-on-surface font-bold">{inc.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-label-mono-sm text-label-mono-sm ${inc.severityBg} ${inc.severityText} font-semibold flex items-center gap-1`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${inc.severityDot}`}></span>
                        {inc.severity}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-label-mono-sm text-label-mono-sm ${inc.statusBg} ${inc.statusText} font-semibold`}>
                        {inc.status}
                      </span>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant shrink-0">
                      {inc.time}
                    </span>
                  </div>

                  <h2 className="font-title-sm text-title-sm text-on-surface font-semibold">{inc.title}</h2>
                  <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span>{inc.location}</span>
                  </div>

                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 bg-surface-container-low p-2 rounded">
                    <strong className="font-medium text-on-surface">Telemetry Assessment:</strong> {inc.assessment}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {inc.telemetry.map((t, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                          <span className="material-symbols-outlined text-[14px]">{t.icon}</span>
                          <span>{t.label}</span>
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInvestigate(inc.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:bg-primary-container transition-colors shadow-xs"
                    >
                      Investigate →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Geographic Situation & Sources (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* Geographic Overview Map Card */}
          <div className="bg-surface-container-lowest rounded shadow-sm overflow-hidden flex flex-col border border-outline-variant/30">
            <div className="p-space-md flex items-center justify-between border-b border-surface-container-high bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="font-title-sm text-title-sm text-on-surface font-semibold">Geographic Overview</span>
                <span className="text-caption font-caption text-on-surface-variant">Sector 4</span>
              </div>
              <button 
                onClick={() => navigate('/map')}
                className="font-body-sm text-body-sm text-secondary hover:underline flex items-center gap-1 font-medium"
              >
                <span>Open Live Map</span>
                <span className="material-symbols-outlined text-[14px]">north_east</span>
              </button>
            </div>

            {/* Filter Layers Pill Group */}
            <div className="px-space-md py-2 flex items-center gap-1.5 bg-surface-container-lowest border-b border-surface-container-high overflow-x-auto">
              <span className="px-2 py-0.5 rounded text-[11px] font-label-mono-sm text-label-mono-sm bg-primary text-on-primary">Active (14)</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-label-mono-sm text-label-mono-sm bg-surface-container text-on-surface-variant">Sensor Overlays</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-label-mono-sm text-label-mono-sm bg-surface-container text-on-surface-variant">Weather Radar</span>
            </div>

            {/* Map Canvas Visual */}
            <div className="relative w-full h-80 bg-surface-container-high overflow-hidden select-none cursor-pointer" onClick={() => navigate('/map')}>
              <svg className="w-full h-full text-on-surface" fill="none" viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg">
                <rect fill="#EAECE6" height="320" width="500"></rect>
                <path d="M0 80H500M0 160H500M0 240H500M125 0V320M250 0V320M375 0V320" stroke="#DFE1DB" strokeDasharray="2 4" strokeWidth="1"></path>
                <polygon fill="#E2E5DE" opacity="0.8" points="40,20 220,15 240,110 30,95"></polygon>
                <text fill="#747874" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" letterSpacing="1" x="50" y="45">NORTH STATION</text>
                <polygon fill="#DCE0D8" opacity="0.9" points="250,20 480,25 460,150 250,130"></polygon>
                <text fill="#747874" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" letterSpacing="1" x="320" y="55">DOWNTOWN CORE</text>
                <polygon fill="#E6E8E2" opacity="0.85" points="40,110 240,125 240,210 25,190"></polygon>
                <text fill="#747874" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" letterSpacing="1" x="45" y="145">CROSSTOWN</text>
                <path d="M250 140 Q 300 200 480 210 L 480 310 L 220 310 Z" fill="#D3DCD6" opacity="0.75"></path>
                <text fill="#444844" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" letterSpacing="1" x="310" y="270">LOWER RIVERSIDE</text>
                <path d="M 235 0 C 240 80, 220 150, 260 210 C 290 255, 360 270, 500 280" fill="none" opacity="0.6" stroke="#92C5FD" strokeWidth="14"></path>
                {/* Active Incident Beacon on Mini Map */}
                <circle cx="340" cy="220" r="14" fill="#B42318" fillOpacity="0.25"></circle>
                <circle cx="340" cy="220" r="5" fill="#B42318"></circle>
              </svg>
            </div>

            <div className="p-space-sm bg-surface-container-low flex items-center justify-between text-on-surface-variant font-caption text-caption border-t border-outline-variant/30">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">my_location</span>
                <span>Center: 42.3601° N, 71.0589° W</span>
              </span>
              <span className="font-label-mono-sm text-label-mono-sm text-[10px]">Projection EPSG:3857</span>
            </div>
          </div>

          {/* Telemetry Freshness & Sources Health Card */}
          <div className="bg-surface-container-lowest rounded shadow-sm p-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary">sensors</span>
                <h3 className="font-title-sm text-title-sm text-on-surface font-semibold">Telemetry Freshness &amp; Sources</h3>
              </div>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">3 Healthy • 1 Issue</span>
            </div>

            <div className="flex flex-col divide-y divide-surface-container-high">
              {/* Source 1 */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container shrink-0"></span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-sm text-body-sm text-on-surface font-medium truncate">Public Traffic Sensors</span>
                    <span className="font-caption text-caption text-on-surface-variant">DOT Induction loop network</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-label-mono-sm text-label-mono-sm text-tertiary font-semibold">99.4% uptime</div>
                  <div className="font-caption text-caption text-on-surface-variant text-[11px]">Healthy</div>
                </div>
              </div>

              {/* Source 2 */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container shrink-0"></span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-sm text-body-sm text-on-surface font-medium truncate">Stormwater &amp; Hydrological Feeds</span>
                    <span className="font-caption text-caption text-on-surface-variant">USGS telemetry stations</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-label-mono-sm text-label-mono-sm text-tertiary font-semibold">Sync 42s ago</div>
                  <div className="font-caption text-caption text-on-surface-variant text-[11px]">Healthy</div>
                </div>
              </div>

              {/* Source 3: Degraded */}
              <div className="py-2.5 flex items-center justify-between gap-2 bg-[#FEFBE8]/40 px-2 -mx-2 rounded">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#A15C07] shrink-0 animate-ping"></span>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-body-sm text-body-sm text-on-surface font-medium truncate">Traffic Video Telemetry</span>
                      <span className="font-label-mono-sm text-[10px] px-1 bg-surface-container rounded text-on-surface-variant font-semibold">TF-04</span>
                    </div>
                    <span className="font-caption text-caption text-[#A15C07]">12 dropped packets • Latency spike</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-label-mono-sm text-label-mono-sm text-[#A15C07] font-semibold">4.2s latency</div>
                  <div className="font-caption text-caption text-[#A15C07] text-[11px] font-medium">Degraded</div>
                </div>
              </div>

              {/* Source 4 */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container shrink-0"></span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-sm text-body-sm text-on-surface font-medium truncate">Municipal 311 Public Dispatch</span>
                    <span className="font-caption text-caption text-on-surface-variant">Citizen reports integration</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">7 reports / 15m</div>
                  <div className="font-caption text-caption text-on-surface-variant text-[11px]">Normal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Velocity Trend Section */}
      <div className="bg-surface-container-lowest rounded shadow-sm p-space-md flex flex-col justify-between border border-outline-variant/30">
        <div className="flex items-center justify-between mb-space-sm">
          <div>
            <h3 className="font-title-sm text-title-sm text-on-surface font-semibold">Incident Velocity Trend</h3>
            <p className="font-caption text-caption text-on-surface-variant">Detections vs. Resolutions over 6 hours</p>
          </div>
          <div className="flex items-center gap-3 text-caption font-caption text-on-surface-variant">
            <div className="flex items-center gap-1">
              <span className="w-3 h-1 bg-primary rounded"></span>
              <span>Detections</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-1 bg-secondary rounded"></span>
              <span>Resolved</span>
            </div>
          </div>
        </div>
        <div className="w-full h-36 relative mt-2">
          <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 600 120">
            <line stroke="#E1E3DD" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="600" y1="20" y2="20"></line>
            <line stroke="#E1E3DD" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="600" y1="60" y2="60"></line>
            <line stroke="#E1E3DD" strokeWidth="1" x1="0" x2="600" y1="100" y2="100"></line>
            {/* Detection Trend Curve */}
            <path d="M 0,90 Q 150,70 300,50 T 600,25" fill="none" stroke="#1f2420" strokeWidth="2.5"></path>
            {/* Resolved Trend Curve */}
            <path d="M 0,105 Q 150,95 300,80 T 600,60" fill="none" stroke="#2a6194" strokeDasharray="4 4" strokeWidth="2"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};
