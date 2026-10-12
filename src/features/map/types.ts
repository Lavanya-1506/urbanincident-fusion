import { IncidentSeverity } from '../../types';

export type CameraViewMode = 'overview' | 'incident_focus' | 'lowlands' | 'sensor_focus';

export type SensorType = 
  | 'rainfall_radar'
  | 'ultrasonic_depth' 
  | 'scada_pump' 
  | 'traffic_speed' 
  | 'citizen_cluster';

export type SensorHealthStatus = 'healthy' | 'warning' | 'critical' | 'unverified';

export type CausalRelationType =
  | 'observed_association'
  | 'temporal_precedence'
  | 'supporting_evidence'
  | 'contradictory_evidence'
  | 'model_inferred_hypothesis';

export interface SensorNode3D {
  id: string;
  name: string;
  type: SensorType;
  position: [number, number, number];
  status: SensorHealthStatus;
  currentValue: string;
  unit: string;
  isTriggered: boolean;
  threshold?: string;
  isSimulated: true;
}

export interface RoadSegment3D {
  id: string;
  name: string;
  start: [number, number, number];
  end: [number, number, number];
  width: number;
  isCongested: boolean;
  currentSpeedKmh: number;
  baselineSpeedKmh: number;
}

export interface CorrelationLink3D {
  id: string;
  from: [number, number, number];
  to: [number, number, number];
  relationType: CausalRelationType;
  label: string;
  confidence: number;
}

export interface ScenarioTickData {
  tick: number; // 0, 20, 35, 45, 55, 70, 90
  tickLabel: string; // 'T+00', 'T+20', etc.
  title: string;
  description: string;
  rainfallMmH: number;
  waterDepthCm: number;
  trafficSpeedKmh: number;
  isPumpTripped: boolean;
  citizenReportsCount: number;
  incidentSeverity: IncidentSeverity;
  incidentConfidence: number;
  candidateIncidentCreated: boolean;
  activeSensors: string[];
  activeLinks: CorrelationLink3D[];
  cameraFocus: [number, number, number];
}
