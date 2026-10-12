import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Incident } from '../../types';
import { useIncidentStore } from '../../store/incidentStore';
import { useUiStore } from '../../store/uiStore';
import { SeverityBadge } from '../../components/common/SeverityBadge';

// Procedural City Grid Parameters
const GRID_SIZE = 12;
const BLOCK_SIZE = 4;
const ROAD_WIDTH = 1.8;

// Procedural Buildings Component
const ProceduralBuildings: React.FC<{ onSelectBuilding?: (id: string) => void }> = () => {
  const buildings = useMemo(() => {
    const list: Array<{
      position: [number, number, number];
      size: [number, number, number];
      color: string;
      roofColor: string;
      id: string;
    }> = [];

    const half = (GRID_SIZE * (BLOCK_SIZE + ROAD_WIDTH)) / 2;

    for (let x = -GRID_SIZE / 2; x < GRID_SIZE / 2; x++) {
      for (let z = -GRID_SIZE / 2; z < GRID_SIZE / 2; z++) {
        // Reserve center intersection for underpass incident zone
        if (Math.abs(x) <= 1 && Math.abs(z) <= 1) continue;

        const posX = x * (BLOCK_SIZE + ROAD_WIDTH) + BLOCK_SIZE / 2;
        const posZ = z * (BLOCK_SIZE + ROAD_WIDTH) + BLOCK_SIZE / 2;

        // Deterministic pseudo-random height
        const seed = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
        const rand = seed - Math.floor(seed);
        const height = 2 + rand * 14;

        // Building palette: midnight navy, slate, charcoal
        const palette = ['#0c1524', '#101c30', '#14223a', '#172742', '#1b2d4b'];
        const color = palette[Math.floor(rand * palette.length)];

        list.push({
          position: [posX, height / 2, posZ],
          size: [BLOCK_SIZE * 0.9, height, BLOCK_SIZE * 0.9],
          color,
          roofColor: '#1e293b',
          id: `bldg_${x}_${z}`,
        });
      }
    }
    return list;
  }, []);

  return (
    <group>
      {buildings.map((b) => (
        <mesh key={b.id} position={b.position} castShadow receiveShadow>
          <boxGeometry args={b.size} />
          <meshStandardMaterial 
            color={b.color} 
            roughness={0.4} 
            metalness={0.6} 
            wireframe={false}
          />
        </mesh>
      ))}
    </group>
  );
};

// Road Network and Ground Plane
const RoadNetworkAndGround: React.FC = () => {
  const groundSize = GRID_SIZE * (BLOCK_SIZE + ROAD_WIDTH) + 20;

  return (
    <group>
      {/* Ground Substrate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[groundSize, groundSize]} />
        <meshStandardMaterial color="#05080e" roughness={0.8} />
      </mesh>

      {/* Grid Guide Floor */}
      <gridHelper 
        args={[groundSize, GRID_SIZE * 2, '#1e2c45', '#0f172a']} 
        position={[0, 0.01, 0]} 
      />
    </group>
  );
};

// Moving Traffic Particles along the Roads
const TrafficFlow: React.FC = () => {
  const count = 36;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const cars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      axis: i % 2 === 0 ? 'x' : 'z',
      laneOffset: ((i % 6) - 3) * (BLOCK_SIZE + ROAD_WIDTH),
      coord: (Math.random() - 0.5) * 60,
      speed: 0.15 + Math.random() * 0.2,
      direction: Math.random() > 0.5 ? 1 : -1,
      isHeadlight: i % 2 === 0
    }));
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;

    cars.forEach((car, i) => {
      car.coord += car.speed * car.direction;
      if (car.coord > 35) car.coord = -35;
      if (car.coord < -35) car.coord = 35;

      if (car.axis === 'x') {
        dummy.position.set(car.coord, 0.15, car.laneOffset);
        dummy.rotation.set(0, car.direction > 0 ? 0 : Math.PI, 0);
      } else {
        dummy.position.set(car.laneOffset, 0.15, car.coord);
        dummy.rotation.set(0, car.direction > 0 ? Math.PI / 2 : -Math.PI / 2, 0);
      }
      dummy.scale.set(0.6, 0.25, 0.3);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00f2fe" />
    </instancedMesh>
  );
};

