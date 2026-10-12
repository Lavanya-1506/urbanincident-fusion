import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RainEffectProps {
  rainfallRateMmH: number;
}

export const RainEffect: React.FC<RainEffectProps> = ({ rainfallRateMmH }) => {
  const count = 1200;
  const pointsRef = useRef<THREE.Points>(null);

  // If rainfall is very light (e.g. < 5 mm/h), hide or minimize rain
  const isRaining = rainfallRateMmH > 5;
  const rainFallSpeed = Math.min(1.8, Math.max(0.6, rainfallRateMmH / 40));

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      vel[i] = 0.8 + Math.random() * 0.4;
    }
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current || !isRaining) return;
    const geometry = pointsRef.current.geometry;
    const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
    const array = positionAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Move downward
      array[i * 3 + 1] -= velocities[i] * rainFallSpeed;

      // Reset to top when hit ground
      if (array[i * 3 + 1] < 0) {
        array[i * 3 + 1] = 40;
      }
    }

    positionAttr.needsUpdate = true;
  });

  if (!isRaining) return null;

  return (
    <group name="RainEffect">
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          color="#7dd3fc"
          transparent
          opacity={Math.min(0.7, rainfallRateMmH / 100)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
