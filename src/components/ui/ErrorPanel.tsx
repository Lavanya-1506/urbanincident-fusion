import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorPanelProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorPanel: React.FC<ErrorPanelProps> = ({
  title = 'Telemetry Ingestion Error',
  message = 'An unexpected failure occurred while fetching real-time operational feeds.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-4 rounded-lg bg-red-950/20 border border-red-500/30 text-xs text-red-200 flex items-start gap-3 ${className}`}>
      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="font-semibold text-red-300 font-mono text-xs">{title}</div>
        <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{message}</p>
        {onRetry && (
          <Button
            variant="danger"
            size="xs"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-3 h-3" />}
            className="mt-2"
          >
            Retry Request
          </Button>
        )}
      </div>
    </div>
  );
};
