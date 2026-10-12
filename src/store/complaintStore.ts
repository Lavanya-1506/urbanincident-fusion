import { create } from 'zustand';

export type IncidentCategory = 
  | 'waterlogging' 
  | 'drain_blockage' 
  | 'pump_failure' 
  | 'traffic_gridlock' 
  | 'pipe_rupture' 
  | 'manhole_hazard';

export type ComplaintSeverity = 'low' | 'moderate' | 'high' | 'critical';

export interface AreaComplaint {
  id: string;
  trackingNumber: string;
  zone: string;
  address: string;
  latitude: number;
  longitude: number;
  category: IncidentCategory;
  severity: ComplaintSeverity;
  conditionDescription: string;
  waterLevelCm?: number;
  trafficHalted: boolean;
  powerOutage: boolean;
  citizenName?: string;
  citizenContact?: string;
  submittedAt: string;
  status: 'received' | 'under_investigation' | 'dispatched' | 'resolved';
  assignedOrganisation: string;
  targetSlaMinutes: number;
  linkedIncidentId?: string;
  photoUrl?: string;
  notes?: string;
}

interface ComplaintState {
  complaints: AreaComplaint[];
  isRaiseComplaintOpen: boolean;
  selectedAreaPreset: string;
  
  setIsRaiseComplaintOpen: (open: boolean) => void;
  setSelectedAreaPreset: (area: string) => void;
  submitComplaint: (complaintData: Omit<AreaComplaint, 'id' | 'trackingNumber' | 'submittedAt' | 'status' | 'assignedOrganisation' | 'targetSlaMinutes'>) => AreaComplaint;
}

const INITIAL_COMPLAINTS: AreaComplaint[] = [
  {
    id: 'cmp_01',
    trackingNumber: 'C311-2026-90412',
    zone: 'Sector 4 - Commercial Central',
    address: 'Western Express Flyover Descent, Junction 14 Underpass',
    latitude: 19.0825,
    longitude: 72.8812,
    category: 'waterlogging',
    severity: 'critical',
    conditionDescription: 'Water accumulation above 45cm entering roadside shops. 3 public transit buses stalled in underpass lanes.',
    waterLevelCm: 48,
    trafficHalted: true,
    powerOutage: true,
    citizenName: 'Rohit Deshmukh',
    citizenContact: '+91 98201 XXXXX',
    submittedAt: '2026-10-12T06:24:00Z',
    status: 'dispatched',
    assignedOrganisation: 'Emergency Municipal Drainage Squad & Traffic Control Bureau',
    targetSlaMinutes: 15,
    linkedIncidentId: 'INC-2026-8841',
  },
  {
    id: 'cmp_02',
    trackingNumber: 'C311-2026-90388',
    zone: 'Zone H-East (Western Express Corridor)',
    address: 'Near Culvert Invert Sump #912, Station Road Junction',
    latitude: 19.0818,
    longitude: 72.8825,
    category: 'pump_failure',
    severity: 'high',
    conditionDescription: 'Stormwater pump station stopped humming 20 minutes ago. Invert water level rising rapidly toward road crest.',
    waterLevelCm: 32,
    trafficHalted: false,
    powerOutage: false,
    citizenName: 'Anil Mehta (Area Shop Owner)',
    citizenContact: '+91 97692 XXXXX',
    submittedAt: '2026-10-12T06:30:15Z',
    status: 'under_investigation',
    assignedOrganisation: 'Hydraulic Engineering & Pump Station Maintenance Cell',
    targetSlaMinutes: 30,
    linkedIncidentId: 'INC-2026-8841',
  },
  {
    id: 'cmp_03',
    trackingNumber: 'C311-2026-89912',
    zone: 'Ward F-North (Dharavi Drainage Basin)',
    address: 'Sector 5 Outfall Canal Ingress, 90 Feet Road',
    latitude: 19.0435,
    longitude: 72.8572,
    category: 'drain_blockage',
    severity: 'moderate',
    conditionDescription: 'Culvert grill clogged with solid waste debris preventing gravity discharge into tidal canal.',
    waterLevelCm: 20,
    trafficHalted: false,
    powerOutage: false,
    citizenName: 'Civic Field Volunteer',
    citizenContact: '+91 99304 XXXXX',
    submittedAt: '2026-10-12T05:45:00Z',
    status: 'resolved',
    assignedOrganisation: 'Municipal Solid Waste & Stormwater Drainage Unit',
    targetSlaMinutes: 45,
    linkedIncidentId: 'INC-2026-7731',
  }
];

export const useComplaintStore = create<ComplaintState>((set, get) => ({
  complaints: INITIAL_COMPLAINTS,
  isRaiseComplaintOpen: false,
  selectedAreaPreset: 'Sector 4 - Commercial Central',

  setIsRaiseComplaintOpen: (open) => set({ isRaiseComplaintOpen: open }),
  setSelectedAreaPreset: (area) => set({ selectedAreaPreset: area }),

  submitComplaint: (data) => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = `C311-2026-${randomSuffix}`;
    const newId = `cmp_${Date.now()}`;

    // Determine target organisation and SLA based on category and severity
    let assignedOrganisation = 'Emergency Municipal Drainage Squad';
    let targetSlaMinutes = 30;

    if (data.severity === 'critical') {
      assignedOrganisation = 'Emergency Disaster Response Squad & Rapid Municipal Deployment';
      targetSlaMinutes = 15;
    } else if (data.category === 'pump_failure') {
      assignedOrganisation = 'Hydraulic Engineering & Pump Station Maintenance Division';
      targetSlaMinutes = 20;
    } else if (data.category === 'traffic_gridlock') {
      assignedOrganisation = 'Traffic Management Directorate & Police Rapid Response';
      targetSlaMinutes = 20;
    } else if (data.category === 'drain_blockage') {
      assignedOrganisation = 'Municipal Drainage Maintenance & Silt Clearance Squad';
      targetSlaMinutes = 45;
    } else if (data.category === 'manhole_hazard') {
      assignedOrganisation = 'Civil Infrastructure & Underground Asset Safety Cell';
      targetSlaMinutes = 15;
    }

    // Check spatial linkage with known incident areas
    let linkedIncidentId: string | undefined = undefined;
    if (data.zone.includes('Sector 4') || data.address.toLowerCase().includes('junction 14')) {
      linkedIncidentId = 'INC-2026-8841';
    } else if (data.zone.includes('Dharavi')) {
      linkedIncidentId = 'INC-2026-7731';
    } else if (data.zone.includes('Expressway') || data.zone.includes('Zone H')) {
      linkedIncidentId = 'INC-2026-9012';
    }

    const newComplaint: AreaComplaint = {
      ...data,
      id: newId,
      trackingNumber,
      submittedAt: new Date().toISOString(),
      status: 'received',
      assignedOrganisation,
      targetSlaMinutes,
      linkedIncidentId,
    };

    set((state) => ({
      complaints: [newComplaint, ...state.complaints],
    }));

    return newComplaint;
  },
}));
