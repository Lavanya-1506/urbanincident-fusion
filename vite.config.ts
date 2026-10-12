import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// In-memory reports store on the server side
const serverReports: any[] = [
  {
    id: 'REP-2026-8841-01',
    version: 1,
    title: 'Root Cause Analysis — Waterlogging & Severe Road Inundation (Junction 14)',
    config: {
      reportType: 'root_cause_analysis',
      incidentId: 'INC-2026-8841',
      reportReference: 'REP-2026-8841-RCA-REV1',
      organizationName: 'Metropolitan Civil Protection & Urban Infrastructure Authority',
      departmentName: 'Bureau of Emergency Cartography & Causal Incident Fusion',
      audience: 'operations_command',
      reportingPeriod: 'Operational Shift 06:00 - 08:00 UTC (12-Oct-2026)',
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
        'alternative_explanations',
        'geospatial_analysis',
        'response_history',
        'recommendations',
        'uncertainty_limitations',
        'appendices',
      ],
      format: 'pdf',
    },
    status: 'completed',
    progress: 100,
    createdAt: '2026-10-12T07:18:00Z',
    createdBy: 'Supervisor S. Chen (ID #101)',
    summary: 'Confirmed root cause: severe cloudburst combined with SCADA pump impeller overload trip.',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
];

function reportsApiPlugin(): Plugin {
  return {
    name: 'reports-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
        const pathname = url.pathname;

        // Normalize /api/reports and /api/v1/reports
        if (pathname.startsWith('/api/reports') || pathname.startsWith('/api/v1/reports')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          // GET /api/reports
          if (req.method === 'GET' && (pathname === '/api/reports' || pathname === '/api/v1/reports')) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(serverReports));
            return;
          }

          // POST /api/reports
          if (req.method === 'POST' && (pathname === '/api/reports' || pathname === '/api/v1/reports')) {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const data = JSON.parse(body || '{}');
                const newReport = {
                  id: data.id || `REP-${Date.now().toString(36).toUpperCase()}-01`,
                  version: data.version || 1,
                  title: data.title || 'Incident Report',
                  config: data.config || {},
                  status: 'completed',
                  progress: 100,
                  createdAt: new Date().toISOString(),
                  createdBy: data.createdBy || 'Operations Analyst Elena Vance',
                  summary: data.summary || 'Operational report generated successfully.',
                  hash: data.hash || '8f92b7c4e1a029384756',
                };
                serverReports.unshift(newReport);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 201;
                res.end(JSON.stringify(newReport));
              } catch (err) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
              }
            });
            return;
          }

          // GET /api/reports/:id
          const matchSingle = pathname.match(/\/(?:api|api\/v1)\/reports\/([a-zA-Z0-9_-]+)(?:\/)?$/);
          if (req.method === 'GET' && matchSingle) {
            const reportId = matchSingle[1];
            const report = serverReports.find(r => r.id === reportId);
            if (report) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(report));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Report not found' }));
            }
            return;
          }

          // GET /api/reports/:id/download
          const matchDownload = pathname.match(/\/(?:api|api\/v1)\/reports\/([a-zA-Z0-9_-]+)\/download/);
          if (req.method === 'GET' && matchDownload) {
            const reportId = matchDownload[1];
            const format = url.searchParams.get('format') || 'pdf';
            const report = serverReports.find(r => r.id === reportId) || serverReports[0];

            if (format === 'json') {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Content-Disposition', `attachment; filename="${reportId}.json"`);
              res.statusCode = 200;
              res.end(JSON.stringify(report, null, 2));
            } else {
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', `attachment; filename="${reportId}.pdf"`);
              res.statusCode = 200;
              // Return a simple valid PDF buffer
              const minimalPdf = `%PDF-1.4\n1 0 obj\n<< /Title (${report.title}) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;
              res.end(Buffer.from(minimalPdf));
            }
            return;
          }
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reportsApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
