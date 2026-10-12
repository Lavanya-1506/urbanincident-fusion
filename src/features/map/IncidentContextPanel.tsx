import React from 'react';
import { X, ExternalLink, AlertTriangle, ShieldCheck, Activity, Radio } from 'lucide-react';
import { ScenarioTickData } from './types';
import { Link } from 'react-router-dom';

interface IncidentContextPanelProps {
  currentTick: ScenarioTickData;
  selectedSensorId: string | null;
  onClose: () => void;
}

export const IncidentContextPanel: React.FC<IncidentContextPanelProps> = ({
  currentTick,
  selectedSensorId,
  onClose,
}) => {
  return (
    <div className="w-80 h-full bg-command-900/95 border-l border-command-700/80 backdrop-blur-md flex flex-col font-mono text-xs shadow-2xl z-20">
      {/* Header */}
      <div className="p-3 border-b border-command-800 flex items-center justify-between bg-command-950/80">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white uppercase text-[11px]">Synchronized Telemetry</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-command-400 hover:text-white hover:bg-command-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Incident Summary Card */}
        <div className="p-3 rounded-lg bg-command-950 border border-command-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-400">INC-2026-8841</span>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
              currentTick.incidentSeverity === 'critical' 
                ? 'bg-rose-950 border border-rose-600 text-rose-300' 
                : currentTick.incidentSeverity === 'high' 
                  ? 'bg-amber-950 border border-amber-600 text-amber-300' 
                  : 'bg-cyan-950 border border-cyan-600 text-cyan-300'
            }`}>
              {currentTick.incidentSeverity}
            </span>
          </div>
          <div className="text-white font-semibold text-xs">
            Junction 14 Underpass Flash Flood
          </div>
          <div className="text-[10px] text-command-400">
            Stage: <span className="text-command-200 capitalize">{currentTick.tickLabel} - {currentTick.title}</span>
          </div>
          <div className="pt-2 border-t border-command-800/80 flex items-center justify-between text-[11px]">
            <span className="text-command-400">Causal Confidence</span>
            <span className="text-emerald-400 font-bold">{(currentTick.incidentConfidence * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Selected Sensor Telemetry if any */}
        {selectedSensorId && (
          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/40 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>INSPECTED SENSOR NODE</span>
            </div>
            <div className="text-white font-bold">{selectedSensorId}</div>
            <div className="text-[10px] text-command-400">
              Source verified against GIS topology. Simulated signal broadcast active.
            </div>
          </div>
        )}

        {/* Live Scenario Telemetry */}
        <div className="space-y-2">
          <span className="text-[10px] text-command-500 font-bold uppercase tracking-wider">
            Real-Time State Telemetry [SIMULATED]
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded bg-command-950 border border-command-800">
              <div className="text-[10px] text-command-400">Rainfall Rate</div>
              <div className="text-sm font-bold text-cyan-300 mt-0.5">{currentTick.rainfallMmH} mm/h</div>
            </div>
            <div className="p-2 rounded bg-command-950 border border-command-800">
              <div className="text-[10px] text-command-400">Water Depth</div>
              <div className="text-sm font-bold text-amber-300 mt-0.5">{currentTick.waterDepthCm} cm</div>
            </div>
            <div className="p-2 rounded bg-command-950 border border-command-800">
              <div className="text-[10px] text-command-400">Traffic Speed</div>
              <div className="text-sm font-bold text-rose-300 mt-0.5">{currentTick.trafficSpeedKmh} km/h</div>
            </div>
            <div className="p-2 rounded bg-command-950 border border-command-800">
              <div className="text-[10px] text-command-400">Pump Status</div>
              <div className={`text-sm font-bold mt-0.5 ${currentTick.isPumpTripped ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentTick.isPumpTripped ? 'TRIPPED' : 'NOMINAL'}
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Causal Evidence */}
        <div className="space-y-2">
          <span className="text-[10px] text-command-500 font-bold uppercase tracking-wider">
            Active Evidence Signals ({currentTick.activeSensors.length})
          </span>
          <div className="space-y-1.5">
            {currentTick.activeSensors.map((sensorId) => (
              <div key={sensorId} className="p-2 rounded bg-command-950/80 border border-command-800 text-[11px] flex items-center justify-between">
                <span className="text-command-200">{sensorId}</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
            ))}
          </div>
        </div>

        {/* Causal Graph Relationships */}
        {currentTick.activeLinks.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] text-command-500 font-bold uppercase tracking-wider">
              Causal Relationships ({currentTick.activeLinks.length})
            </span>
            <div className="space-y-1.5">
              {currentTick.activeLinks.map((link) => (
                <div key={link.id} className="p-2 rounded bg-command-950 border border-command-800 space-y-1">
                  <div className="text-white font-semibold text-[11px]">{link.label}</div>
                  <div className="flex items-center justify-between text-[10px] text-command-400">
                    <span className="capitalize">{link.relationType.replace(/_/g, ' ')}</span>
                    <span className="text-cyan-400 font-bold">{(link.confidence * 100).toFixed(0)}% Conf</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation to Detailed Investigation */}
      <div className="p-3 border-t border-command-800 bg-command-950">
        <Link
          to="/incidents/INC-2026-8841"
          className="w-full py-2 px-3 rounded bg-cyan-600 hover:bg-cyan-500 text-command-950 font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Open Full Investigation</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