// Waterlogging Inundation Layer (Dynamic rising water at underpass)
const WaterloggingInundationZone: React.FC<{ waterLevelCm: number }> = ({ waterLevelCm }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Dynamic elevation based on water level in cm (e.g. 50cm = 0.5m in world scale)
  const targetElevation = Math.max(0.08, (waterLevelCm / 100) * 0.9);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Subtle hydraulic surface breathing
      const t = clock.getElapsedTime();
      meshRef.current.position.y = targetElevation + Math.sin(t * 2) * 0.02;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Depressed Underpass basin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#020914" roughness={0.9} />
      </mesh>

      {/* Rising Inundated Water Surface */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, targetElevation, 0]}>
        <planeGeometry args={[13.5, 13.5]} />
        <meshStandardMaterial 
          color="#06b6d4" 
          transparent 
          opacity={0.65} 
          roughness={0.1} 
          metalness={0.8}
        />
      </mesh>

      {/* Ripple Perimeter Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, targetElevation + 0.01, 0]}>
        <ringGeometry args={[6.2, 6.6, 32]} />
        <meshBasicMaterial color="#00f2fe" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

// IoT Ultrasonic Water Level Sensor Beacon
const SensorBeacon: React.FC<{ 
  position: [number, number, number]; 
  label: string; 
  value: string;
  isStall?: boolean;
}> = ({ position, label, value, isStall }) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const scale = 1 + (clock.getElapsedTime() % 2) * 0.8;
      ringRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group position={position}>
      {/* Sensor Post */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.4, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>

      {/* Sensor Head / Antenna */}
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial 
          color={isStall ? '#ef4444' : '#00f2fe'} 
          emissive={isStall ? '#ef4444' : '#00f2fe'} 
          emissiveIntensity={0.8} 
        />
      </mesh>

      {/* Sonar Beacon Ping on Ground */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.8, 0.95, 24]} />
        <meshBasicMaterial 
          color={isStall ? '#ef4444' : '#00f2fe'} 
          transparent 
          opacity={0.4} 
        />
      </mesh>

      {/* Telemetry HTML Callout */}
      <Html position={[0, 2.8, 0]} center distanceFactor={28}>
        <div className="pointer-events-none select-none px-2 py-1 rounded bg-command-900/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 shadow-lg whitespace-nowrap">
          <div className="font-bold text-white">{label}</div>
          <div className="text-cyan-400">{value}</div>
        </div>
      </Html>
    </group>
  );
};

