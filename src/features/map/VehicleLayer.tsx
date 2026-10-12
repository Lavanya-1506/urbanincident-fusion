import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleLayerProps {
  trafficSpeedKmh: number;
}

export const VehicleLayer: React.FC<VehicleLayerProps> = ({ trafficSpeedKmh }) => {
  const count = 44;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Speed scaling factor: base 0.2 at 45km/h, drops to 0.02 at 4km/h
  const speedFactor = Math.max(0.015, (trafficSpeedKmh / 45) * 0.18);

  const vehicles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const isNorthArterial = i % 2 === 0;
      return {
        isNorthArterial,
        direction: Math.random() > 0.5 ? 1 : -1,
        coord: (Math.random() - 0.5) * 55,
        laneOffset: isNorthArterial 
          ? (Math.random() > 0.5 ? 0.6 : -0.6) 
          : (Math.random() > 0.5 ? 0.6 : -0.6),
        speedVariation: 0.8 + Math.random() * 0.4,
        isStalled: false,
      };
    });
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;

    vehicles.forEach((v, i) => {
      // In Junction 14 zone (|coord| < 8 on North Arterial), vehicles stall when speed is low
      const inUnderpassZone = v.isNorthArterial && Math.abs(v.coord) < 8;
      const actualSpeed = inUnderpassZone && trafficSpeedKmh < 15 
        ? speedFactor * 0.25 
        : speedFactor * v.speedVariation;

      v.coord += actualSpeed * v.direction;

      if (v.coord > 28) v.coord = -28;
      if (v.coord < -28) v.coord = 28;

      if (v.isNorthArterial) {
        dummy.position.set(v.laneOffset, 0.16, v.coord);
        dummy.rotation.set(0, v.direction > 0 ? 0 : Math.PI, 0);
      } else {
        dummy.position.set(v.coord, 0.16, v.laneOffset);
        dummy.rotation.set(0, v.direction > 0 ? Math.PI / 2 : -Math.PI / 2, 0);
      }

      dummy.scale.set(0.65, 0.28, 0.38);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group name="VehicleLayer">
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#38bdf8" 
          roughness={0.3} 
          metalness={0.7} 
          emissive="#0284c7" 
          emissiveIntensity={0.3} 
        />
      </instancedMesh>
    </group>
  );
};
