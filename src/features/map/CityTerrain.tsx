import React from 'react';
import * as THREE from 'three';

export const CityTerrain: React.FC = () => {
  return (
    <group name="CityTerrain">
      {/* Primary District Substrate Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#060911" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Grid line overlay for tactical coordinates */}
      <gridHelper 
        args={[100, 50, '#1e293b', '#0f172a']} 
        position={[0, -0.05, 0]} 
      />

      {/* Low-lying Drainage Canal / River Channel (Z = 16) */}
      <group position={[0, -0.3, 16]}>
        {/* Canal Trench Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[90, 6]} />
          <meshStandardMaterial color="#020617" roughness={0.95} />
        </mesh>

        {/* Canal Embankment Edges */}
        <mesh position={[0, 0.15, -3]}>
          <boxGeometry args={[90, 0.4, 0.3]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.15, 3]}>
          <boxGeometry args={[90, 0.4, 0.3]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>

        {/* Slow flowing drainage water */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
          <planeGeometry args={[90, 5.5]} />
          <meshStandardMaterial 
            color="#0284c7" 
            transparent 
            opacity={0.4} 
            roughness={0.2} 
            metalness={0.8} 
          />
        </mesh>
      </group>

      {/* Depressed Junction 14 Underpass Basin (Center origin) */}
      <group position={[0, -0.25, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[16, 16]} />
          <meshStandardMaterial color="#030712" roughness={0.95} />
        </mesh>
        {/* Retaining Walls */}
        <mesh position={[0, 0.15, -8]}>
          <boxGeometry args={[16, 0.3, 0.2]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0.15, 8]}>
          <boxGeometry args={[16, 0.3, 0.2]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[-8, 0.15, 0]}>
          <boxGeometry args={[0.2, 0.3, 16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[8, 0.15, 0]}>
          <boxGeometry args={[0.2, 0.3, 16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    </group>
  );
};
