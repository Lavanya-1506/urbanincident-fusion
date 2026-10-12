import React from 'react';

export interface StatusIndicatorProps {
  status: 'healthy' | 'critical' | 'warning' | 'info' | 'neutral';
  pulse?: boolean;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  label?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  pulse = false,
  size = 'sm',
  className = '',
  label,
}) => {
  const colorMap = {
    healthy: 'bg-emerald-400',
    critical: 'bg-red-500',
    warning: 'bg-amber-400',
    info: 'bg-sky-400',
    neutral: 'bg-slate-400',
  };

  const pingMap = {
    healthy: 'bg-emerald-400',
    critical: 'bg-red-500',
    warning: 'bg-amber-400',
    info: 'bg-sky-400',
    neutral: 'bg-slate-400',
  };

  const sizeMap = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="relative flex shrink-0">
        {pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pingMap[status]}`} />
        )}
        <span className={`relative inline-flex rounded-full ${sizeMap[size]} ${colorMap[status]}`} />
      </span>
      {label && <span className="text-xs text-slate-300 font-sans">{label}</span>}
    </span>
  );
};
