import React from 'react';
import { ROAD_SEGMENTS } from './scenarioData';

interface RoadNetworkLayerProps {
  trafficSpeedKmh: number;
}

export const RoadNetworkLayer: React.FC<RoadNetworkLayerProps> = ({ trafficSpeedKmh }) => {
  const isCongested = trafficSpeedKmh < 20;

  return (
    <group name="RoadNetworkLayer">
      {ROAD_SEGMENTS.map((segment) => {
        // Calculate length & center
        const dx = segment.end[0] - segment.start[0];
        const dz = segment.end[2] - segment.start[2];
        const length = Math.sqrt(dx * dx + dz * dz);
        const centerX = (segment.start[0] + segment.end[0]) / 2;
        const centerZ = (segment.start[2] + segment.end[2]) / 2;
        const angle = Math.atan2(dx, dz);

        // North arterial segment passing through Junction 14 turns amber/congested
        const isThisSegmentCongested = segment.id === 'road-arterial-north' && isCongested;

        return (
          <group key={segment.id} position={[centerX, 0.02, centerZ]} rotation={[0, angle, 0]}>
            {/* Road Base Asphalt */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[segment.width, length]} />
              <meshStandardMaterial 
                color={isThisSegmentCongested ? '#1c1917' : '#0b0f19'} 
                roughness={0.8} 
              />
            </mesh>

            {/* Glowing Congestion / Disruption Underlay when speed decreases */}
            {isThisSegmentCongested && (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <planeGeometry args={[segment.width * 0.95, length * 0.4]} />
                <meshStandardMaterial 
                  color="#d97706" 
                  emissive="#f59e0b" 
                  emissiveIntensity={0.65} 
                  transparent 
                  opacity={0.7} 
                />
              </mesh>
            )}

            {/* Road Centerline Dashes */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
              <planeGeometry args={[0.08, length]} />
              <meshBasicMaterial 
                color={isThisSegmentCongested ? '#f59e0b' : '#334155'} 
                wireframe={false} 
              />
            </mesh>

            {/* Sidewalk Edges */}
            <mesh position={[-segment.width / 2 - 0.15, 0.05, 0]}>
              <boxGeometry args={[0.3, 0.08, length]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[segment.width / 2 + 0.15, 0.05, 0]}>
              <boxGeometry args={[0.3, 0.08, length]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        );
      })}

      {/* Traffic Signals at Junction 14 Intersection */}
      <group position={[1.5, 0, 1.5]}>
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 3.2, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 3.0, 0]}>
          <boxGeometry args={[0.25, 0.6, 0.25]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Signal Light Glow (Red when congested, else green) */}
        <mesh position={[0, 3.15, 0.14]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={isCongested ? '#ef4444' : '#10b981'} />
        </mesh>
      </group>
    </group>
  );
};
