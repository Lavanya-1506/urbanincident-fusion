import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

export const CityLegend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const items = [
    { color: '#06b6d4', label: 'Waterlogging Inundation Zone', shape: 'square' },
    { color: '#f59e0b', label: 'Disrupted / Congested Road Segment', shape: 'line' },
    { color: '#ef4444', label: 'Critical Failure / Alarm (Pump Trip)', shape: 'circle' },
    { color: '#10b981', label: 'Healthy Operational Sensor', shape: 'circle' },
    { color: '#a855f7', label: 'Unverified Observation (Citizen Report)', shape: 'ring' },
    { color: '#38bdf8', label: 'Causal Correlation Arc', shape: 'arc' },
  ];

  return (
    <div className="rounded-lg bg-command-900/90 border border-command-700/80 backdrop-blur-md shadow-xl text-xs font-mono overflow-hidden transition-all">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-2 bg-command-950/80 cursor-pointer hover:bg-command-800/50"
      >
        <div className="flex items-center gap-2 text-command-200 font-bold">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>VISUAL ENCODINGS & LEGEND</span>
        </div>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-command-400" /> : <ChevronDown className="w-3.5 h-3.5 text-command-400" />}
      </div>

      {isOpen && (
        <div className="p-3 space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-[11px] text-command-300">
              {item.shape === 'square' && (
                <div 
                  className="w-3.5 h-3.5 rounded-sm border border-cyan-400/60" 
                  style={{ backgroundColor: item.color }} 
                />
              )}
              {item.shape === 'line' && (
                <div 
                  className="w-4 h-1 rounded" 
                  style={{ backgroundColor: item.color }} 
                />
              )}
              {item.shape === 'circle' && (
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }} 
                />
              )}
              {item.shape === 'ring' && (
                <div 
                  className="w-3.5 h-3.5 rounded-full border-2 border-dashed" 
                  style={{ borderColor: item.color }} 
                />
              )}
              {item.shape === 'arc' && (
                <div 
                  className="w-4 h-0.5 border-t-2 border-dotted" 
                  style={{ borderColor: item.color }} 
                />
              )}
              <span className="truncate">{item.label}</span>
            </div>
          ))}
          <div className="pt-1.5 border-t border-command-800 text-[10px] text-command-500">
            * All highlighted metrics are synthetic demo values labeled [SIMULATED].
          </div>
        </div>
      )}
    </div>
  );
};
