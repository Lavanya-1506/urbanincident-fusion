import assert from 'node:assert';
import test from 'node:test';
import { runCausalIntelligenceAnalysis } from '../services/reportCausalEngine';
import { generateReportPdf } from '../services/reportPdfGenerator';
import { INITIAL_INCIDENTS } from '../services/mockData';
import { ReportConfig, GeneratedReport, REPORT_SECTIONS_CATALOG } from '../types/reports';

/**
 * TEST 1: Causal Intelligence Engine - Confirmed Multi-Source Incident
 * 
 * PURPOSE:
 * Verifies that the automated causal evaluation engine correctly analyzes
 * real multi-sensor incidents (e.g., rainfall radar + SCADA pump failure + water depth)
 * without assuming causation prematurely.
 * 
 * INPUTS:
 * - incident: Canonical incident object containing real telemetry, observations,
 *             competing hypotheses, and audit history.
 * - config: Report configuration defining requested sections, audience, and scope.
 * 
 * OUTPUT:
 * - analysis: Structured CausalAnalysisResult containing classification,
 *             confidence assessment, temporal lag sequencing, and action plans.
 */
test('1. Causal Intelligence Engine - Confirmed Multi-Source Incident', () => {
  // Step 1: Select a high-severity incident with corroborated sensor data
  const incident = INITIAL_INCIDENTS[0]; // INC-2026-8841 (Critical waterlogging + SCADA pump trip)
  
  // Step 2: Define report generation parameters
  const config: ReportConfig = {
    reportType: 'root_cause_analysis',
    incidentId: incident.id,
    reportReference: 'TEST-REF-001',
    organizationName: 'Metropolitan Authority',
    departmentName: 'Civil Defense',
    audience: 'operations_command',
    reportingPeriod: 'Operational Shift 1',
    confidentialityMarking: 'CONFIDENTIAL',
    selectedSections: ['cover_page', 'root_cause_analysis', 'recommendations'],
    format: 'pdf',
  };

  // Step 3: Run the causal intelligence synthesis
  const analysis = runCausalIntelligenceAnalysis(incident, config);

  // Step 4: Validate causal assertions
  // 4a. Classification should be 'confirmed' because both ultrasonic sensor (>48cm)
  //     and SCADA pump failure telemetry corroborate the physical event.
  assert.strictEqual(
    analysis.classification, 
    'confirmed',
    `Expected 'confirmed' classification but got '${analysis.classification}'`
  );

  // 4b. Calibrated confidence must be high (>= 85%) due to multi-source consensus.
  assert.ok(
    analysis.confidenceScore >= 0.85, 
    `Confidence score should be >= 0.85, got ${analysis.confidenceScore}`
  );

  // 4c. Must evaluate alternative competing explanations (e.g., pipe rupture, pure catchment overload).
  assert.ok(
    analysis.competingHypotheses.length >= 2, 
    `Should have at least 2 competing hypotheses, found ${analysis.competingHypotheses.length}`
  );

  // 4d. Conclusions must formulate a mechanistic explanation, not just a vague correlation.
  assert.ok(
    analysis.causalConclusions.some((c) => c.includes('Primary Mechanistic Explanation')),
    'Causal conclusions must state the primary mechanistic explanation'
  );

  // 4e. Temporal sequence must detect ingestion lag (e.g. SCADA 4-minute delay).
  assert.ok(
    analysis.temporalSequence.some((t) => t.lagMinutes > 0),
    'Engine must detect telemetry latency between physical occurrence and system ingest'
  );

  // 4f. Must provide an actionable, prioritized mitigation plan.
  assert.ok(
    analysis.actionPlan.length > 0, 
    'Engine must produce prioritized recommendations linked to findings'
  );
});

