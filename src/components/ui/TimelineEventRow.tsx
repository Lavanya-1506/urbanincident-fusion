import React from 'react';
import { CanonicalEvent } from '../../types';
import { Badge } from './Badge';
import { Clock, Radio, Layers, Copy } from 'lucide-react';

export interface TimelineEventRowProps {
  event: CanonicalEvent;
  isLatest?: boolean;
  onInspectPayload?: (event: CanonicalEvent) => void;
  className?: string;
}

export const TimelineEventRow: React.FC<TimelineEventRowProps> = ({
  event,
  isLatest = false,
  onInspectPayload,
  className = '',
}) => {
  return (
    <div className={`flex items-start gap-3 py-2.5 px-3 rounded-md border border-transparent hover:bg-[#0f1726] hover:border-[#1e2c45] transition-colors group ${className}`}>
      {/* Timeline Node Point */}
      <div className="flex flex-col items-center shrink-0 mt-1">
        <span className={`w-2.5 h-2.5 rounded-full border-2 border-[#070b12] ${
          isLatest ? 'bg-sky-400 ring-2 ring-sky-400/40' : 'bg-slate-500'
        }`} />
        <span className="w-0.5 h-full bg-[#1b273b] mt-1" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-sky-400">{event.event_id}</span>
            <span className="text-xs font-semibold text-white truncate">{event.event_type}</span>
            {event.is_duplicate && (
              <Badge variant="purple" size="xs">
                Clustered Duplicate
              </Badge>
            )}
          </div>

          <span className="font-mono text-[11px] text-slate-400 shrink-0">
            {new Date(event.occurred_at).toLocaleTimeString()} UTC
          </span>
        </div>

        <div className="text-[11px] text-slate-300 font-mono flex items-center gap-3">
          <span>Source: <span className="text-slate-400">{event.source_id}</span></span>
          <span className="text-slate-600">|</span>
          <span>Record: <span className="text-slate-400">{event.source_record_id}</span></span>
        </div>

        {event.payload && Object.keys(event.payload).length > 0 && (
          <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="truncate max-w-md">
              {JSON.stringify(event.payload).slice(0, 70)}...
            </span>
            {onInspectPayload && (
              <button
                type="button"
                onClick={() => onInspectPayload(event)}
                className="text-sky-400 hover:text-sky-300 text-[10px] uppercase font-semibold underline shrink-0 ml-2"
              >
                Inspect
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
