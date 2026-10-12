import { create } from 'zustand';
import { IncidentStatus, IncidentSeverity, DataOrigin, IncidentType } from '../types';

interface IncidentState {
  selectedIncidentId: string | null;
  searchQuery: string;
  statusFilter: IncidentStatus | 'all';
  severityFilter: IncidentSeverity | 'all';
  originFilter: DataOrigin | 'all';
  categoryFilter: IncidentType | 'all';
  confidenceMin: number; // 0 to 1
  timeRangeFilter: 'all' | '1h' | '6h' | '24h';
  sortBy: 'detected_at' | 'severity' | 'confidence' | 'water_level';
  sortOrder: 'asc' | 'desc';

  setSelectedIncidentId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setStatusFilter: (s: IncidentStatus | 'all') => void;
  setSeverityFilter: (s: IncidentSeverity | 'all') => void;
  setOriginFilter: (o: DataOrigin | 'all') => void;
  setCategoryFilter: (c: IncidentType | 'all') => void;
  setConfidenceMin: (min: number) => void;
  setTimeRangeFilter: (tr: 'all' | '1h' | '6h' | '24h') => void;
  setSortBy: (sb: 'detected_at' | 'severity' | 'confidence' | 'water_level') => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  selectedIncidentId: 'INC-2026-8841', // Default to demonstration incident
  searchQuery: '',
  statusFilter: 'all',
  severityFilter: 'all',
  originFilter: 'all',
  categoryFilter: 'all',
  confidenceMin: 0,
  timeRangeFilter: 'all',
  sortBy: 'detected_at',
  sortOrder: 'desc',

  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSeverityFilter: (severityFilter) => set({ severityFilter }),
  setOriginFilter: (originFilter) => set({ originFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setConfidenceMin: (confidenceMin) => set({ confidenceMin }),
  setTimeRangeFilter: (timeRangeFilter) => set({ timeRangeFilter }),
  setSortBy: (sortBy) => set({ sortBy }),
  toggleSortOrder: () => set((state) => ({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' })),
  resetFilters: () => set({
    searchQuery: '',
    statusFilter: 'all',
    severityFilter: 'all',
    originFilter: 'all',
    categoryFilter: 'all',
    confidenceMin: 0,
    timeRangeFilter: 'all',
    sortBy: 'detected_at',
    sortOrder: 'desc',
  }),
}));
