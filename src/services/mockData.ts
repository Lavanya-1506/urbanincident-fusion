import { 
  Incident, 
  DataSourceHealth, 
  OperationalMetrics, 
  ReplayFrame, 
  CanonicalEvent 
} from '../types';

export const INITIAL_DATA_SOURCES: DataSourceHealth[] = [
  {
    source_id: 'src_weather_radar_01',
    name: 'Met Doppler Weather Radar (C-Band)',
    protocol: 'REST_POLL',
    category: 'meteorological',
    status: 'healthy',
    freshness_seconds: 42,
    events_per_minute: 120,
    error_rate_pct: 0.05,
    last_success_timestamp: new Date(Date.now() - 42000).toISOString(),
    quarantined_last_24h: 1,
    active_warnings: [],
  },
  {
    source_id: 'src_iot_stormwater_net',
    name: 'Municipal Ultrasonic Water Level Network',
    protocol: 'MQTT',
    category: 'telemetry_iot',
    status: 'healthy',
    freshness_seconds: 15,
    events_per_minute: 480,
    error_rate_pct: 0.12,
    last_success_timestamp: new Date(Date.now() - 15000).toISOString(),
    quarantined_last_24h: 3,
    active_warnings: [],
  },
  {
    source_id: 'src_transit_speed_probe',
    name: 'Urban Transit Telemetry & Speed Probes',
    protocol: 'KAFKA',
    category: 'mobility_traffic',
    status: 'healthy',
    freshness_seconds: 8,
    events_per_minute: 1420,
    error_rate_pct: 0.01,
    last_success_timestamp: new Date(Date.now() - 8000).toISOString(),
    quarantined_last_24h: 0,
    active_warnings: [],
  },
  {
    source_id: 'src_citizen_311_feed',
    name: 'Citizen Mobile 311 Civic Reporting',
    protocol: 'WEBHOOK',
    category: 'crowdsourced',
    status: 'healthy',
    freshness_seconds: 64,
    events_per_minute: 45,
    error_rate_pct: 0.85,
    last_success_timestamp: new Date(Date.now() - 64000).toISOString(),
    quarantined_last_24h: 12,
    active_warnings: ['Spike in duplicate submissions detected'],
  },
  {
    source_id: 'src_scada_pump_telemetry',
    name: 'Storm Drainage SCADA Outfall Station 4',
    protocol: 'REST_POLL',
    category: 'infrastructure',
    status: 'degraded',
    freshness_seconds: 240,
    events_per_minute: 18,
    error_rate_pct: 3.4,
    last_success_timestamp: new Date(Date.now() - 240000).toISOString(),
    quarantined_last_24h: 8,
    active_warnings: ['Sump Pump 2 Telemetry Intermittent', 'Polling lag > 3 min'],
  },
  {
    source_id: 'src_cctv_ai_traffic_vision',
    name: 'City Intersection CCTV Flow Detection',
    protocol: 'REST_POLL',
    category: 'mobility_traffic',
    status: 'healthy',
    freshness_seconds: 30,
    events_per_minute: 310,
    error_rate_pct: 0.22,
    last_success_timestamp: new Date(Date.now() - 30000).toISOString(),
    quarantined_last_24h: 2,
    active_warnings: [],
  },
  {
    source_id: 'src_rain_gauges_imd',
    name: 'Regional Rain Gauge Micro-Array',
    protocol: 'REST_POLL',
    category: 'meteorological',
    status: 'healthy',
    freshness_seconds: 120,
    events_per_minute: 60,
    error_rate_pct: 0.0,
    last_success_timestamp: new Date(Date.now() - 120000).toISOString(),
    quarantined_last_24h: 0,
    active_warnings: [],
  },
  {
    source_id: 'src_power_grid_substations',
    name: 'Metropolitan Grid Feeder Status',
    protocol: 'KAFKA',
    category: 'infrastructure',
    status: 'stale',
    freshness_seconds: 520,
    events_per_minute: 12,
    error_rate_pct: 5.8,
    last_success_timestamp: new Date(Date.now() - 520000).toISOString(),
    quarantined_last_24h: 5,
    active_warnings: ['Heartbeat packet delayed: Substation West-9'],
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-8841',
    title: 'Waterlogging & Severe Road Inundation - Junction 14 / Western Express Corridor',
    type: 'waterlogging',
    status: 'confirmed',
    severity: 'critical',
    confidence: 0.94,
    origin: 'simulated_scenario',
    detected_at: '2026-10-12T06:35:00Z',
    updated_at: '2026-10-12T07:15:22Z',
    first_observed_at: '2026-10-12T06:12:00Z',
    assigned_to: 'Operator J. Vance (ID #402)',
    location: {
      latitude: 19.0825,
      longitude: 72.8812,
      address: 'Junction 14, Western Express Flyover Underpass, Ward H-East',
      zone: 'Sector 4 - Commercial Central',
      elevation_m: 4.2
    },
    metrics: {
      water_level_cm: 48.5,
      rainfall_rate_mm_h: 68.2,
      traffic_speed_kmh: 4.8,
      affected_radius_m: 420,
      citizen_reports_count: 14
    },
    assessment_versions: [
      {
        version: 1,
        generated_at: '2026-10-12T06:22:00Z',
        severity: 'medium',
        confidence: 0.62,
        summary: 'Isolated precipitation alert detected by C-band radar with early ponding sensor trigger.',
        trigger_event_id: 'evt_radar_801',
        hypotheses_count: 1
      },
      {
        version: 2,
        generated_at: '2026-10-12T06:40:00Z',
        severity: 'high',
        confidence: 0.81,
        summary: 'Ultrasonic storm drain level crossed 30cm threshold; 4 citizen complaints correlated; traffic speed dropped 75%.',
        trigger_event_id: 'evt_iot_904',
        hypotheses_count: 2
      },
      {
        version: 3,
        generated_at: '2026-10-12T07:10:00Z',
        severity: 'critical',
        confidence: 0.94,
        summary: 'Corroborated waterlogging exceeding 45cm with SCADA sump pump failure telemetry and verified vehicle stall reports.',
        trigger_event_id: 'evt_scada_302',
        hypotheses_count: 3
      }
    ],
    observations: [
      {
        event_id: 'evt_radar_801',
        source_id: 'src_weather_radar_01',
        source_record_id: 'RAD-20261012-0612',
        event_type: 'weather_radar_cell',
        occurred_at: '2026-10-12T06:12:00Z',
        observed_at: '2026-10-12T06:12:00Z',
        ingested_at: '2026-10-12T06:13:05Z',
        location: { latitude: 19.083, longitude: 72.880 },
        payload: { reflectivity_dbz: 54, precipitation_rate_mm_h: 72.0, storm_direction: 'NE' },
        quality: { is_valid: true, is_stale: false, flags: [] },
        schema_version: '1.0',
        origin: 'simulated_scenario'
      },
      {
        event_id: 'evt_iot_901',
        source_id: 'src_iot_stormwater_net',
        source_record_id: 'US-NODE-402-A',
        event_type: 'ultrasonic_depth_reading',
        occurred_at: '2026-10-12T06:18:00Z',
        observed_at: '2026-10-12T06:18:00Z',
        ingested_at: '2026-10-12T06:18:15Z',
        location: { latitude: 19.0825, longitude: 72.8812 },
        payload: { water_depth_cm: 22.4, rate_of_rise_cm_min: 1.8, battery_v: 3.9 },
        quality: { is_valid: true, is_stale: false, flags: [] },
        schema_version: '1.0',
        origin: 'simulated_scenario'
      },
      {
        event_id: 'evt_citizen_102',
        source_id: 'src_citizen_311_feed',
        source_record_id: 'C311-89301',
        event_type: 'citizen_waterlogging_complaint',
        occurred_at: '2026-10-12T06:24:00Z',
        observed_at: '2026-10-12T06:24:00Z',
        ingested_at: '2026-10-12T06:25:22Z',
        location: { latitude: 19.0828, longitude: 72.8815 },
        payload: { description: 'Water entering shop fronts near Junction 14 flyover descent. Buses slowing.', user_urgency: 'high' },
        quality: { is_valid: true, is_stale: false, flags: [] },
        schema_version: '1.0',
        origin: 'simulated_scenario'
      },
      {
        event_id: 'evt_citizen_103_dup',
        source_id: 'src_citizen_311_feed',
        source_record_id: 'C311-89304',
        event_type: 'citizen_waterlogging_complaint',
        occurred_at: '2026-10-12T06:25:00Z',
        observed_at: '2026-10-12T06:25:00Z',
        ingested_at: '2026-10-12T06:26:10Z',
        location: { latitude: 19.0827, longitude: 72.8814 },
        payload: { description: 'Heavy water under flyover J-14', user_urgency: 'high' },
        quality: { is_valid: true, is_stale: false, flags: ['near_duplicate_cluster_hash'] },
        schema_version: '1.0',
        is_duplicate: true,
        duplicate_of: 'evt_citizen_102',
        origin: 'simulated_scenario'
      },
      {
        event_id: 'evt_traffic_740',
        source_id: 'src_transit_speed_probe',
        source_record_id: 'SPEED-SEG-882',
        event_type: 'corridor_speed_anomaly',
        occurred_at: '2026-10-12T06:28:00Z',
        observed_at: '2026-10-12T06:28:00Z',
        ingested_at: '2026-10-12T06:28:30Z',
        location: { latitude: 19.0821, longitude: 72.8809 },
        payload: { mean_speed_kmh: 4.8, baseline_speed_kmh: 42.0, congestion_index: 0.96 },
        quality: { is_valid: true, is_stale: false, flags: [] },
        schema_version: '1.0',
        origin: 'simulated_scenario'
      },
      {
        event_id: 'evt_scada_302',
        source_id: 'src_scada_pump_telemetry',
        source_record_id: 'PUMP-4-TRIP',
        event_type: 'pump_station_fault',
        occurred_at: '2026-10-12T06:34:00Z',
        observed_at: '2026-10-12T06:34:00Z',
        ingested_at: '2026-10-12T06:38:00Z', // 4 min ingestion lag!
        location: { latitude: 19.0818, longitude: 72.8825 },
        payload: { pump_unit: 'PUMP_02', trip_code: 'OVERLOAD_IMPEDED_IMPELLER', discharge_lps: 0 },
        quality: { is_valid: true, is_stale: false, flags: ['delayed_ingestion_4m'] },
        schema_version: '1.0',
        origin: 'simulated_scenario'
      }
    ],
    evidence: [
      {
        id: 'ev_01',
        source_id: 'src_iot_stormwater_net',
        source_name: 'Ultrasonic Sensor Node US-402-A',
        source_type: 'iot_water_level',
        evidence_role: 'supporting',
        confidence_score: 0.98,
        occurred_at: '2026-10-12T06:18:00Z',
        ingested_at: '2026-10-12T06:18:15Z',
        summary: 'Direct water depth telemetry reached 48.5cm, exceeding the Tier-3 emergency threshold (35cm).',
        raw_metric: '48.5 cm (+1.8 cm/min rise rate)',
        provenance_url: 'internal://telemetry/iot/US-402-A/timeseries',
        quality: { is_valid: true, is_stale: false, flags: [] }
      },
      {
        id: 'ev_02',
        source_id: 'src_weather_radar_01',
        source_name: 'Doppler Radar C-Band',
        source_type: 'weather_radar',
        evidence_role: 'supporting',
        confidence_score: 0.92,
        occurred_at: '2026-10-12T06:12:00Z',
        ingested_at: '2026-10-12T06:13:05Z',
        summary: 'Extreme localized precipitation cell (54 dBZ) delivering sustained 68.2 mm/hr over Junction 14 basin.',
        raw_metric: '68.2 mm/h localized cloudburst rate',
        provenance_url: 'internal://meteorology/doppler/cells/RAD-20261012-0612',
        quality: { is_valid: true, is_stale: false, flags: [] }
      },
      {
        id: 'ev_03',
        source_id: 'src_transit_speed_probe',
        source_name: 'Transit Speed Probes Segment #882',
        source_type: 'traffic_speed',
        evidence_role: 'supporting',
        confidence_score: 0.95,
        occurred_at: '2026-10-12T06:28:00Z',
        ingested_at: '2026-10-12T06:28:30Z',
        summary: 'Corridor traffic velocity dropped from 42 km/h to 4.8 km/h across 800m segment coinciding with water rise.',
        raw_metric: '4.8 km/h (-88.5% below baseline)',
        provenance_url: 'internal://traffic/probes/SEG-882',
        quality: { is_valid: true, is_stale: false, flags: [] }
      },
      {
        id: 'ev_04',
        source_id: 'src_scada_pump_telemetry',
        source_name: 'SCADA Sump Pump Station 4',
        source_type: 'drain_pump_telemetry',
        evidence_role: 'supporting',
        confidence_score: 0.89,
        occurred_at: '2026-10-12T06:34:00Z',
        ingested_at: '2026-10-12T06:38:00Z',
        summary: 'Primary drainage pump PUMP_02 tripped due to mechanical impeller stall, leaving outfall discharge at 0 LPS.',
        raw_metric: 'Pump 02 tripped / 0 LPS discharge',
        provenance_url: 'internal://scada/pumps/station4/logs',
        quality: { is_valid: true, is_stale: false, flags: ['delayed_ingestion_4m'] }
      },
      {
        id: 'ev_05',
        source_id: 'src_citizen_311_feed',
        source_name: 'Citizen Reports Cluster (14 Submissions)',
        source_type: 'citizen_report',
        evidence_role: 'supporting',
        confidence_score: 0.84,
        occurred_at: '2026-10-12T06:24:00Z',
        ingested_at: '2026-10-12T06:25:22Z',
        summary: '14 corroborating civilian reports of flooded underpass and stalled cars, deduplicated from 29 total submissions.',
        raw_metric: '14 verified unique reports (15 duplicates suppressed)',
        provenance_url: 'internal://crm/311/clusters/CL-8841',
        quality: { is_valid: true, is_stale: false, flags: ['deduplicated_cluster'] }
      },
      {
        id: 'ev_06',
        source_id: 'src_cctv_ai_traffic_vision',
        source_name: 'Cam 14-North CCTV Computer Vision',
        source_type: 'cctv_vision',
        evidence_role: 'contextual',
        confidence_score: 0.76,
        occurred_at: '2026-10-12T06:45:00Z',
        ingested_at: '2026-10-12T06:46:10Z',
        summary: 'CCTV video analytics detects water surface reflection covering all 4 lanes and 2 stranded transit buses.',
        raw_metric: '4 lanes submerged / 2 stalled buses classified',
        provenance_url: 'internal://cctv/analytics/CAM-14-N',
        quality: { is_valid: true, is_stale: false, flags: [] }
      }
    ],
    hypotheses: [
      {
        id: 'hyp_01',
        title: 'Cascade: Heavy Monsoonal Cloudburst coupled with Outfall Pump Tripping',
        root_cause_explanation: 'Intense short-duration rainfall (68 mm/h) saturated gravity drains. Concurrently, SCADA telemetry confirms Pump 02 tripped on debris overload at 06:34 UTC, arresting secondary drainage discharge and creating rapid backwater inundation in the underpass basin.',
        plausibility_score: 0.92,
        uncertainty_level: 'low',
        supporting_evidence_ids: ['ev_01', 'ev_02', 'ev_03', 'ev_04', 'ev_05', 'ev_06'],
        contradicting_evidence_ids: [],
        unknowns: ['Status of manual bypass flap valve at Culvert 4B', 'Current intake screen trash rack blockage level'],
        recommended_interventions: [
          'Dispatch municipal emergency pump crew to manually clear Impeller on Pump 02',
          'Deploy traffic police diversion at Junction 13 Flyover Exit Ramp',
          'Issue automated civic transit alert rerouting buses away from Western Express Underpass'
        ],
        model_id: 'causal_fusion_bayesian_v2.4',
        evaluated_at: '2026-10-12T07:12:00Z'
      },
      {
        id: 'hyp_02',
        title: 'Pure Upstream Catchment Inundation without Structural Failure',
        root_cause_explanation: 'Inundation solely caused by sheer volume of rainfall exceeding stormwater network hydraulic capacity, irrespective of pump station mechanical status.',
        plausibility_score: 0.38,
        uncertainty_level: 'moderate',
        supporting_evidence_ids: ['ev_02'],
        contradicting_evidence_ids: ['ev_04'],
        unknowns: ['Actual gravity flow rate vs engineered peak design head'],
        recommended_interventions: [
          'Wait for storm cell to pass and monitor natural discharge curve'
        ],
        model_id: 'causal_fusion_bayesian_v2.4',
        evaluated_at: '2026-10-12T07:12:00Z'
      },
      {
        id: 'hyp_03',
        title: 'Water Main Pipe Rupture mimicking Surface Waterlogging',
        root_cause_explanation: 'Subsurface potable water distribution line breach causing localized ponding regardless of rainfall intensity.',
        plausibility_score: 0.08,
        uncertainty_level: 'high',
        supporting_evidence_ids: ['ev_01'],
        contradicting_evidence_ids: ['ev_02', 'ev_04'],
        unknowns: ['Potable water pressure sensor logs in Zone H-East'],
        recommended_interventions: [
          'Request water board telemetry check on 600mm distribution trunk'
        ],
        model_id: 'causal_fusion_bayesian_v2.4',
        evaluated_at: '2026-10-12T07:12:00Z'
      }
    ],
    audit_history: [
      {
        id: 'aud_01',
        timestamp: '2026-10-12T06:22:10Z',
        actor: 'Fusion Engine Daemon',
        actor_role: 'system',
        action_type: 'status_transition',
        previous_value: 'none',
        new_value: 'detected',
        rationale: 'Created candidate incident based on spatial-temporal correlation between Doppler radar (54 dBZ) and IoT ultrasonic sensor US-402-A.'
      },
      {
        id: 'aud_02',
        timestamp: '2026-10-12T06:41:00Z',
        actor: 'Fusion Engine Daemon',
        actor_role: 'system',
        action_type: 'evidence_link',
        previous_value: '2 evidence items',
        new_value: '5 evidence items',
        rationale: 'Correlated 14 deduplicated citizen reports and transit speed drop of -88%.'
      },
      {
        id: 'aud_03',
        timestamp: '2026-10-12T06:48:30Z',
        actor: 'Operator J. Vance',
        actor_role: 'operations_analyst',
        action_type: 'status_transition',
        previous_value: 'detected',
        new_value: 'under_review',
        rationale: 'Initiated active investigation. Verified ultrasonic telemetry matches citizen visual reports.'
      },
      {
        id: 'aud_04',
        timestamp: '2026-10-12T07:10:15Z',
        actor: 'Supervisor S. Chen',
        actor_role: 'operations_supervisor',
        action_type: 'status_transition',
        previous_value: 'under_review',
        new_value: 'confirmed',
        rationale: 'Confirmed critical emergency status following SCADA pump failure confirmation. Notified Traffic Division & Emergency Drainage Squad.'
      }
    ]
  },

  {
    id: 'INC-2026-8839',
    title: 'Flash Flood Risk & Culvert Choke - Sector 9 Lowlands',
    type: 'flash_flood',
    status: 'under_review',
    severity: 'high',
    confidence: 0.83,
    origin: 'imported_dataset',
    detected_at: '2026-10-12T05:50:00Z',
    updated_at: '2026-10-12T07:05:00Z',
    first_observed_at: '2026-10-12T05:42:00Z',
    assigned_to: 'Operator R. Gomez (ID #319)',
    location: {
      latitude: 19.0710,
      longitude: 72.8640,
      address: 'Culvert 9B, Lowlands Drainage Canal, Sector 9',
      zone: 'Sector 9 - Industrial Basin',
      elevation_m: 2.8
    },
    metrics: {
      water_level_cm: 36.2,
      rainfall_rate_mm_h: 44.0,
      traffic_speed_kmh: 18.5,
      affected_radius_m: 280,
      citizen_reports_count: 5
    },
    assessment_versions: [
      {
        version: 1,
        generated_at: '2026-10-12T05:50:00Z',
        severity: 'high',
        confidence: 0.83,
        summary: 'Culvert pressure rise detected with rapid water level climb.',
        trigger_event_id: 'evt_culvert_441',
        hypotheses_count: 2
      }
    ],
    observations: [],
    evidence: [
      {
        id: 'ev_culv_1',
        source_id: 'src_iot_stormwater_net',
        source_name: 'Culvert Pressure & Depth Sensor C9B',
        source_type: 'iot_water_level',
        evidence_role: 'supporting',
        confidence_score: 0.91,
        occurred_at: '2026-10-12T05:45:00Z',
        ingested_at: '2026-10-12T05:45:30Z',
        summary: 'Canal water level rose to 36.2cm, 85% of embankment crest capacity.',
        raw_metric: '36.2 cm (Crest limit: 42.0 cm)',
        quality: { is_valid: true, is_stale: false, flags: [] }
      }
    ],
    hypotheses: [
      {
        id: 'hyp_culv_01',
        title: 'Debris Trash-Rack Clogging at Outfall Screen',
        root_cause_explanation: 'Storm runoff carried urban solid waste to culvert entrance screen, causing 60% hydraulic restriction.',
        plausibility_score: 0.84,
        uncertainty_level: 'moderate',
        supporting_evidence_ids: ['ev_culv_1'],
        contradicting_evidence_ids: [],
        unknowns: ['Physical visual confirmation of screen condition'],
        recommended_interventions: ['Dispatch mechanical backhoe to clear culvert trash rack'],
        model_id: 'causal_fusion_bayesian_v2.4',
        evaluated_at: '2026-10-12T06:00:00Z'
      }
    ],
    audit_history: [
      {
        id: 'aud_culv_1',
        timestamp: '2026-10-12T05:50:00Z',
        actor: 'Fusion Engine Daemon',
        actor_role: 'system',
        action_type: 'status_transition',
        previous_value: 'none',
        new_value: 'under_review',
        rationale: 'Created candidate incident and automatically assigned to duty analyst.'
      }
    ]
  },

  {
    id: 'INC-2026-8835',
    title: 'Secondary Traffic Congestion Cascade - King Circle Flyover Junction',
    type: 'traffic_congestion',
    status: 'monitoring',
    severity: 'medium',
    confidence: 0.88,
    origin: 'real_backend',
    detected_at: '2026-10-12T05:10:00Z',
    updated_at: '2026-10-12T06:55:00Z',
    first_observed_at: '2026-10-12T05:00:00Z',
    assigned_to: 'Operator T. Wright (ID #208)',
    location: {
      latitude: 19.0620,
      longitude: 72.8580,
      address: 'King Circle Central Interchange, North Arterial',
      zone: 'Sector 2 - Residential/Arterial',
      elevation_m: 6.5
    },
    metrics: {
      water_level_cm: 12.0,
      rainfall_rate_mm_h: 22.0,
      traffic_speed_kmh: 8.2,
      affected_radius_m: 600,
      citizen_reports_count: 8
    },
    assessment_versions: [
      {
        version: 1,
        generated_at: '2026-10-12T05:10:00Z',
        severity: 'medium',
        confidence: 0.88,
        summary: 'Vehicles slowing due to reduced visibility and minor curb water accumulation.',
        trigger_event_id: 'evt_traffic_601',
        hypotheses_count: 1
      }
    ],
    observations: [],
    evidence: [],
    hypotheses: [],
    audit_history: []
  },

  {
    id: 'INC-2026-8830',
    title: 'Drainage Outfall Gate Silt Deposition - Marine Pier Discharge',
    type: 'drainage_blockage',
    status: 'resolved',
    severity: 'low',
    confidence: 0.91,
    origin: 'real_backend',
    detected_at: '2026-10-12T03:30:00Z',
    updated_at: '2026-10-12T06:10:00Z',
    first_observed_at: '2026-10-12T03:15:00Z',
    assigned_to: 'Supervisor S. Chen (ID #101)',
    location: {
      latitude: 19.0550,
      longitude: 72.8350,
      address: 'Marine Pier Outfall Sluice Gate #3',
      zone: 'Coastal Outfall Sector',
      elevation_m: 1.2
    },
    metrics: {
      water_level_cm: 8.0,
      rainfall_rate_mm_h: 12.0,
      traffic_speed_kmh: 38.0,
      affected_radius_m: 100,
      citizen_reports_count: 1
    },
    assessment_versions: [],
    observations: [],
    evidence: [],
    hypotheses: [],
    audit_history: []
  },

  {
    id: 'INC-2026-8845',
    title: 'Candidate Alert: Stormwater Surcharge Warning - Metro Portal Underpass',
    type: 'stormwater_overflow',
    status: 'detected',
    severity: 'high',
    confidence: 0.71,
    origin: 'synthetic_demo',
    detected_at: '2026-10-12T07:05:00Z',
    updated_at: '2026-10-12T07:14:00Z',
    first_observed_at: '2026-10-12T06:58:00Z',
    location: {
      latitude: 19.0910,
      longitude: 72.8710,
      address: 'Metro Line 3 Portal Underpass, Eastern Access Road',
      zone: 'Transit Corridor East',
      elevation_m: 3.5
    },
    metrics: {
      water_level_cm: 28.0,
      rainfall_rate_mm_h: 52.0,
      traffic_speed_kmh: 14.0,
      affected_radius_m: 220,
      citizen_reports_count: 3
    },
    assessment_versions: [],
    observations: [],
    evidence: [],
    hypotheses: [],
    audit_history: []
  }
];

