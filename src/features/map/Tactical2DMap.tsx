import React from 'react';
import { Incident } from '../../types';
import { SeverityBadge } from '../../components/common/SeverityBadge';
import { OriginBadge } from '../../components/common/OriginBadge';
import { useUiStore } from '../../store/uiStore';
import { Droplet, AlertTriangle, Radio, Navigation } from 'lucide-react';

export const Tactical2DMap: React.FC<{
  incidents: Incident[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
}> = ({ incidents, selectedIncidentId, onSelectIncident }) => {
  const { layers } = useUiStore();

  // Project lat/lng to 2D SVG canvas (19.05 - 19.10 lat, 72.83 - 72.89 lng)
  const project = (lat: number, lng: number) => {
    const minLat = 19.050;
    const maxLat = 19.100;
    const minLng = 72.830;
    const maxLng = 72.890;

    const x = ((lng - minLng) / (maxLng - minLng)) * 1000;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 700;
    return { x, y };
  };

  return (
    <div className="w-full h-full relative bg-[#070b12] flex items-center justify-center overflow-hidden">
      {/* 2D Tactical SVG Canvas */}
      <svg viewBox="0 0 1000 700" className="w-full h-full select-none">
        <defs>
          <radialGradient id="inundationGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
          </radialGradient>
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#162235" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Tactical Grid Base */}
        <rect width="1000" height="700" fill="url(#gridPattern)" />

        {/* Coastal / Estuary Baseline */}
        <path
          d="M 50 50 Q 150 250 80 400 T 120 650 L 0 700 L 0 0 Z"
          fill="#0c1828"
          stroke="#1e3a5f"
          strokeWidth="1.5"
        />

        {/* Primary Arterial Roads */}
        <g stroke="#1e2c45" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          {/* Western Express Arterial */}
          <path d="M 120 620 L 350 480 L 620 320 L 850 120" stroke="#2a3f61" strokeWidth="8" />
          {/* East-West Connector */}
          <path d="M 220 200 L 480 340 L 780 440 L 920 480" stroke="#223350" strokeWidth="6" />
          {/* Central Ring */}
          <circle cx="580" cy="340" r="90" fill="none" stroke="#223350" strokeWidth="5" />
        </g>

        {/* Inundation Water Hazard Zones */}
        {layers.waterFloodExtents && (
          <g>
            {/* Junction 14 Severe Flood Pool */}
            <ellipse cx="610" cy="330" rx="90" ry="70" fill="url(#inundationGlow)" />
            <circle cx="610" cy="330" r="45" fill="#00f2fe" fillOpacity="0.25" stroke="#00f2fe" strokeWidth="1.5" strokeDasharray="4 2" />
          </g>
        )}

        {/* IoT Water Level Sensors */}
        {layers.waterSensors && (
          <g>
            <g transform="translate(610, 310)">
              <circle r="7" fill="#00f2fe" />
              <circle r="14" fill="none" stroke="#00f2fe" strokeWidth="1" opacity="0.6" />
              <text x="14" y="4" fill="#a5f3fc" fontSize="11" fontFamily="monospace">US-402-A (48.5cm)</text>
            </g>
            <g transform="translate(560, 360)">
              <circle r="7" fill="#ef4444" />
              <text x="14" y="4" fill="#fca5a5" fontSize="11" fontFamily="monospace">Pump Station 4 (TRIPPED)</text>
            </g>
          </g>
        )}

        {/* Incidents Markers on 2D Map */}
        {incidents.map((inc) => {
          const { x, y } = project(inc.location.latitude, inc.location.longitude);
          const isSelected = inc.id === selectedIncidentId;
          const color = inc.severity === 'critical' ? '#ef4444' : inc.severity === 'high' ? '#f59e0b' : '#3b82f6';

          return (
            <g 
              key={inc.id} 
              transform={`translate(${x}, ${y})`}
              className="cursor-pointer group"
              onClick={() => onSelectIncident(inc.id)}
            >
              {/* Outer Pulsing Ring */}
              <circle 
                r={isSelected ? "22" : "16"} 
                fill={color} 
                fillOpacity={isSelected ? "0.3" : "0.15"} 
                stroke={color} 
                strokeWidth={isSelected ? "2" : "1"} 
              />
              {/* Center Dot */}
              <circle r="6" fill={color} />

              {/* Callout Box */}
              <g transform="translate(24, -14)">
                <rect 
                  width="180" 
                  height="38" 
                  rx="6" 
                  fill="#0a0f18" 
                  fillOpacity="0.92" 
                  stroke={isSelected ? "#00f2fe" : "#1e2c45"} 
                  strokeWidth={isSelected ? "1.5" : "1"} 
                />
                <text x="8" y="16" fill="#00f2fe" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {inc.id}
                </text>
                <text x="8" y="30" fill="#e2e8f0" fontSize="10" fontWeight="500">
                  {inc.title.slice(0, 24)}...
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
