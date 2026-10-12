import React from 'react';
import { Tooltip } from './Tooltip';

export interface ConfidenceIndicatorProps {
  score: number; // 0.0 - 1.0
  evidenceCount?: number;
  className?: string;
  showBar?: boolean;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  evidenceCount,
  className = '',
  showBar = true,
}) => {
  const percentage = Math.round(score * 100);

  // Calibrated certainty level based on PRD rule 5
  const getCertaintyLabel = () => {
    if (score >= 0.90) return 'High Certainty';
    if (score >= 0.70) return 'Moderate Certainty';
    return 'Low / Tentative Candidate';
  };

  const getBarColor = () => {
    if (score >= 0.90) return 'bg-emerald-400';
    if (score >= 0.70) return 'bg-sky-400';
    return 'bg-amber-400';
  };

  const tooltipExplanation = (
    <div className="space-y-1 text-[11px] p-0.5">
      <div className="font-semibold text-white">
        Fusion Confidence: {percentage}% ({getCertaintyLabel()})
      </div>
      <p className="text-slate-300">
        Statistical convergence derived from spatial-temporal proximity, multi-source sensor agreement, and Bayesian prior calibration.
      </p>
      {evidenceCount !== undefined && (
        <div className="text-[10px] text-sky-300 font-mono pt-0.5 border-t border-[#23354d]">
          Backed by {evidenceCount} verified evidence sources.
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipExplanation} position="top">
      <div className={`inline-flex items-center gap-2 select-none cursor-help ${className}`}>
        {showBar && (
          <div className="w-12 h-1.5 bg-[#141e30] rounded-full overflow-hidden border border-[#22334d]">
            <div
              className={`h-full ${getBarColor()} transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
        <span className="font-mono text-xs font-semibold text-slate-200">
          {percentage}%
        </span>
      </div>
    </Tooltip>
  );
};
