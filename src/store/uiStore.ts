import { create } from 'zustand';
import { UserRole } from '../types';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  incidentId?: string;
}

interface UiState {
  isSearchOpen: boolean;
  isDetailDrawerOpen: boolean;
  isNotificationsOpen: boolean;
  mapMode: '3d' | '2d';
  currentRole: UserRole;
  layers: {
    weatherRadar: boolean;
    waterSensors: boolean;
    trafficProbes: boolean;
    citizenAlerts: boolean;
    buildingFootprints: boolean;
    waterFloodExtents: boolean;
  };
  notifications: NotificationItem[];

  setIsSearchOpen: (open: boolean) => void;
  setIsDetailDrawerOpen: (open: boolean) => void;
  setIsNotificationsOpen: (open: boolean) => void;
  setMapMode: (mode: '3d' | '2d') => void;
  setCurrentRole: (role: UserRole) => void;
  toggleLayer: (layerName: keyof UiState['layers']) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Severe Water Inundation Threshold Breached',
    message: 'Junction 14 depth gauge exceeded 45cm. Sump Pump 02 trip corroborated.',
    type: 'critical',
    timestamp: '2 mins ago',
    read: false,
    incidentId: 'INC-2026-8841'
  },
  {
    id: 'notif_2',
    title: 'Near-Duplicate Reports Aggregated',
    message: '15 redundant citizen submissions clustered under Western Express Corridor.',
    type: 'info',
    timestamp: '8 mins ago',
    read: false,
    incidentId: 'INC-2026-8841'
  },
  {
    id: 'notif_3',
    title: 'Delayed Telemetry Ingested',
    message: 'SCADA Station 4 telemetry arrived with 4-minute lag and updated causal plausibility.',
    type: 'warning',
    timestamp: '14 mins ago',
    read: true,
    incidentId: 'INC-2026-8841'
  }
];

export const useUiStore = create<UiState>((set) => ({
  isSearchOpen: false,
  isDetailDrawerOpen: false,
  isNotificationsOpen: false,
  mapMode: '2d',
  currentRole: 'operations_analyst',
  layers: {
    weatherRadar: true,
    waterSensors: true,
    trafficProbes: true,
    citizenAlerts: true,
    buildingFootprints: true,
    waterFloodExtents: true,
  },
  notifications: INITIAL_NOTIFICATIONS,

  setIsSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
  setIsDetailDrawerOpen: (isDetailDrawerOpen) => set({ isDetailDrawerOpen }),
  setIsNotificationsOpen: (isNotificationsOpen) => set({ isNotificationsOpen }),
  setMapMode: (mapMode) => set({ mapMode }),
  setCurrentRole: (currentRole) => set({ currentRole }),
  toggleLayer: (layerName) => set((state) => ({
    layers: {
      ...state.layers,
      [layerName]: !state.layers[layerName],
    }
  })),
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  clearNotifications: () => set({ notifications: [] }),
}));
