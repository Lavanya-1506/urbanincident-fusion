import React, { useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CityTerrain } from './CityTerrain';
import { BuildingLayer } from './BuildingLayer';
import { RoadNetworkLayer } from './RoadNetworkLayer';
import { VehicleLayer } from './VehicleLayer';
import { RainEffect } from './RainEffect';
import { SensorLayer } from './SensorLayer';
import { IncidentLayer } from './IncidentLayer';
import { ScenarioTickData, CameraViewMode } from './types';
import { useUiStore } from '../../store/uiStore';

interface CitySceneProps {
  currentTick: ScenarioTickData;
  cameraMode: CameraViewMode;
  selectedSensorId: string | null;
  onSelectSensor: (id: string) => void;
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
}

// Camera Director component that smoothly interpolates camera positions on mode change
const CameraDirector: React.FC<{ cameraMode: CameraViewMode; targetPos: [number, number, number] }> = ({
  cameraMode,
  targetPos,
}) => {
  const { camera } = useThree();
  const desiredPos = useRef(new THREE.Vector3(28, 32, 38));
  const desiredLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (cameraMode === 'incident_focus') {
      desiredPos.current.set(12, 14, 16);
      desiredLookAt.current.set(targetPos[0], targetPos[1], targetPos[2]);
    } else if (cameraMode === 'lowlands') {
      desiredPos.current.set(0, 16, 32);
      desiredLookAt.current.set(0, 0, 16);
    } else {
      // Overview
      desiredPos.current.set(30, 36, 42);
      desiredLookAt.current.set(0, 0, 0);
    }
  }, [cameraMode, targetPos]);

  useFrame(() => {
    camera.position.lerp(desiredPos.current, 0.04);
  });

  return null;
};

export const CityScene: React.FC<CitySceneProps> = ({
  currentTick,
  cameraMode,
  selectedSensorId,
  onSelectSensor,
  selectedIncidentId,
  onSelectIncident,
}) => {
  const { layers } = useUiStore();

  return (
    <div className="w-full h-full relative bg-command-950">
      <Canvas
        camera={{ position: [28, 32, 38], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        shadows
      >
        {/* Command Center Tactical Lighting */}
        <ambientLight intensity={0.55} color="#94a3b8" />
        <directionalLight 
          position={[40, 60, 20]} 
          intensity={1.1} 
          color="#38bdf8" 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[0, 15, 0]} intensity={1.4} color="#00f2fe" distance={35} />

        {/* Orbit Controls with Damped Movement */}
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={8} 
          maxDistance={120} 
          target={[0, 0, 0]}
        />

        {/* Camera Director */}
        <CameraDirector cameraMode={cameraMode} targetPos={currentTick.cameraFocus} />

        {/* 1. City Terrain (Floor, Canal, Underpass basin) */}
        <CityTerrain />

        {/* 2. Procedural Buildings and Landmarks */}
        {layers.buildingFootprints && <BuildingLayer />}

        {/* 3. Road Network with Dynamic Congestion Glows */}
        <RoadNetworkLayer trafficSpeedKmh={currentTick.trafficSpeedKmh} />

        {/* 4. Moving Traffic Vehicles with Speed Slowdown */}
        {layers.trafficProbes && (
          <VehicleLayer trafficSpeedKmh={currentTick.trafficSpeedKmh} />
        )}

        {/* 5. Rain Particle System */}
        <RainEffect rainfallRateMmH={currentTick.rainfallMmH} />

        {/* 6. Sensor Layer (Ultrasonic, SCADA, Doppler, Citizen reports) */}
        {layers.waterSensors && (
          <SensorLayer
            activeSensorIds={currentTick.activeSensors}
            selectedSensorId={selectedSensorId}
            onSelectSensor={onSelectSensor}
            waterDepthCm={currentTick.waterDepthCm}
            trafficSpeedKmh={currentTick.trafficSpeedKmh}
            isPumpTripped={currentTick.isPumpTripped}
            citizenCount={currentTick.citizenReportsCount}
          />
        )}

        {/* 7. Incident Layer (Inundation Zone, Candidate Beacon, Causal Links) */}
        {layers.waterFloodExtents && (
          <IncidentLayer
            candidateCreated={currentTick.candidateIncidentCreated}
            severity={currentTick.incidentSeverity}
            waterDepthCm={currentTick.waterDepthCm}
            activeLinks={currentTick.activeLinks}
            isSelected={selectedIncidentId === 'INC-2026-8841'}
            onSelectIncident={() => onSelectIncident('INC-2026-8841')}
          />
        )}
      </Canvas>
    </div>
  );
};
