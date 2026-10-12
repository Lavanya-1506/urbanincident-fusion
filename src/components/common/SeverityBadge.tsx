import React from 'react';
import { IncidentSeverity } from '../../types';

interface SeverityBadgeProps {
  severity: IncidentSeverity;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className = '' }) => {
  switch (severity) {
    case 'critical':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-red-500/20 text-red-400 border border-red-500/40 shadow-glow-red ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping-slow" />
          Critical
        </span>
      );
    case 'high':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-glow-amber ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          High
        </span>
      );
    case 'medium':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          Medium
        </span>
      );
    case 'low':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-slate-500/20 text-slate-300 border border-slate-500/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Low
        </span>
      );
  }
};
