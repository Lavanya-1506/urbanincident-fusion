import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ArrowRight, 
  Droplets, 
  Car, 
  Users, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Activity,
  Layers
} from 'lucide-react';
import { Incident } from '../../types';
import { SeverityBadge } from '../../components/common/SeverityBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { OriginBadge } from '../../components/common/OriginBadge';

interface IncidentQuickDrawerProps {
  incident: Incident | null;
  onClose: () => void;
}

export const IncidentQuickDrawer: React.FC<IncidentQuickDrawerProps> = ({ incident, onClose }) => {
  const navigate = useNavigate();

  if (!incident) return null;

  return (
    <div className="absolute top-4 right-4 z-20 w-96 bg-command-900/95 border border-command-700 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden glass-panel animate-in slide-in-from-right-8 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-command-800 bg-command-950/70 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-mono text-xs font-bold text-cyan-400">{incident.id}</span>
            <SeverityBadge severity={incident.severity} />
            <StatusBadge status={incident.status} />
          </div>
          <h3 className="text-sm font-semibold text-white leading-snug">{incident.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-command-400 hover:text-white hover:bg-command-800 shrink-0 ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Information */}
      <div className="p-4 space-y-4 text-xs">
        {/* Origin disclosure */}
        <div className="flex items-center justify-between pb-2 border-b border-command-800/80">
          <span className="text-[11px] text-command-400">Data Origin:</span>
          <OriginBadge origin={incident.origin} />
        </div>

        {/* Location & Time */}
        <div className="space-y-1.5 text-command-300">
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span className="leading-tight">{incident.location.address || 'Urban Grid Coordinates'}</span>
          </div>
          <div className="flex items-center gap-2 text-command-400 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-command-400" />
            <span>Detected: {new Date(incident.detected_at).toLocaleTimeString()} UTC</span>
          </div>
        </div>

        {/* Live Aggregated Operational Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg bg-command-850/80 border border-command-800">
            <div className="flex items-center gap-1 text-[10px] text-command-400 mb-1">
              <Droplets className="w-3 h-3 text-cyan-400" />
              <span>Water Depth</span>
            </div>
            <div className="text-sm font-bold font-mono text-cyan-300">
              {incident.metrics.water_level_cm ? `${incident.metrics.water_level_cm} cm` : 'N/A'}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-command-850/80 border border-command-800">
            <div className="flex items-center gap-1 text-[10px] text-command-400 mb-1">
              <Car className="w-3 h-3 text-amber-400" />
              <span>Speed Index</span>
            </div>
            <div className="text-sm font-bold font-mono text-amber-300">
              {incident.metrics.traffic_speed_kmh ? `${incident.metrics.traffic_speed_kmh} km/h` : 'N/A'}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-command-850/80 border border-command-800">
            <div className="flex items-center gap-1 text-[10px] text-command-400 mb-1">
              <Users className="w-3 h-3 text-purple-400" />
              <span>Reports</span>
            </div>
            <div className="text-sm font-bold font-mono text-purple-300">
              {incident.metrics.citizen_reports_count}
            </div>
          </div>
        </div>

        {/* Fusion Summary Snippet */}
        <div className="p-2.5 rounded-lg bg-command-950/60 border border-command-800/80">
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1">
            <span>FUSION ASSESSMENT V{(incident.assessment_versions?.[0]?.version || 1)}</span>
            <span>Conf: {(incident.confidence * 100).toFixed(0)}%</span>
          </div>
          <p className="text-[11px] text-command-200 leading-relaxed">
            {incident.assessment_versions?.[0]?.summary || 
             'Correlated precipitation, drainage pressure, and transit slowdown into a unified incident cluster.'}
          </p>
        </div>

        {/* CTA Button to Full Investigation Workspace */}
        <button
          onClick={() => navigate(`/incidents/${incident.id}`)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-command-950 font-bold transition-all shadow-glow-cyan"
        >
          <span>Open Full Investigation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