export const INITIAL_METRICS: OperationalMetrics = {
  active_incidents_count: 4,
  critical_unresolved_count: 1,
  events_ingested_1h: 18450,
  median_ttr_minutes: 6.8,
  sources_healthy_ratio: { healthy: 6, total: 8 },
  system_data_freshness_seconds: 14,
  duplicate_filtered_ratio: 0.42,
  fusion_precision_score: 0.942
};

export const REPLAY_DEMO_FRAMES: ReplayFrame[] = [
  {
    step_number: 1,
    timestamp: '06:12:00 UTC',
    label: 'Doppler Radar Storm Cell Detected',
    active_event: {
      event_id: 'evt_radar_801',
      source_id: 'src_weather_radar_01',
      source_record_id: 'RAD-0612',
      event_type: 'radar_cloudburst_cell',
      occurred_at: '2026-10-12T06:12:00Z',
      observed_at: '2026-10-12T06:12:00Z',
      ingested_at: '2026-10-12T06:13:05Z',
      location: { latitude: 19.083, longitude: 72.880, address: 'Junction 14 Basin' },
      payload: { reflectivity: '54 dBZ', precipitation: '72 mm/h' },
      quality: { is_valid: true, is_stale: false, flags: [] },
      schema_version: '1.0',
      origin: 'simulated_scenario'
    },
    fusion_decision: 'associated',
    narrative: 'Met Doppler radar identifies localized convective cell over Junction 14. Initial candidate incident instantiated.',
    incident_snapshot: {
      status: 'detected',
      severity: 'medium',
      confidence: 0.62,
      metrics: { water_level_cm: 5.0, rainfall_rate_mm_h: 72.0, traffic_speed_kmh: 42.0, citizen_reports_count: 0 }
    }
  },
  {
    step_number: 2,
    timestamp: '06:18:15 UTC',
    label: 'IoT Ultrasonic Drain Sensor Triggered',
    active_event: {
      event_id: 'evt_iot_901',
      source_id: 'src_iot_stormwater_net',
      source_record_id: 'US-NODE-402-A',
      event_type: 'ultrasonic_depth_reading',
      occurred_at: '2026-10-12T06:18:00Z',
      observed_at: '2026-10-12T06:18:00Z',
      ingested_at: '2026-10-12T06:18:15Z',
      location: { latitude: 19.0825, longitude: 72.8812, address: 'Underpass Drain Invert' },
      payload: { depth: '22.4 cm', rate_of_rise: '+1.8 cm/min' },
      quality: { is_valid: true, is_stale: false, flags: [] },
      schema_version: '1.0',
      origin: 'simulated_scenario'
    },
    fusion_decision: 'associated',
    narrative: 'Spatial-temporal association binds US-402-A telemetry to radar cell. Water level climbing at 1.8 cm/min.',
    incident_snapshot: {
      status: 'detected',
      severity: 'medium',
      confidence: 0.76,
      metrics: { water_level_cm: 22.4, rainfall_rate_mm_h: 68.0, traffic_speed_kmh: 38.0, citizen_reports_count: 0 }
    }
  },
  {
    step_number: 3,
    timestamp: '06:25:22 UTC',
    label: 'Citizen 311 Complaint Clustered & Deduplicated',
    active_event: {
      event_id: 'evt_citizen_102',
      source_id: 'src_citizen_311_feed',
      source_record_id: 'C311-89301',
      event_type: 'citizen_waterlogging_complaint',
      occurred_at: '2026-10-12T06:24:00Z',
      observed_at: '2026-10-12T06:24:00Z',
      ingested_at: '2026-10-12T06:25:22Z',
      location: { latitude: 19.0828, longitude: 72.8815, address: 'Western Express Flyover Descent' },
      payload: { note: 'Water entering shop fronts near flyover descent. Buses slowing.' },
      quality: { is_valid: true, is_stale: false, flags: [] },
      schema_version: '1.0',
      origin: 'simulated_scenario'
    },
    fusion_decision: 'associated',
    narrative: 'Citizen report corroborates physical sensor. Duplicate submissions (15 items) grouped without inflating incident count.',
    incident_snapshot: {
      status: 'under_review',
      severity: 'high',
      confidence: 0.81,
      metrics: { water_level_cm: 32.0, rainfall_rate_mm_h: 68.0, traffic_speed_kmh: 24.0, citizen_reports_count: 6 }
    }
  },
  {
    step_number: 4,
    timestamp: '06:28:30 UTC',
    label: 'Traffic Probe Velocity Plunge (-88%)',
    active_event: {
      event_id: 'evt_traffic_740',
      source_id: 'src_transit_speed_probe',
      source_record_id: 'SPEED-SEG-882',
      event_type: 'corridor_speed_anomaly',
      occurred_at: '2026-10-12T06:28:00Z',
      observed_at: '2026-10-12T06:28:00Z',
      ingested_at: '2026-10-12T06:28:30Z',
      location: { latitude: 19.0821, longitude: 72.8809, address: 'Flyover Underpass Lane 1-4' },
      payload: { mean_speed: '4.8 km/h', baseline: '42 km/h' },
      quality: { is_valid: true, is_stale: false, flags: [] },
      schema_version: '1.0',
      origin: 'simulated_scenario'
    },
    fusion_decision: 'associated',
    narrative: 'Mobility sensor confirms severe gridlock. Impact radius widened to 420 meters.',
    incident_snapshot: {
      status: 'under_review',
      severity: 'high',
      confidence: 0.88,
      metrics: { water_level_cm: 41.0, rainfall_rate_mm_h: 68.0, traffic_speed_kmh: 4.8, citizen_reports_count: 11 }
    }
  },
  {
    step_number: 5,
    timestamp: '06:38:00 UTC',
    label: 'Delayed SCADA Ingestion: Sump Pump Trip Confirmed',
    active_event: {
      event_id: 'evt_scada_302',
      source_id: 'src_scada_pump_telemetry',
      source_record_id: 'PUMP-4-TRIP',
      event_type: 'pump_station_fault',
      occurred_at: '2026-10-12T06:34:00Z',
      observed_at: '2026-10-12T06:34:00Z',
      ingested_at: '2026-10-12T06:38:00Z', // 4 minute latency
      location: { latitude: 19.0818, longitude: 72.8825, address: 'Station 4 Outfall Sump' },
      payload: { unit: 'PUMP_02', trip_code: 'OVERLOAD_IMPEDED_IMPELLER' },
      quality: { is_valid: true, is_stale: false, flags: ['delayed_ingestion_4m'] },
      schema_version: '1.0',
      origin: 'simulated_scenario'
    },
    fusion_decision: 'associated',
    narrative: 'Delayed telemetry retroactively updates incident causal assessment. Plausibility for mechanical cascade escalates to 92%. Escalated to Critical.',
    incident_snapshot: {
      status: 'confirmed',
      severity: 'critical',
      confidence: 0.94,
      metrics: { water_level_cm: 48.5, rainfall_rate_mm_h: 68.2, traffic_speed_kmh: 4.8, citizen_reports_count: 14 }
    }
  }
];
