import React from 'react';
import { IncidentStatus } from '../../types';

interface StatusBadgeProps {
  status: IncidentStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'detected':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Detected
        </span>
      );
    case 'under_review':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Under Review
        </span>
      );
    case 'confirmed':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-red-500/15 text-red-400 border border-red-500/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          Confirmed
        </span>
      );
    case 'monitoring':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Monitoring
        </span>
      );
    case 'resolved':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Resolved
        </span>
      );
    case 'dismissed':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-slate-500/15 text-slate-400 border border-slate-500/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Dismissed
        </span>
      );
  }
};
