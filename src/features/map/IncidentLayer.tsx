import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CorrelationLink3D } from './types';
import { IncidentSeverity } from '../../types';

interface IncidentLayerProps {
  candidateCreated: boolean;
  severity: IncidentSeverity;
  waterDepthCm: number;
  activeLinks: CorrelationLink3D[];
  isSelected: boolean;
  onSelectIncident: () => void;
}

export const IncidentLayer: React.FC<IncidentLayerProps> = ({
  candidateCreated,
  severity,
  waterDepthCm,
  activeLinks,
  isSelected,
  onSelectIncident,
}) => {
  const waterMeshRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  // Elevation of water plane scales with water depth (e.g. 64cm = 0.64 world units)
  const targetElevation = Math.max(0.04, (waterDepthCm / 100) * 0.85);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (waterMeshRef.current) {
      waterMeshRef.current.position.y = targetElevation + Math.sin(t * 1.8) * 0.015;
    }
    if (beaconRef.current) {
      beaconRef.current.rotation.y = t * 0.7;
    }
  });

  const severityColor = severity === 'critical' ? '#ef4444' : severity === 'high' ? '#f59e0b' : '#06b6d4';

  return (
    <group name="IncidentLayer">
      {/* 1. Translucent Rising Water Inundation Zone over Underpass */}
      <group position={[0, 0, 0]}>
        <mesh 
          ref={waterMeshRef} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, targetElevation, 0]}
        >
          <planeGeometry args={[14.8, 14.8]} />
          <meshStandardMaterial 
            color="#0891b2" 
            transparent 
            opacity={0.65} 
            roughness={0.1} 
            metalness={0.8} 
          />
        </mesh>

        {/* Flood Perimeter Boundary Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, targetElevation + 0.02, 0]}>
          <ringGeometry args={[6.8, 7.3, 32]} />
          <meshBasicMaterial color="#00f2fe" transparent opacity={0.45} />
        </mesh>
      </group>

      {/* 2. Candidate Incident Volumetric Beacon (Active when T >= 55) */}
      {candidateCreated && (
        <group position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelectIncident(); }}>
          {/* Vertical Light Column */}
          <mesh ref={beaconRef} position={[0, 5, 0]}>
            <cylinderGeometry args={[0.2, 0.8, 10, 16, 1, true]} />
            <meshBasicMaterial 
              color={severityColor} 
              transparent 
              opacity={0.45} 
              side={THREE.DoubleSide} 
            />
          </mesh>

          {/* Floating Diamond Indicator */}
          <mesh position={[0, 10.5, 0]}>
            <octahedronGeometry args={[0.9]} />
            <meshStandardMaterial 
              color={severityColor} 
              emissive={severityColor} 
              emissiveIntensity={1.2} 
            />
          </mesh>

          {/* Incident Callout Card */}
          <Html position={[0, 12, 0]} center distanceFactor={26}>
            <div 
              onClick={onSelectIncident}
              className={`cursor-pointer px-3 py-2 rounded-lg border backdrop-blur-md whitespace-nowrap shadow-xl transition-all ${
                isSelected 
                  ? 'bg-command-900 border-red-500 shadow-glow-amber scale-105' 
                  : 'bg-command-900/90 border-command-700 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[11px] font-bold text-red-400">INC-2026-8841</span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-red-950/80 border border-red-700/60 text-red-300 font-bold">
                  {severity}
                </span>
                <span className="text-[9px] font-mono text-command-400">[SIMULATED]</span>
              </div>
              <div className="text-xs font-semibold text-white">
                Underpass Flash Flood & Artery Gridlock
              </div>
              <div className="text-[10px] font-mono text-cyan-300 mt-1">
                Inundation: {waterDepthCm.toFixed(1)} cm | Multi-Sensor Fusion
              </div>
            </div>
          </Html>
        </group>
      )}

      {/* 3. Explicit Causal & Correlation Connecting Arcs */}
      {activeLinks.map((link) => {
        // Build 3-point curved arc
        const midX = (link.from[0] + link.to[0]) / 2;
        const midZ = (link.from[2] + link.to[2]) / 2;
        const arcHeight = Math.max(link.from[1], link.to[1]) + 2.5;

        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(...link.from),
          new THREE.Vector3(midX, arcHeight, midZ),
          new THREE.Vector3(...link.to)
        );
        const points = curve.getPoints(24);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const linkColor = link.relationType === 'supporting_evidence' 
          ? '#10b981' 
          : link.relationType === 'model_inferred_hypothesis' 
            ? '#f59e0b' 
            : '#38bdf8';

        return (
          <group key={link.id}>
            <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: linkColor, transparent: true, opacity: 0.75 }))} />
            {/* Center label */}
            <Html position={[midX, arcHeight + 0.3, midZ]} center distanceFactor={28}>
              <div className="pointer-events-none select-none px-1.5 py-0.5 rounded bg-command-950/90 border border-command-700 text-[9px] font-mono text-command-300 whitespace-nowrap shadow">
                {link.label} ({(link.confidence * 100).toFixed(0)}%)
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
