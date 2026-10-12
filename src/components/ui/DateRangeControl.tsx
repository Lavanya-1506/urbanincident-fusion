import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export type TimeRangePreset = '1h' | '6h' | '24h' | '7d' | 'surge_monsoon';

export interface DateRangeControlProps {
  value: TimeRangePreset;
  onChange: (value: TimeRangePreset) => void;
  className?: string;
}

export const DateRangeControl: React.FC<DateRangeControlProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const presets: Array<{ id: TimeRangePreset; label: string; desc: string }> = [
    { id: '1h', label: 'Last 1 Hour', desc: 'Real-time telemetry window' },
    { id: '6h', label: 'Last 6 Hours', desc: 'Monsoonal cloudburst timeline' },
    { id: '24h', label: 'Last 24 Hours', desc: 'Daily operational cycle' },
    { id: '7d', label: 'Past 7 Days', desc: 'Weekly recurrence baseline' },
    { id: 'surge_monsoon', label: 'Active Surge Scenario', desc: 'Ground-truth benchmark (12 Oct)' },
  ];

  const currentLabel = presets.find(p => p.id === value)?.label || 'Select Time Range';

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#080d16] hover:bg-[#101827] border border-[#202e45] text-xs font-mono text-slate-300 transition-colors shadow-sm"
      >
        <Calendar className="w-3.5 h-3.5 text-sky-400" />
        <span>{currentLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-1.5 w-60 rounded-md bg-[#0e1726] border border-[#22354e] shadow-2xl z-50 p-1.5 glass-panel animate-in fade-in duration-100">
            <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-slate-400 font-semibold border-b border-[#1c2c42] mb-1">
              Temporal Observation Window
            </div>
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onChange(preset.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded text-xs transition-colors flex flex-col ${
                  value === preset.id
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-medium'
                    : 'text-slate-300 hover:bg-[#162338]'
                }`}
              >
                <span className="font-semibold">{preset.label}</span>
                <span className="text-[10px] text-slate-400">{preset.desc}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
