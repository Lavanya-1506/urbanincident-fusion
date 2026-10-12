import React, { useMemo, useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Node, 
  Edge,
  MarkerType,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Incident } from '../../types';
import { Layers, GitBranch, Info, X } from 'lucide-react';

interface IncidentRelationshipGraphProps {
  incident: Incident;
}

interface SelectedNodeMetadata {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  details: Record<string, any>;
  relationNature: 'directly_observed' | 'algorithmically_inferred' | 'hypothesis';
}

export const IncidentRelationshipGraph: React.FC<IncidentRelationshipGraphProps> = ({ incident }) => {
  const [selectedNodeData, setSelectedNodeData] = useState<SelectedNodeMetadata | null>(null);

  const { nodes, edges } = useMemo(() => {
    const n: Node[] = [];
    const e: Edge[] = [];

    // 1. Central Incident Core Node
    const incidentNodeId = 'node_incident';
    n.push({
      id: incidentNodeId,
      position: { x: 420, y: 160 },
      data: { 
        label: (
          <div className="p-3 rounded-lg bg-[#0e1726] border-2 border-sky-400 shadow-glow-cyan text-xs text-left min-w-[220px]">
            <div className="font-mono text-[10px] text-sky-400 font-bold uppercase flex items-center justify-between">
              <span>INCIDENT CORE</span>
              <span className="text-white text-[9px]">[ENTITY]</span>
            </div>
            <div className="font-bold text-white text-xs mt-1 truncate">{incident.id}</div>
            <div className="text-[10px] text-slate-300 mt-0.5">{incident.title}</div>
            <div className="mt-1.5 pt-1.5 border-t border-[#1e2d44] flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">Status: <strong className="text-emerald-400 uppercase">{incident.status}</strong></span>
              <span className="text-sky-300">{(incident.confidence * 100).toFixed(0)}% Conf</span>
            </div>
          </div>
        ),
        meta: {
          id: incident.id,
          type: 'Incident Entity',
          title: incident.title,
          subtitle: `Status: ${incident.status.toUpperCase()} | Severity: ${incident.severity.toUpperCase()}`,
          details: {
            'Confidence Score': `${(incident.confidence * 100).toFixed(0)}%`,
            'Location Address': incident.location.address || 'Central District',
            'First Observed': incident.first_observed_at,
            'Assigned Operator': incident.assigned_to || 'Unassigned',
          },
          relationNature: 'directly_observed'
        }
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    // 2. Left Column: Multi-Source Observations & Feeds
    const evidenceList = incident.evidence?.slice(0, 5) || [];
    evidenceList.forEach((ev, idx) => {
      const evNodeId = `node_ev_${ev.id}`;
      const yOffset = 30 + idx * 95;
      
      const isSupporting = ev.evidence_role === 'supporting';
      const borderClass = isSupporting ? 'border-emerald-500/70' : 'border-amber-500/70';
      const badgeClass = isSupporting ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60';

      n.push({
        id: evNodeId,
        position: { x: 30, y: yOffset },
        data: {
          label: (
            <div className={`p-2.5 rounded-lg bg-[#0c1422] border ${borderClass} text-xs text-left w-[240px] shadow-md`}>
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${badgeClass}`}>
                  {ev.evidence_role}
                </span>
                <span className="text-sky-400 font-mono">{(ev.confidence_score * 100).toFixed(0)}% weight</span>
              </div>
              <div className="font-semibold text-slate-100 text-[11px] truncate">{ev.source_name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">{ev.summary}</div>
            </div>
          ),
          meta: {
            id: ev.id,
            type: `Evidence Record (${ev.source_type})`,
            title: ev.source_name,
            subtitle: `${ev.evidence_role.toUpperCase()} EVIDENCE • ${(ev.confidence_score * 100).toFixed(0)}% Weight`,
            details: {
              'Summary Finding': ev.summary,
              'Raw Measurement': ev.raw_metric || 'N/A',
              'Occurred Timestamp': ev.occurred_at,
              'Ingested Timestamp': ev.ingested_at,
              'Quality Validation': ev.quality.is_valid ? 'Passed Schema Validation' : 'Flagged',
            },
            relationNature: 'directly_observed'
          }
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });

      // Edge from Evidence to Incident Core (Supports / Contradicts)
      e.push({
        id: `edge_${evNodeId}_${incidentNodeId}`,
        source: evNodeId,
        target: incidentNodeId,
        animated: isSupporting,
        style: { 
          stroke: isSupporting ? '#10b981' : '#f59e0b', 
          strokeWidth: 1.5,
          strokeDasharray: isSupporting ? undefined : '5,5'
        },
        markerEnd: { 
          type: MarkerType.ArrowClosed, 
          color: isSupporting ? '#10b981' : '#f59e0b' 
        },
        label: isSupporting ? 'Supports (+Corroborates)' : 'Contradicts (-Conflict)',
        labelStyle: { fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#0a0f18', fillOpacity: 0.85 },
      });
    });

    // 3. Infrastructure Assets Node (SCADA Outfall Station 4 & Junction 14 Flyover)
    const infraNodeId = 'node_infra_j14';
    n.push({
      id: infraNodeId,
      position: { x: 420, y: 380 },
      data: {
        label: (
          <div className="p-2.5 rounded-lg bg-[#0c1422] border border-cyan-500/60 text-xs text-left w-[220px]">
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">INFRASTRUCTURE ASSET</div>
            <div className="font-semibold text-white text-[11px] mt-0.5">Junction 14 Storm Outfall</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Dual 140 LPS Sump Drainage</div>
          </div>
        ),
        meta: {
          id: 'ASSET-OUT-04',
          type: 'Municipal Infrastructure Asset',
          title: 'Junction 14 Storm Outfall & Lowlands Sump',
          subtitle: 'Dual 140 LPS Sump Drainage Grid',
          details: {
            'Design Capacity': '280 LPS Total Inundation Flow',
            'Connected Watershed': 'Mithi River Basin Basin-3',
            'Active Equipment': 'Pump 01 (Nominal), Pump 02 (Tripped Overload)',
          },
          relationNature: 'directly_observed'
        }
      },
      sourcePosition: Position.Top,
      targetPosition: Position.Bottom,
    });

    e.push({
      id: `edge_${infraNodeId}_${incidentNodeId}`,
      source: infraNodeId,
      target: incidentNodeId,
      style: { stroke: '#06b6d4', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' },
      label: 'Affected Asset (Ground Zero)',
      labelStyle: { fill: '#38bdf8', fontSize: 9, fontFamily: 'monospace' },
      labelBgStyle: { fill: '#0a0f18', fillOpacity: 0.85 },
    });

    // 4. Right Column: Candidate Explanations & Causal Hypotheses
    const hypothesesList = incident.hypotheses || [];
    hypothesesList.forEach((hyp, idx) => {
      const hypNodeId = `node_hyp_${hyp.id}`;
      const yOffset = 40 + idx * 135;

      n.push({
        id: hypNodeId,
        position: { x: 800, y: yOffset },
        data: {
          label: (
            <div className="p-3 rounded-lg bg-[#0c1422] border border-purple-500/70 text-xs text-left w-[270px] shadow-lg">
              <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 mb-1">
                <span>CANDIDATE HYPOTHESIS</span>
                <span className="font-bold text-white">{(hyp.plausibility_score * 100).toFixed(0)}% Plaus.</span>
              </div>
              <div className="font-semibold text-white text-[11px] leading-tight">{hyp.title}</div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Uncertainty: <span className="text-amber-400 uppercase">{hyp.uncertainty_level}</span>
              </div>
            </div>
          ),
          meta: {
            id: hyp.id,
            type: 'Causal Explanation Hypothesis',
            title: hyp.title,
            subtitle: `Calibrated Plausibility: ${(hyp.plausibility_score * 100).toFixed(0)}% • Uncertainty: ${hyp.uncertainty_level.toUpperCase()}`,
            details: {
              'Root Cause Rationale': hyp.root_cause_explanation,
              'Evaluating Engine': `Bayesian Causal Network v2.4 (${hyp.model_id})`,
              'Supporting Evidence Count': `${hyp.supporting_evidence_ids?.length || 0} signals`,
              'Missing Information': hyp.unknowns?.join('; ') || 'None identified',
            },
            relationNature: 'hypothesis'
          }
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });

      // Edge from Incident to Hypothesis (Algorithmically Inferred)
      e.push({
        id: `edge_${incidentNodeId}_${hypNodeId}`,
        source: incidentNodeId,
        target: hypNodeId,
        style: { stroke: '#a855f7', strokeWidth: 1.5, strokeDasharray: '4,4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
        label: `Model-Inferred (${(hyp.plausibility_score * 100).toFixed(0)}%)`,
        labelStyle: { fill: '#c084fc', fontSize: 9, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#0a0f18', fillOpacity: 0.85 },
      });
    });

    return { nodes: n, edges: e };
  }, [incident]);

  return (
    <div className="w-full h-[560px] rounded-xl bg-command-950 border border-command-800 relative overflow-hidden flex">
      {/* Top Left Header Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <div className="px-2.5 py-1 rounded bg-[#0c1422]/95 border border-[#1b273b] text-[10px] font-mono text-slate-300 flex items-center gap-1.5 shadow">
          <GitBranch className="w-3.5 h-3.5 text-sky-400" />
          <span>INTERACTIVE FUSION TOPOLOGY</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 bg-[#080d16]/80 px-2 py-0.5 rounded border border-[#162235]">
          Click any node to inspect evidence provenance
        </span>
      </div>

      {/* Main React Flow Canvas */}
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          onNodeClick={(_, node) => {
            if (node.data?.meta) {
              setSelectedNodeData(node.data.meta as SelectedNodeMetadata);
            }
          }}
          attributionPosition="bottom-right"
          className="bg-[#060911]"
        >
          <Background color="#16233a" gap={22} size={1} />
          <Controls className="bg-[#0c1422] border-[#1b273b] text-slate-300" />
        </ReactFlow>
      </div>

      {/* Synchronized Node Metadata Inspection Drawer */}
      {selectedNodeData && (
        <div className="w-80 h-full bg-[#0c1422]/95 border-l border-[#1b273b] p-4 flex flex-col justify-between font-mono text-xs z-20 backdrop-blur-md shadow-2xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b273b]">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold text-[11px]">
                <Info className="w-3.5 h-3.5" />
                <span>NODE METADATA</span>
              </div>
              <button
                onClick={() => setSelectedNodeData(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#162235]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase">{selectedNodeData.type}</div>
              <div className="text-white font-bold text-sm mt-0.5">{selectedNodeData.title}</div>
              <div className="text-[11px] text-slate-300 mt-1">{selectedNodeData.subtitle}</div>
            </div>

            <div className="p-2 rounded bg-[#080d16] border border-[#1b273b] text-[10px]">
              <div className="text-slate-400 uppercase font-bold">Relationship Epistemology</div>
              <div className={`mt-0.5 font-bold ${
                selectedNodeData.relationNature === 'directly_observed' 
                  ? 'text-emerald-400' 
                  : selectedNodeData.relationNature === 'algorithmically_inferred'
                    ? 'text-sky-400'
                    : 'text-purple-400'
              }`}>
                {selectedNodeData.relationNature === 'directly_observed' && 'Directly Observed (Ground Evidence)'}
                {selectedNodeData.relationNature === 'algorithmically_inferred' && 'Algorithmically Inferred Association'}
                {selectedNodeData.relationNature === 'hypothesis' && 'Causal Hypothesis (Unverified Candidate)'}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Traceable Attributes</span>
              <div className="space-y-1.5">
                {Object.entries(selectedNodeData.details).map(([key, value]) => (
                  <div key={key} className="p-2 rounded bg-[#080d16] border border-[#162235] text-[10px]">
                    <span className="text-slate-400 block">{key}:</span>
                    <span className="text-slate-200 font-sans font-medium block mt-0.5">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1b273b] text-[10px] text-slate-500">
            * Epistemic Rule: Correlation is not treated as proven causation.
          </div>
        </div>
      )}
    </div>
  );
};
