import React from 'react';
import { Inbox, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'No signals or incident records match the active filter criteria.',
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`py-12 px-4 flex flex-col items-center justify-center text-center max-w-sm mx-auto ${className}`}>
      <div className="w-10 h-10 rounded-full bg-[#101827] border border-[#202e45] flex items-center justify-center text-slate-400 mb-3">
        {icon || <Inbox className="w-5 h-5 text-slate-500" />}
      </div>
      <h3 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">
        {title}
      </h3>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
        {description}
      </p>
      {action && (
        <Button
          variant="secondary"
          size="sm"
          onClick={action.onClick}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
