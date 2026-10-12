import React from 'react';
import { IncidentSeverity } from '../../types';
import { Tooltip } from './Tooltip';

export interface IncidentSeverityIndicatorProps {
  severity: IncidentSeverity;
  showTooltip?: boolean;
  className?: string;
}

export const IncidentSeverityIndicator: React.FC<IncidentSeverityIndicatorProps> = ({
  severity,
  showTooltip = true,
  className = '',
}) => {
  const meta = {
    critical: {
      label: 'Critical',
      color: 'bg-red-500/15 text-red-400 border-red-500/35',
      dot: 'bg-red-500',
      tooltip: 'Tier 3 Emergency: Direct threat to life, major corridor severance or infrastructure failure.',
    },
    high: {
      label: 'High',
      color: 'bg-amber-500/15 text-amber-400 border-amber-500/35',
      dot: 'bg-amber-400',
      tooltip: 'Tier 2 Severe: Rapid water level rise crossing warning crest, multiple transit delays.',
    },
    medium: {
      label: 'Medium',
      color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
      dot: 'bg-yellow-400',
      tooltip: 'Tier 1 Moderate: Localized ponding or localized traffic slowdown without blockage.',
    },
    low: {
      label: 'Low',
      color: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      dot: 'bg-slate-400',
      tooltip: 'Advisory / Contextual observation requiring standard monitoring.',
    },
  }[severity];

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase font-semibold border select-none ${meta.color} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} ${severity === 'critical' ? 'animate-pulse' : ''}`} />
      <span>{meta.label}</span>
    </span>
  );

  if (!showTooltip) return content;

  return (
    <Tooltip content={meta.tooltip} position="top">
      {content}
    </Tooltip>
  );
};