// 3D Incident Volumetric Marker
const IncidentMarker3D: React.FC<{
  incident: Incident;
  isSelected: boolean;
  onSelect: () => void;
  position: [number, number, number];
}> = ({ incident, isSelected, onSelect, position }) => {
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y = clock.getElapsedTime() * 0.8;
    }
  });

  const color = incident.severity === 'critical' ? '#ef4444' : incident.severity === 'high' ? '#f59e0b' : '#3b82f6';

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* Vertical Light Column / Beacon */}
      <mesh ref={beaconRef} position={[0, 5, 0]}>
        <cylinderGeometry args={[0.15, 0.6, 10, 16, 1, true]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={isSelected ? 0.6 : 0.3} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Floating Diamond Indicator */}
      <mesh position={[0, 10.5, 0]}>
        <octahedronGeometry args={[0.9]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={isSelected ? 1.2 : 0.6} 
        />
      </mesh>

      {/* Target Marker on Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[1.5, 2.2, 32]} />
        <meshBasicMaterial color={color} transparent opacity={isSelected ? 0.8 : 0.4} />
      </mesh>

      {/* Interactive Floating Card */}
      <Html position={[0, 12, 0]} center distanceFactor={28}>
        <div 
          onClick={onSelect}
          className={`cursor-pointer px-3 py-2 rounded-lg border backdrop-blur-md transition-all whitespace-nowrap shadow-xl ${
            isSelected 
              ? 'bg-command-900 border-cyan-400 shadow-glow-cyan scale-105' 
              : 'bg-command-900/90 border-command-700 hover:border-cyan-500/60'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold text-cyan-400">{incident.id}</span>
            <SeverityBadge severity={incident.severity} />
          </div>
          <div className="text-xs font-semibold text-white max-w-[200px] truncate">
            {incident.title}
          </div>
          {incident.metrics.water_level_cm && (
            <div className="text-[10px] font-mono text-cyan-300 mt-0.5">
              Depth: {incident.metrics.water_level_cm} cm | Rise: +1.8 cm/m
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

export const City3DScene: React.FC<{
  incidents: Incident[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
}> = ({ incidents, selectedIncidentId, onSelectIncident }) => {
  const { layers } = useUiStore();

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);
  const waterLevel = selectedIncident?.metrics?.water_level_cm || 32.0;

  // Spatial positions mapped onto 3D grid
  const incidentPositions: Record<string, [number, number, number]> = {
    'INC-2026-8841': [0, 0, 0],         // Junction 14 Central Underpass
    'INC-2026-8839': [-18, 0, 14],      // Sector 9 Lowlands
    'INC-2026-8835': [16, 0, -14],      // King Circle
    'INC-2026-8830': [-24, 0, -20],     // Marine Outfall
    'INC-2026-8845': [14, 0, 18],       // Metro Portal
  };

  return (
    <div className="w-full h-full relative bg-command-950">
      <Canvas
        camera={{ position: [28, 32, 38], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        shadows
      >
        {/* Ambient & Directional Lighting for Command Room Look */}
        <ambientLight intensity={0.6} color="#94a3b8" />
        <directionalLight 
          position={[40, 60, 20]} 
          intensity={1.2} 
          color="#38bdf8" 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[0, 15, 0]} intensity={1.5} color="#00f2fe" distance={30} />

        {/* Orbit Controls with Damped Smooth Movement */}
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={10} 
          maxDistance={120} 
          target={[0, 0, 0]}
        />

        {/* City Geometry & Environment */}
        <RoadNetworkAndGround />
        {layers.buildingFootprints && <ProceduralBuildings />}
        {layers.trafficProbes && <TrafficFlow />}

        {/* Waterlogging Inundation Layer */}
        {layers.waterFloodExtents && (
          <WaterloggingInundationZone waterLevelCm={waterLevel} />
        )}

        {/* IoT Water Level & Telemetry Beacons */}
        {layers.waterSensors && (
          <>
            <SensorBeacon 
              position={[2, 0, 2]} 
              label="US-402-A (Depth Gauge)" 
              value={`${waterLevel} cm (Tier 3)`} 
            />
            <SensorBeacon 
              position={[-4, 0, -3]} 
              label="SCADA Station 4 Pump 02" 
              value="TRIPPED / 0 LPS" 
              isStall 
            />
            <SensorBeacon 
              position={[8, 0, -6]} 
              label="Transit Probe #882" 
              value="4.8 km/h (-88%)" 
            />
          </>
        )}

        {/* 3D Incident Markers */}
        {incidents.map((inc) => {
          const pos = incidentPositions[inc.id] || [0, 0, 0];
          return (
            <IncidentMarker3D
              key={inc.id}
              incident={inc}
              isSelected={inc.id === selectedIncidentId}
              onSelect={() => onSelectIncident(inc.id)}
              position={pos}
            />
          );
        })}
      </Canvas>
    </div>
  );
};
