import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Tooltip } from './Tooltip';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number; // percentage
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  contextualLabel?: string;
  tooltipText?: string;
  statusVariant?: 'default' | 'critical' | 'warning' | 'success';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  trend,
  contextualLabel,
  tooltipText,
  statusVariant = 'default',
  className = '',
}) => {
  const variantBorders = {
    default: 'border-[#1b273b]',
    critical: 'border-red-500/40 shadow-glow-red',
    warning: 'border-amber-500/40',
    success: 'border-emerald-500/40',
  };

  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-slate-400',
  };

  const TrendIcon = trend?.direction === 'up' 
    ? TrendingUp 
    : trend?.direction === 'down' 
    ? TrendingDown 
    : Minus;

  return (
    <div className={`p-4 rounded-lg bg-[#0c1422] border ${variantBorders[statusVariant]} flex flex-col justify-between transition-all ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 truncate font-medium">
          {label}
        </span>
        {tooltipText && (
          <Tooltip content={tooltipText}>
            <span className="cursor-help text-slate-500 hover:text-slate-300 text-[10px] font-mono">
              [?]
            </span>
          </Tooltip>
        )}
      </div>

      {/* Primary Value */}
      <div className="my-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold font-mono text-white tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-slate-400 font-normal">
            {unit}
          </span>
        )}
      </div>

      {/* Footer / Trend */}
      <div className="flex items-center justify-between text-[11px] font-sans pt-1 border-t border-[#162235]">
        {trend ? (
          <div className={`flex items-center gap-1 font-mono text-[11px] ${trendColors[trend.direction]}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{trend.value > 0 ? `+${trend.value}%` : `${trend.value}%`}</span>
            {trend.label && <span className="text-slate-500 font-sans ml-1">{trend.label}</span>}
          </div>
        ) : (
          <span className="text-slate-500 text-[11px] truncate">
            {contextualLabel || 'Operational reading'}
          </span>
        )}

        {contextualLabel && trend && (
          <span className="text-slate-500 text-[10px] truncate">
            {contextualLabel}
          </span>
        )}
      </div>
    </div>
  );
};
