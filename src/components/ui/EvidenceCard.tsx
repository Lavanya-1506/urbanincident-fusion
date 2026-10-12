import React from 'react';
import { EvidenceItem } from '../../types';
import { Badge } from './Badge';
import { Tooltip } from './Tooltip';
import { Clock, Radio, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

export interface EvidenceCardProps {
  evidence: EvidenceItem;
  className?: string;
  onInspectRaw?: () => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  evidence,
  className = '',
  onInspectRaw,
}) => {
  const roleBadgeMap = {
    supporting: { label: 'Supporting Evidence', variant: 'success' as const },
    contradicting: { label: 'Contradicting Evidence', variant: 'warning' as const },
    contextual: { label: 'Contextual Baseline', variant: 'info' as const },
  };

  const roleMeta = roleBadgeMap[evidence.evidence_role];

  // Calculate ingestion delay/latency
  const occurredTime = new Date(evidence.occurred_at).getTime();
  const ingestedTime = new Date(evidence.ingested_at).getTime();
  const lagSeconds = Math.max(0, Math.round((ingestedTime - occurredTime) / 1000));

  return (
    <div className={`p-4 rounded-lg bg-[#0c1422] border border-[#1b273b] hover:border-[#2b3d5d] transition-all flex flex-col justify-between gap-3 ${className}`}>
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant={roleMeta.variant} size="xs" dot>
            {roleMeta.label}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-400">
              Weight: <span className="font-bold text-sky-400">{(evidence.confidence_score * 100).toFixed(0)}%</span>
            </span>
          </div>
        </div>

        <div className="text-xs font-semibold text-white flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="truncate">{evidence.source_name}</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
          {evidence.summary}
        </p>

        {evidence.raw_metric && (
          <div className="mt-2.5 p-2 rounded bg-[#080d16] border border-[#1b273b] font-mono text-[11px] text-sky-300">
            {evidence.raw_metric}
          </div>
        )}
      </div>

      {/* Provenance & Time Quality Section (PRD FR-09) */}
      <div className="pt-2.5 border-t border-[#162235] text-[10px] font-mono text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            Occurred: {new Date(evidence.occurred_at).toLocaleTimeString()} UTC
          </span>
          <span>Ingested: {new Date(evidence.ingested_at).toLocaleTimeString()} UTC</span>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <span className={lagSeconds > 120 ? 'text-amber-400' : 'text-slate-500'}>
            Ingestion Lag: {lagSeconds}s
          </span>

          {evidence.provenance_url && (
            <span className="text-sky-400 hover:underline cursor-pointer flex items-center gap-0.5" onClick={onInspectRaw}>
              <span>Provenance Ref</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          )}
        </div>

        {evidence.quality.flags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap pt-1">
            {evidence.quality.flags.map((flag, idx) => (
              <span key={idx} className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 text-[9px] border border-amber-500/30">
                {flag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