test('2. Causal Intelligence Engine - Sparse / Incomplete Evidence', () => {
  const sparseIncident = {
    ...INITIAL_INCIDENTS[0],
    id: 'INC-SPARSE',
    evidence: [],
    hypotheses: [],
    observations: [],
    confidence: 0.1,
  };

  const config: ReportConfig = {
    reportType: 'incident_intelligence',
    incidentId: 'INC-SPARSE',
    reportReference: 'TEST-REF-002',
    organizationName: 'Metropolitan Authority',
    departmentName: 'Civil Defense',
    audience: 'operations_command',
    reportingPeriod: 'Shift 1',
    confidentialityMarking: 'CONFIDENTIAL',
    selectedSections: ['root_cause_analysis', 'uncertainty_limitations'],
    format: 'pdf',
  };

  const analysis = runCausalIntelligenceAnalysis(sparseIncident, config);

  assert.strictEqual(analysis.classification, 'insufficient_evidence');
  assert.ok(
    analysis.confidenceAssessment.includes('missing') ||
      analysis.confidenceAssessment.includes('uncorroborated'),
    'Should explicitly state evidence is missing'
  );
});

test('3. Real PDF Document Vector Generation', () => {
  const incident = INITIAL_INCIDENTS[0];
  const config: ReportConfig = {
    reportType: 'root_cause_analysis',
    incidentId: incident.id,
    reportReference: 'TEST-PDF-001',
    organizationName: 'Metropolitan Civil Protection & Urban Infrastructure Authority',
    departmentName: 'Bureau of Emergency Cartography & Causal Incident Fusion',
    audience: 'operations_command',
    reportingPeriod: 'Live Real-time Scope',
    confidentialityMarking: 'CONFIDENTIAL // MUNICIPAL EMERGENCY RESPONSE',
    selectedSections: [
      'cover_page',
      'executive_summary',
      'incident_overview',
      'incident_metrics',
      'incident_timeline',
      'evidence_register',
      'root_cause_analysis',
      'evidence_breakdown',
      'recommendations',
      'uncertainty_limitations',
      'response_history',
      'appendices',
    ],
    format: 'pdf',
  };

  const analysis = runCausalIntelligenceAnalysis(incident, config);
  const testReport: GeneratedReport = {
    id: 'REP-TEST-001',
    version: 1,
    title: `Root Cause Analysis — ${incident.title}`,
    config,
    status: 'completed',
    progress: 100,
    createdAt: new Date().toISOString(),
    createdBy: 'Test Automation Agent',
    summary: 'Test summary',
    incidentData: incident,
    analysis,
    hash: 'e3b0c44298fc1c149afbf4c8996fb924',
  };

  const pdfBlob = generateReportPdf(testReport);
  assert.ok(pdfBlob instanceof Blob, 'Generated output must be a valid Blob');
  assert.ok(pdfBlob.size > 5000, `PDF size should be substantial (got ${pdfBlob.size} bytes)`);
  assert.strictEqual(pdfBlob.type, 'application/pdf');
});

test('4. Report Sections Catalog - Completeness and Defaults', () => {
  assert.ok(REPORT_SECTIONS_CATALOG.length >= 10, 'Catalog should contain at least 10 sections');
  const requiredKeys = ['cover_page', 'executive_summary', 'root_cause_analysis', 'recommendations'];
  for (const key of requiredKeys) {
    assert.ok(
      REPORT_SECTIONS_CATALOG.some((s: any) => s.key === key),
      `Catalog must define section: ${key}`
    );
  }
});

test('5. Causal Analysis - Temporal Sequence and Causality Distinction', () => {
  const incident = INITIAL_INCIDENTS[0];
  const config: ReportConfig = {
    reportType: 'post_incident_review',
    incidentId: incident.id,
    reportReference: 'TEST-PIR-001',
    organizationName: 'Metropolitan Authority',
    departmentName: 'Civil Defense',
    audience: 'audit_board',
    reportingPeriod: 'Retrospective Post-Incident',
    confidentialityMarking: 'INTERNAL OFFICIAL USE ONLY',
    selectedSections: ['incident_timeline', 'root_cause_analysis', 'response_history'],
    format: 'pdf',
  };

  const analysis = runCausalIntelligenceAnalysis(incident, config);
  assert.ok(
    analysis.causalConclusions.some((c) => c.toLowerCase().includes('temporal')),
    'Should explicitly disclose temporal lag versus verified causality'
  );
  assert.ok(
    analysis.actionPlan.every((p) => p.priority && p.action && p.deadline),
    'Action plan directives must have priority and target SLA'
  );
});

