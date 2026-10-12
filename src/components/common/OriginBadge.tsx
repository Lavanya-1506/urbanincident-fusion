import React from 'react';
import { DataOrigin } from '../../types';

interface OriginBadgeProps {
  origin: DataOrigin;
  className?: string;
  showTooltip?: boolean;
}

export const OriginBadge: React.FC<OriginBadgeProps> = ({ origin, className = '' }) => {
  switch (origin) {
    case 'real_backend':
      return (
        <span 
          title="Verified observation received from production municipal infrastructure" 
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium tracking-wide bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          REAL FEED
        </span>
      );
    case 'imported_dataset':
      return (
        <span 
          title="Historical sensor/complaint record from verified municipal archive" 
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium tracking-wide bg-blue-500/15 text-blue-400 border border-blue-500/30 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          IMPORTED DATASET
        </span>
      );
    case 'synthetic_demo':
      return (
        <span 
          title="Generated synthetic test case for validation and training - not a real-world incident" 
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium tracking-wide bg-purple-500/15 text-purple-400 border border-purple-500/30 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          SYNTHETIC DEMO
        </span>
      );
    case 'simulated_scenario':
      return (
        <span 
          title="Reproducible monsoonal surge simulation record" 
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium tracking-wide bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-subtle" />
          SIMULATED SCENARIO
        </span>
      );
    case 'model_hypothesis':
      return (
        <span 
          title="Causal reasoning engine output" 
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/30 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          MODEL HYPOTHESIS
        </span>
      );
    default:
      return null;
  }
};
