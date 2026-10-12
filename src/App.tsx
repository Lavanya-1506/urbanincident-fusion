import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ui/Toast';
import { AppShell } from './components/common/AppShell';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { MapPage } from './features/map/MapPage';
import { IncidentExplorerPage } from './features/incidents/IncidentExplorerPage';
import { InvestigationWorkspacePage } from './features/investigations/InvestigationWorkspacePage';
import { ReplayLabPage } from './features/replay/ReplayLabPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';
import { SourcesHealthPage } from './features/sources/SourcesHealthPage';
import { AuditHistoryPage } from './features/audit/AuditHistoryPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { ReportHistoryPage } from './features/reports/ReportHistoryPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppShell />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="map" element={<MapPage />} />
              <Route path="incidents" element={<IncidentExplorerPage />} />
              <Route path="incidents/:id" element={<InvestigationWorkspacePage />} />
              <Route path="reports" element={<ReportHistoryPage />} />
              <Route path="replay" element={<ReplayLabPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="sources" element={<SourcesHealthPage />} />
              <Route path="audit" element={<AuditHistoryPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
};
