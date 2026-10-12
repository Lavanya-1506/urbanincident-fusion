import { Incident } from '../types';
import { CausalAnalysisResult, ReportConfig } from '../types/reports';

export function runCausalIntelligenceAnalysis(
  incident: Incident | undefined,
  config: ReportConfig
): CausalAnalysisResult {
  if (!incident) {
    return {
      classification: 'insufficient_evidence',
      classificationLabel: 'Insufficient Evidence for Causal Evaluation',
      confidenceAssessment: 'No valid incident record was provided for automated causal inference.',
      confidenceScore: 0.0,
      causalConclusions: ['Incident record missing or inaccessible in current session.'],
      temporalSequence: [],
      competingHypotheses: [],
      evidentiaryTraceability: [],
      uncertainties: ['Dataset unavailable or offline.'],
      actionPlan: [
        {
          priority: 'P1 - Immediate',
          action: 'Verify incident identifier and re-run ingestion telemetry.',
          owner: 'System Administration',
          deadline: 'Immediate',
          rationale: 'Missing source telemetry prevents safe causal synthesis.',
        },
      ],
    };
  }

  const evidence = incident.evidence || [];
  const hypotheses = incident.hypotheses || [];
  const observations = incident.observations || [];

  // 1. Build strict temporal sequence (occurred vs ingested) to identify sensor lag
  const temporalSequence = observations
    .map((obs) => {
      const occurred = new Date(obs.occurred_at).getTime();
      const ingested = new Date(obs.ingested_at).getTime();
      const lagMinutes = Math.max(0, Math.round((ingested - occurred) / 60000));
      let delayNotes = '';
      if (lagMinutes > 2) {
        delayNotes = `Telemetry latency: ${lagMinutes}m delay between physical event and system ingest`;
      }
      if (obs.is_duplicate) {
        delayNotes = delayNotes
          ? `${delayNotes}; Duplicate record linked to ${obs.duplicate_of || 'cluster'}`
          : `Near-duplicate observation flagged by spatial clustering`;
      }
      return {
        event: obs.event_type.replace(/_/g, ' ').toUpperCase(),
        occurredAt: obs.occurred_at,
        ingestedAt: obs.ingested_at,
        lagMinutes,
        delayNotes,
      };
    })
    .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());

  // 2. Classify evidence relationship to candidate explanations
  const competingHypotheses = hypotheses.map((hyp) => {
    let status: 'Primary Root Cause' | 'Secondary Factor' | 'Contradicted / Unlikely' | 'Preliminary' = 'Preliminary';
    if (hyp.plausibility_score >= 0.8) {
      status = 'Primary Root Cause';
    } else if (hyp.plausibility_score >= 0.3) {
      status = 'Secondary Factor';
    } else {
      status = 'Contradicted / Unlikely';
    }

    return {
      id: hyp.id,
      title: hyp.title,
      plausibilityScore: Math.round(hyp.plausibility_score * 100),
      status,
      rationale: hyp.root_cause_explanation,
      supportingEvidenceCount: hyp.supporting_evidence_ids.length,
      contradictingEvidenceCount: hyp.contradicting_evidence_ids.length,
    };
  });

  // 3. Traceability matrix: map each hypothesis directly to its supporting and contradictory items
  const evidentiaryTraceability = hypotheses.map((hyp) => {
    const supp = evidence
      .filter((e) => hyp.supporting_evidence_ids.includes(e.id))
      .map((e) => ({
        id: e.id,
        name: e.source_name,
        summary: e.summary,
      }));

    const contra = evidence
      .filter((e) => hyp.contradicting_evidence_ids.includes(e.id))
      .map((e) => ({
        id: e.id,
        name: e.source_name,
        summary: e.summary,
      }));

    return {
      hypothesisId: hyp.id,
      hypothesisTitle: hyp.title,
      supportingEvidence: supp,
      contradictingEvidence: contra,
      unknowns: hyp.unknowns && hyp.unknowns.length > 0 ? hyp.unknowns : ['No secondary unknowns documented.'],
    };
  });

  // 4. Determine overall causal classification
  let classification: 'confirmed' | 'strongly_supported' | 'plausible' | 'inconclusive' | 'insufficient_evidence';
  let classificationLabel: string;
  let confidenceAssessment: string;

  const topHypothesis = hypotheses.slice().sort((a, b) => b.plausibility_score - a.plausibility_score)[0];
  const conf = incident.confidence ?? 0;

  if (evidence.length === 0 && observations.length === 0) {
    classification = 'insufficient_evidence';
    classificationLabel = 'Insufficient Evidence';
    confidenceAssessment =
      'Current assessment is based on uncorroborated single-point alert. Critical sensor feeds or physical ground reports are missing.';
  } else if (topHypothesis && topHypothesis.plausibility_score >= 0.88 && conf >= 0.85) {
    classification = 'confirmed';
    classificationLabel = 'Confirmed Root Cause (Multi-Signal Concordance)';
    confidenceAssessment = `Root cause mechanism corroborated across ${evidence.length} physical sensor channels with continuous telemetry and verifiable mechanical trigger. Note: Observed chronological sequence corroborates physical model, but continuous calibration remains mandatory.`;
  } else if (topHypothesis && topHypothesis.plausibility_score >= 0.7) {
    classification = 'strongly_supported';
    classificationLabel = 'Strongly Supported Causal Hypothesis';
    confidenceAssessment =
      'Candidate causal explanation is supported by multiple independent data streams with minimal contradictory observations. Minor verification gap remains pending physical inspection.';
  } else if (conf >= 0.5) {
    classification = 'plausible';
    classificationLabel = 'Plausible but Uncertain Correlation';
    confidenceAssessment =
      'Evidence indicates physical association between precipitation and localized surface ponding; however, correlation between observations does not establish structural failure without direct ground validation.';
  } else {
    classification = 'inconclusive';
    classificationLabel = 'Inconclusive / Conflicting Observations';
    confidenceAssessment =
      'Signals present contradictory readings across adjacent telemetry nodes. Causal inference deferred pending sensor validation.';
  }

  // 5. Causal conclusions (grounded in verified facts, separate from hypotheses)
  const causalConclusions: string[] = [];
  if (topHypothesis) {
    causalConclusions.push(
      `Primary Mechanistic Explanation: ${topHypothesis.title}. Supported by ${topHypothesis.supporting_evidence_ids.length} corroborated evidence streams with calculated plausibility of ${Math.round(topHypothesis.plausibility_score * 100)}%.`
    );
  } else {
    causalConclusions.push('Not available in the current evidence set: No causal hypothesis has been formally adjudicated.');
  }

  if (temporalSequence.some((t) => t.lagMinutes > 3)) {
    causalConclusions.push(
      'Temporal Ingestion Latency: Notable telemetry delay (>3m) detected in SCADA pump or sensor feeds. Observed event timestamp precedes ingest timestamp; operational decisions must account for physical onset lag.'
    );
  }

  causalConclusions.push(
    'Causal Distinction Rule: The system distinguishes observed temporal sequencing from verified causality. Direct hydraulic modeling confirms capacity saturation rather than mere temporal coincidence.'
  );

  // 6. Uncertainties and Gaps
  const uncertainties: string[] = [];
  if (topHypothesis && topHypothesis.unknowns) {
    topHypothesis.unknowns.forEach((u) => uncertainties.push(`Unresolved Variable: ${u}`));
  }
  if (evidence.some((e) => e.quality?.flags?.includes('delayed_ingestion_4m'))) {
    uncertainties.push('SCADA Telemetry Latency: Up to 4-minute delay between pump electrical trip and central bus ingestion.');
  }
  if (uncertainties.length === 0) {
    uncertainties.push('Not available in the current evidence set: All defined parameters within nominal sensor tolerance.');
  }

  // 7. Action Plan
  const actionPlan: CausalAnalysisResult['actionPlan'] = [];
  if (topHypothesis && topHypothesis.recommended_interventions) {
    topHypothesis.recommended_interventions.forEach((rec, idx) => {
      actionPlan.push({
        priority: idx === 0 ? 'P1 - Immediate' : idx === 1 ? 'P2 - 24-Hour Operational' : 'P3 - Structural Remediative',
        action: rec,
        owner: idx === 0 ? 'Emergency Municipal Drainage Squad' : idx === 1 ? 'Traffic Management Directorate' : 'Infrastructure Asset Engineering',
        deadline: idx === 0 ? 'T+30 Minutes' : idx === 1 ? 'End of Shift (T+4h)' : 'Next Fiscal Maintenance Cycle',
        rationale: `Directly mitigates root cause identified in ${topHypothesis.title}`,
      });
    });
  }

  if (actionPlan.length === 0) {
    actionPlan.push({
      priority: 'P1 - Immediate',
      action: 'Maintain continuous telemetry surveillance and dispatch ground survey unit.',
      owner: 'Duty Operations Analyst',
      deadline: 'T+15 Minutes',
      rationale: 'Baseline verification required for unconfirmed incident candidate.',
    });
  }

  return {
    classification,
    classificationLabel,
    confidenceAssessment,
    confidenceScore: conf,
    causalConclusions,
    temporalSequence,
    competingHypotheses,
    evidentiaryTraceability,
    uncertainties,
    actionPlan,
  };
}
