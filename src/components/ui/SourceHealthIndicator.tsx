import React from 'react';
import { DataSourceHealth } from '../../types';
import { StatusIndicator } from './StatusIndicator';
import { Tooltip } from './Tooltip';

export interface SourceHealthIndicatorProps {
  source: DataSourceHealth;
  compact?: boolean;
  className?: string;
}

export const SourceHealthIndicator: React.FC<SourceHealthIndicatorProps> = ({
  source,
  compact = false,
  className = '',
}) => {
  const statusMap = {
    healthy: 'healthy' as const,
    degraded: 'warning' as const,
    stale: 'critical' as const,
    critical: 'critical' as const,
  };

  const tooltipContent = (
    <div className="space-y-1 text-[11px]">
      <div className="font-semibold text-white">{source.name}</div>
      <div className="text-slate-300 font-mono">
        Protocol: {source.protocol} | Freshness: {source.freshness_seconds}s
      </div>
      <div className="text-slate-400">
        Throughput: {source.events_per_minute} events/min | Error: {source.error_rate_pct}%
      </div>
      {source.active_warnings.length > 0 && (
        <div className="text-amber-300 text-[10px] pt-1 border-t border-[#23354d]">
          {source.active_warnings.join(' • ')}
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="top">
      <div className={`inline-flex items-center gap-2 cursor-help select-none ${className}`}>
        <StatusIndicator status={statusMap[source.status]} pulse={source.status === 'stale'} />
        {!compact && (
          <span className="text-xs font-mono text-slate-300 capitalize">
            {source.status}
          </span>
        )}
        <span className="px-1.5 py-0.5 rounded bg-[#101827] border border-[#23354e] text-[10px] font-mono text-slate-400">
          {source.freshness_seconds}s lag
        </span>
      </div>
    </Tooltip>
  );
};
