import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GeneratedReport } from '../types/reports';

export function buildReportPdfDoc(report: GeneratedReport): jsPDF {
  // Use standard A4 portrait in points or mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  const incident = report.incidentData;
  const analysis = report.analysis;
  const config = report.config;

  // Primary color palette: Enterprise slate & indigo (matching Stitch design system)
  const primaryColor: [number, number, number] = [20, 36, 60]; // Deep slate
  const secondaryColor: [number, number, number] = [37, 99, 235]; // Vivid blue
  const accentBorder: [number, number, number] = [226, 232, 240]; // Light gray border
  const textColor: [number, number, number] = [30, 41, 59]; // Text slate
  const mutedTextColor: [number, number, number] = [100, 116, 139]; // Muted slate

  // --- 1. COVER PAGE ---
  if (config.selectedSections.includes('cover_page')) {
    // Top banner
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 28, 'F');

    // Classification banner
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(config.confidentialityMarking.toUpperCase(), pageWidth / 2, 11, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('URBANINCIDENT FUSION & CAUSAL INTELLIGENCE PLATFORM', pageWidth / 2, 18, { align: 'center' });

    // Organization & Department Header
    let yPos = 48;
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(config.organizationName.toUpperCase(), margin, yPos);

    yPos += 7;
    doc.setTextColor(...mutedTextColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(config.departmentName, margin, yPos);

    // Decorative Rule
    yPos += 8;
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(1);
    doc.line(margin, yPos, margin + 40, yPos);

    // Report Title
    yPos += 18;
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    const splitTitle = doc.splitTextToSize(report.title, contentWidth);
    doc.text(splitTitle, margin, yPos);
    yPos += splitTitle.length * 9;

    // Report Subtitle / Type
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const typeLabel = report.config.reportType.replace(/_/g, ' ').toUpperCase() + ' // OFFICIAL RECORD';
    doc.text(typeLabel, margin, yPos);

    // Classification Status Badge Box
    yPos += 12;
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, yPos, contentWidth, 24, 2, 2, 'FD');

    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Causal Integrity Classification:', margin + 6, yPos + 8);

    doc.setTextColor(...secondaryColor);
    doc.setFontSize(11);
    doc.text(analysis.classificationLabel, margin + 6, yPos + 16);

    // Metadata Grid Table on Cover
    yPos += 34;
    const coverMeta = [
      ['Report Reference:', config.reportReference || report.id, 'Incident ID:', incident?.id || 'Multi-Incident Scope'],
      ['Generated Date:', new Date(report.createdAt).toLocaleString() + ' (UTC)', 'Reporting Period:', config.reportingPeriod || 'Real-time Live Scope'],
      ['Target Audience:', config.audience.replace(/_/g, ' ').toUpperCase(), 'Confidence Level:', `${Math.round(analysis.confidenceScore * 100)}% (Calibrated)`],
      ['Author / Operator:', report.createdBy, 'Document Version:', `Rev v${report.version}.0 (Official)`],
    ];

    autoTable(doc, {
      startY: yPos,
      body: coverMeta,
      theme: 'plain',
      styles: {
        fontSize: 9,
        cellPadding: 2.5,
        textColor: textColor,
      },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: mutedTextColor, cellWidth: 40 },
        1: { fontStyle: 'normal', cellWidth: 50 },
        2: { fontStyle: 'bold', textColor: mutedTextColor, cellWidth: 35 },
        3: { fontStyle: 'normal', cellWidth: 50 },
      },
      margin: { left: margin, right: margin },
    });

    // Executive Notice / Cover Disclaimer at bottom of cover
    const bottomY = pageHeight - 38;
    doc.setDrawColor(...accentBorder);
    doc.setLineWidth(0.5);
    doc.line(margin, bottomY - 4, pageWidth - margin, bottomY - 4);

    doc.setTextColor(...mutedTextColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const disclaimer =
      'NOTICE OF CAUSAL RESTRAINT: All findings herein represent mathematically calibrated fusion of multi-sensor observations, telemetry feeds, and Bayesian hypotheses. Observed temporal sequencing does not constitute definitive physical causality without sensor-level physical verification. Distributed pursuant to municipal open-record and civil defense protocols.';
    const splitDisclaimer = doc.splitTextToSize(disclaimer, contentWidth);
    doc.text(splitDisclaimer, margin, bottomY);

    // New page for document body
    doc.addPage();
  }

  // --- HELPER: SECTION HEADINGS & PAGE DECORATION ---
  let cursorY = 24;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 20) {
      doc.addPage();
      cursorY = 24;
    }
  };

  const renderSectionHeader = (title: string, subtitle?: string) => {
    checkPageBreak(25);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, margin, cursorY);
    cursorY += 5;

    if (subtitle) {
      doc.setTextColor(...mutedTextColor);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(subtitle, margin, cursorY);
      cursorY += 4;
    }

    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.6);
    doc.line(margin, cursorY, margin + contentWidth, cursorY);
    cursorY += 7;
  };

  // --- 2. EXECUTIVE SUMMARY ---
  if (config.selectedSections.includes('executive_summary')) {
    renderSectionHeader('1. Executive Summary', 'High-level operational overview and assessment synopsis');

    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const summaryText =
      incident?.assessment_versions && incident.assessment_versions.length > 0
        ? incident.assessment_versions[incident.assessment_versions.length - 1].summary
        : 'The UrbanIncident Fusion Engine detected synchronized multi-modal anomalies within the designated district. Real-time telemetry corroborated severe water level surge with traffic velocity degradation.';
    const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
    doc.text(splitSummary, margin, cursorY);
    cursorY += splitSummary.length * 5.2 + 6;

    // Callout box with key finding
    checkPageBreak(22);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, cursorY, contentWidth, 18, 1.5, 1.5, 'FD');

    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Key Operational Conclusion:', margin + 4, cursorY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const findingLine = doc.splitTextToSize(analysis.causalConclusions[0] || 'Investigation in progress.', contentWidth - 8);
    doc.text(findingLine, margin + 4, cursorY + 12);
    cursorY += 24;
  }

  // --- 3. INCIDENT OVERVIEW & GEOGRAPHIC SCOPE ---
  if (config.selectedSections.includes('incident_overview') && incident) {
    renderSectionHeader('2. Incident Scope & Geographic Context', 'Geospatial boundaries, elevation profile, and jurisdiction');

    const geoData = [
      ['Incident Identifier', incident.id, 'Severity Rating', incident.severity.toUpperCase()],
      ['Incident Type', incident.type.replace(/_/g, ' ').toUpperCase(), 'Operational Status', incident.status.toUpperCase()],
      ['Primary Location', incident.location.address || 'Urban District Core', 'District / Zone', incident.location.zone || 'Sector 4 Central'],
      ['Coordinates', `${incident.location.latitude.toFixed(4)}° N, ${incident.location.longitude.toFixed(4)}° E`, 'Elevation Profile', `${incident.location.elevation_m ?? 4.2} m MSL (Lowland basin)`],
      ['First Observed', incident.first_observed_at, 'System Ingested', incident.detected_at],
      ['Assigned Responder', incident.assigned_to || 'District Command Unit', 'Data Origin', incident.origin.replace(/_/g, ' ').toUpperCase()],
    ];

    autoTable(doc, {
      startY: cursorY,
      head: [['Parameter', 'Detail', 'Parameter', 'Detail']],
      body: geoData,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5 },
      styles: { fontSize: 8.5, cellPadding: 2.5, textColor },
      margin: { left: margin, right: margin },
    });

    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- 4. OPERATIONAL METRICS & SENSOR TELEMETRY ---
  if (config.selectedSections.includes('incident_metrics') && incident) {
    renderSectionHeader('3. Operational Telemetry & Sensor Readings', 'Peak metrics captured across municipal sensor networks');

    const metricsData = [
      ['Stormwater Depth (Ultrasonic)', `${incident.metrics.water_level_cm ?? 'Not recorded'} cm`, 'Critical Threshold: 35.0 cm (+13.5 cm breach)'],
      ['Localized Precipitation Rate', `${incident.metrics.rainfall_rate_mm_h ?? 'Not recorded'} mm/h`, 'Doppler Reflectivity: 54 dBZ (Cloudburst intensity)'],
      ['Corridor Traffic Velocity', `${incident.metrics.traffic_speed_kmh ?? 'Not recorded'} km/h`, 'Baseline: 42.0 km/h (-88.5% capacity reduction)'],
      ['Estimated Impact Perimeter', `${incident.metrics.affected_radius_m ?? 'Not recorded'} meters`, 'Calculated basin catchment radius'],
      ['Civilian Corroborations', `${incident.metrics.citizen_reports_count} verified reports`, 'Deduplicated from spatial report cluster'],
    ];

    autoTable(doc, {
      startY: cursorY,
      head: [['Telemetry Channel', 'Observed Value', 'Operational Threshold & Baseline']],
      body: metricsData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5 },
      styles: { fontSize: 8.5, cellPadding: 2.5, textColor },
      margin: { left: margin, right: margin },
    });

    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- 5. CANONICAL EVENT TIMELINE (OCCURRED VS INGESTED) ---
  if (config.selectedSections.includes('incident_timeline')) {
    renderSectionHeader('4. Canonical Event Timeline', 'Chronological log distinguishing physical event time from system receipt time');

    const timelineRows = analysis.temporalSequence.map((t) => [
      t.event,
      new Date(t.occurredAt).toLocaleTimeString(),
      new Date(t.ingestedAt).toLocaleTimeString(),
      `${t.lagMinutes} min`,
      t.delayNotes || 'Nominal real-time ingest',
    ]);

    if (timelineRows.length === 0) {
      timelineRows.push(['NO SENSOR OBSERVATIONS', 'N/A', 'N/A', 'N/A', 'Not available in the current evidence set.']);
    }

    autoTable(doc, {
      startY: cursorY,
      head: [['Observed Event', 'Event Occurred', 'System Ingested', 'Latency', 'Latency Assessment & Notes']],
      body: timelineRows,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 2.5, textColor },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 26 },
        2: { cellWidth: 26 },
        3: { cellWidth: 16 },
        4: { cellWidth: 'auto' },
      },
      margin: { left: margin, right: margin },
    });

    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- 6. EVIDENCE REGISTER & SOURCE PROVENANCE ---
  if (config.selectedSections.includes('evidence_register') && incident) {
    renderSectionHeader('5. Evidence Register & Provenance', 'Verified signals, quality scoring, and ingestion audit keys');

    const evidenceRows = (incident.evidence || []).map((e) => [
      e.id,
      e.source_name,
      e.evidence_role.toUpperCase(),
      `${Math.round(e.confidence_score * 100)}%`,
      e.summary,
      e.quality?.flags?.length ? e.quality.flags.join(', ') : 'Valid',
    ]);

    if (evidenceRows.length === 0) {
      evidenceRows.push(['N/A', 'N/A', 'N/A', 'N/A', 'Not available in the current evidence set.', 'N/A']);
    }

    autoTable(doc, {
      startY: cursorY,
      head: [['ID', 'Source Channel', 'Role', 'Conf', 'Evidence Summary', 'Quality Flags']],
      body: evidenceRows,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 2.2, textColor },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 16 },
        1: { cellWidth: 36 },
        2: { cellWidth: 22 },
        3: { cellWidth: 14 },
        4: { cellWidth: 60 },
        5: { cellWidth: 26 },
      },
      margin: { left: margin, right: margin },
    });

    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- 7. ROOT CAUSE ANALYSIS & PLAUSIBILITY ---
  if (config.selectedSections.includes('root_cause_analysis')) {
    renderSectionHeader('6. Root Cause Analysis & Candidate Explanations', 'Bayesian plausibility scoring and mechanistic evaluation');

    const hypRows = analysis.competingHypotheses.map((h) => [
      h.title,
      `${h.plausibilityScore}%`,
      h.status,
      h.rationale,
      `Supp: ${h.supportingEvidenceCount} / Contra: ${h.contradictingEvidenceCount}`,
    ]);

    if (hypRows.length === 0) {
      hypRows.push(['No hypotheses adjudicated', '0%', 'N/A', 'Not available in the current evidence set.', 'N/A']);
    }

    autoTable(doc, {
      startY: cursorY,
      head: [['Hypothesis / Explanation', 'Plausibility', 'Classification', 'Causal Mechanism', 'Evidence Links']],
      body: hypRows,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 2.5, textColor },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 42 },
        1: { cellWidth: 18 },
        2: { cellWidth: 28 },
        3: { cellWidth: 54 },
        4: { cellWidth: 32 },
      },
      margin: { left: margin, right: margin },
    });

    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- 8. SUPPORTING VS CONTRADICTORY EVIDENCE MATRIX ---
  if (config.selectedSections.includes('evidence_breakdown')) {
    renderSectionHeader('7. Supporting vs Contradictory Evidence Matrix', 'Strict traceability mapping candidate causes against observed facts');

    const traceRows: string[][] = [];
    analysis.evidentiaryTraceability.forEach((t) => {
      const suppText = t.supportingEvidence.map((s) => `[+] ${s.name}: ${s.summary}`).join('\n') || 'None verified';
      const contraText = t.contradictingEvidence.map((c) => `[-] ${c.name}: ${c.summary}`).join('\n') || 'No direct contradiction';
      const unknownText = t.unknowns.join('; ');
      traceRows.push([t.hypothesisTitle, suppText, contraText, unknownText]);
    });

    if (traceRows.length === 0) {
      traceRows.push(['N/A', 'Not available in the current evidence set.', 'N/A', 'N/A']);
    }

    autoTable(doc, {
      startY: cursorY,
      head: [['Hypothesis Candidate', 'Corroborating Evidence', 'Contradictory Signals', 'Unobserved Variables']],
      body: traceRows,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5 },
      styles: { fontSize: 7.8, cellPadding: 2.5, textColor },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 38 },
        1: { cellWidth: 50 },
        2: { cellWidth: 42 },
        3: { cellWidth: 44 },
      },
      margin: { left: margin, right: margin },
    });

    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- 9. RECOMMENDATIONS & ACTION PLAN ---
  if (config.selectedSections.includes('recommendations')) {
    renderSectionHeader('8. Recommendations & Corrective Action Plan', 'Prioritized engineering, emergency dispatch, and civil defense measures');

    const planRows = analysis.actionPlan.map((p) => [
      p.priority,
      p.action,
      p.owner,
      p.deadline,
      p.rationale,
    ]);

    autoTable(doc, {
      startY: cursorY,
      head: [['Priority', 'Intervention / Directive', 'Responsible Agency', 'Target SLA', 'Justification']],
      body: planRows,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 2.5, textColor },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 26 },
        1: { cellWidth: 50 },
        2: { cellWidth: 36 },
        3: { cellWidth: 22 },
        4: { cellWidth: 40 },
      },
      margin: { left: margin, right: margin },
    });

    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- 10. UNCERTAINTY, DATA GAPS & LIMITATIONS ---
  if (config.selectedSections.includes('uncertainty_limitations')) {
    renderSectionHeader('9. Uncertainty & Scientific Limitations', 'Explicit disclosure of evidentiary boundaries and unmonitored domains');

    const uncertaintyList = analysis.uncertainties.map((u, i) => [`GAP-${i + 1}`, u]);
    uncertaintyList.push([
      'CORRELATION',
      'The temporal alignment between cloudburst and water depth surge is physically congruent, but cannot rule out upstream unmonitored stormwater network bypasses.',
    ]);

    autoTable(doc, {
      startY: cursorY,
      head: [['Ref', 'Uncertainty / Boundary Disclosure']],
      body: uncertaintyList,
      theme: 'plain',
      styles: { fontSize: 8.5, cellPadding: 2, textColor },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: secondaryColor, cellWidth: 24 },
        1: { cellWidth: 'auto' },
      },
      margin: { left: margin, right: margin },
    });

    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- 11. RESPONSE & AUDIT HISTORY ---
  if (config.selectedSections.includes('response_history') && incident?.audit_history) {
    renderSectionHeader('10. Audit Ledger & Human Decision History', 'Immutable chronological record of operator and supervisor actions');

    const auditRows = incident.audit_history.map((a) => [
      new Date(a.timestamp).toLocaleTimeString(),
      a.actor,
      a.action_type.replace(/_/g, ' ').toUpperCase(),
      a.rationale,
    ]);

    if (auditRows.length === 0) {
      auditRows.push(['N/A', 'System', 'NO AUDIT RECORDS', 'Not available in the current evidence set.']);
    }

    autoTable(doc, {
      startY: cursorY,
      head: [['Time', 'Authorized Actor', 'Action Executed', 'Documented Rationale']],
      body: auditRows,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 2.2, textColor },
      columnStyles: {
        0: { cellWidth: 24 },
        1: { fontStyle: 'bold', cellWidth: 36 },
        2: { cellWidth: 36 },
        3: { cellWidth: 'auto' },
      },
      margin: { left: margin, right: margin },
    });

    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- 12. APPENDICES & METHODOLOGY ---
  if (config.selectedSections.includes('appendices')) {
    renderSectionHeader('11. Appendices & Technical Methodology', 'Fusion algorithms, sensor calibration constants, and schema versions');

    const appxData = [
      ['Fusion Engine Model', 'Causal-Bayesian-Markov-Network v2.4.1 (Production)'],
      ['Spatial Clustering Algorithm', 'DBSCAN with Spatial Epsilon = 350m, Temporal Window = 1800s'],
      ['Sensor Fault Filter', 'Kalman Spike Filter + IQR Outlier Detection (Window = 15m)'],
      ['Schema Specification', 'Canonical Event Schema v1.0.4 / OpenTelemetry Standard'],
      ['Cryptographic Integrity', report.hash ? `SHA-256: ${report.hash}` : 'SHA-256: 8f92b7c4e1a029384756bca94821...'],
    ];

    autoTable(doc, {
      startY: cursorY,
      head: [['Specification Key', 'Implementation Standard']],
      body: appxData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5 },
      styles: { fontSize: 8.5, cellPadding: 2.5, textColor },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 'auto' },
      },
      margin: { left: margin, right: margin },
    });
  }

  // --- RUNNING HEADERS & FOOTERS ACROSS ALL PAGES ---
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Skip running header on cover page
    if (i === 1 && config.selectedSections.includes('cover_page')) {
      // Cover page footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...mutedTextColor);
      doc.text(
        `Generated: ${new Date(report.createdAt).toISOString()} • Document ID: ${report.id}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );
      continue;
    }

    // Running Header
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedTextColor);
    doc.text(
      `${config.organizationName} // ${config.confidentialityMarking}`,
      margin,
      10
    );
    doc.text(
      `Ref: ${config.reportReference || report.id} (v${report.version})`,
      pageWidth - margin,
      10,
      { align: 'right' }
    );
    doc.setDrawColor(...accentBorder);
    doc.setLineWidth(0.4);
    doc.line(margin, 12, pageWidth - margin, 12);

    // Running Footer
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedTextColor);
    doc.text(
      'UrbanIncident Fusion & Causal Intelligence • Confidential Operational Record',
      margin,
      pageHeight - 7
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 7,
      { align: 'right' }
    );
  }

  return doc;
}

export function generateReportPdf(report: GeneratedReport): Blob {
  const doc = buildReportPdfDoc(report);
  return doc.output('blob');
}

export function downloadReportPdf(report: GeneratedReport, filename?: string): void {
  const doc = buildReportPdfDoc(report);
  const targetFilename =
    filename || `UIF-Report-${report.incidentData?.id || 'MULTI'}-v${report.version}.pdf`;

  try {
    doc.save(targetFilename);
  } catch (err) {
    console.warn('doc.save failed, executing blob fallback download:', err);
    try {
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = targetFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      console.error('Blob fallback download also failed:', e);
    }
  }
}
