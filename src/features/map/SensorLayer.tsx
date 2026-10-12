import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SensorNode3D, SensorHealthStatus } from './types';
import { STATIC_SENSORS } from './scenarioData';

interface SensorLayerProps {
  activeSensorIds: string[];
  selectedSensorId: string | null;
  onSelectSensor: (id: string) => void;
  waterDepthCm: number;
  trafficSpeedKmh: number;
  isPumpTripped: boolean;
  citizenCount: number;
}

const getStatusColor = (status: SensorHealthStatus) => {
  switch (status) {
    case 'critical':
      return '#ef4444'; // Red
    case 'warning':
      return '#f59e0b'; // Amber
    case 'unverified':
      return '#a855f7'; // Purple / Outlined
    case 'healthy':
    default:
      return '#10b981'; // Green
  }
};

const SensorMarker: React.FC<{
  sensor: SensorNode3D;
  isActive: boolean;
  isSelected: boolean;
  displayValue: string;
  derivedStatus: SensorHealthStatus;
  onClick: () => void;
}> = ({ sensor, isActive, isSelected, displayValue, derivedStatus, onClick }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const color = getStatusColor(derivedStatus);

  useFrame(({ clock }) => {
    if (ringRef.current && isActive) {
      const t = clock.getElapsedTime();
      const scale = 1 + (t * 2) % 2.5;
      ringRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group position={sensor.position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Mast / Pole */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.0, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>

      {/* Sensor Head with Status-Coded Emissive Shell */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={isActive ? 0.9 : 0.3} 
          roughness={0.2}
        />
      </mesh>

      {/* Expanding Ring Ripple for Active/Triggered Signals */}
      {isActive && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[0.8, 0.98, 32]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.5} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}

      {/* Unverified observation dashed boundary ring (Citizen reports) */}
      {sensor.type === 'citizen_cluster' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[1.6, 1.8, 16]} />
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.6} />
        </mesh>
      )}

      {/* Telemetry Annotation Box */}
      <Html position={[0, 2.7, 0]} center distanceFactor={26}>
        <div 
          onClick={onClick}
          className={`cursor-pointer px-2.5 py-1.5 rounded border backdrop-blur-md whitespace-nowrap shadow-xl transition-all ${
            isSelected 
              ? 'bg-command-900 border-cyan-400 ring-2 ring-cyan-500/40' 
              : 'bg-command-900/90 border-command-700 hover:border-cyan-500/60'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ backgroundColor: color }} 
            />
            <span className="font-bold text-white">{sensor.name}</span>
            <span className="text-command-500 font-mono text-[9px]">[SIMULATED]</span>
          </div>
          <div className="text-[11px] font-mono font-bold mt-0.5 text-cyan-300">
            {displayValue}
          </div>
        </div>
      </Html>
    </group>
  );
};

export const SensorLayer: React.FC<SensorLayerProps> = ({
  activeSensorIds,
  selectedSensorId,
  onSelectSensor,
  waterDepthCm,
  trafficSpeedKmh,
  isPumpTripped,
  citizenCount,
}) => {
  return (
    <group name="SensorLayer">
      {STATIC_SENSORS.map((sensor) => {
        const isActive = activeSensorIds.includes(sensor.id);
        const isSelected = selectedSensorId === sensor.id;

        // Dynamic value calculation based on simulation tick
        let val = sensor.currentValue;
        let status: SensorHealthStatus = 'healthy';

        if (sensor.id === 'sensor-water-01') {
          val = `${waterDepthCm.toFixed(1)} cm`;
          status = waterDepthCm > 40 ? 'critical' : waterDepthCm > 25 ? 'warning' : 'healthy';
        } else if (sensor.id === 'sensor-scada-01') {
          val = isPumpTripped ? 'TRIPPED (0 LPS)' : 'NOMINAL (140 LPS)';
          status = isPumpTripped ? 'critical' : 'healthy';
        } else if (sensor.id === 'sensor-traffic-01') {
          val = `${trafficSpeedKmh.toFixed(1)} km/h`;
          status = trafficSpeedKmh < 15 ? 'critical' : trafficSpeedKmh < 30 ? 'warning' : 'healthy';
        } else if (sensor.id === 'sensor-citizen-01') {
          val = `${citizenCount} Verified Reports`;
          status = citizenCount > 0 ? 'unverified' : 'healthy';
        }

        return (
          <SensorMarker
            key={sensor.id}
            sensor={sensor}
            isActive={isActive}
            isSelected={isSelected}
            displayValue={val}
            derivedStatus={status}
            onClick={() => onSelectSensor(sensor.id)}
          />
        );
      })}
    </group>
  );
};
