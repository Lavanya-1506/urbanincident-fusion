import { create } from 'zustand';
import { GeneratedReport, ReportConfig, ReportType } from '../types/reports';
import { reportService } from '../services/reportService';

interface ReportStore {
  isModalOpen: boolean;
  isHistoryOpen: boolean;
  selectedIncidentId: string;
  activeReport: GeneratedReport | null;
  reportHistory: GeneratedReport[];
  isGenerating: boolean;
  generationProgress: number;
  generationStatusText: string;
  generationError: string | null;

  // Actions
  openReportModal: (incidentId?: string, defaultType?: ReportType) => void;
  closeReportModal: () => void;
  openHistoryModal: () => void;
  closeHistoryModal: () => void;
  setActiveReport: (report: GeneratedReport | null) => void;
  loadReportHistory: () => Promise<void>;
  generateReport: (config: ReportConfig) => Promise<GeneratedReport | null>;
  regenerateReport: (reportId: string) => Promise<GeneratedReport | null>;
  downloadReport: (report: GeneratedReport, format: 'pdf' | 'json') => void;
}

export const useReportStore = create<ReportStore>((set, get) => ({
  isModalOpen: false,
  isHistoryOpen: false,
  selectedIncidentId: 'INC-2026-8841',
  activeReport: null,
  reportHistory: [],
  isGenerating: false,
  generationProgress: 0,
  generationStatusText: '',
  generationError: null,

  openReportModal: (incidentId?: string, defaultType?: ReportType) => {
    set({
      isModalOpen: true,
      selectedIncidentId: incidentId || get().selectedIncidentId || 'INC-2026-8841',
      generationError: null,
      generationProgress: 0,
      generationStatusText: '',
    });
  },

  closeReportModal: () => {
    set({ isModalOpen: false, isGenerating: false });
  },

  openHistoryModal: () => {
    get().loadReportHistory();
    set({ isHistoryOpen: true });
  },

  closeHistoryModal: () => {
    set({ isHistoryOpen: false });
  },

  setActiveReport: (report) => {
    set({ activeReport: report });
  },

  loadReportHistory: async () => {
    try {
      const reports = await reportService.listReports();
      set({ reportHistory: reports });
      if (!get().activeReport && reports.length > 0) {
        set({ activeReport: reports[0] });
      }
    } catch (err: any) {
      console.error('Failed to load report history:', err);
    }
  },

  generateReport: async (config: ReportConfig) => {
    set({
      isGenerating: true,
      generationProgress: 5,
      generationStatusText: 'Initiating report generation pipeline...',
      generationError: null,
    });

    try {
      const report = await reportService.createReport(config, (prog, text) => {
        set({ generationProgress: prog, generationStatusText: text });
      });

      set({
        activeReport: report,
        isGenerating: false,
        generationProgress: 100,
        generationStatusText: 'Complete!',
      });

      await get().loadReportHistory();
      return report;
    } catch (err: any) {
      set({
        isGenerating: false,
        generationError: err.message || 'Report generation failed. Please check parameters and retry.',
      });
      return null;
    }
  },

  regenerateReport: async (reportId: string) => {
    set({
      isGenerating: true,
      generationProgress: 10,
      generationStatusText: 'Starting revision pipeline...',
      generationError: null,
    });

    try {
      const updated = await reportService.regenerateReport(reportId, (prog, text) => {
        set({ generationProgress: prog, generationStatusText: text });
      });

      set({
        activeReport: updated,
        isGenerating: false,
        generationProgress: 100,
        generationStatusText: 'Revision complete!',
      });

      await get().loadReportHistory();
      return updated;
    } catch (err: any) {
      set({
        isGenerating: false,
        generationError: err.message || 'Regeneration failed.',
      });
      return null;
    }
  },

  downloadReport: (report: GeneratedReport, format: 'pdf' | 'json') => {
    reportService.downloadReportFile(report, format);
  },
}));
