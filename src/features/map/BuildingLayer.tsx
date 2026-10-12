import React, { useMemo } from 'react';
import * as THREE from 'three';

const GRID_COUNT = 12;
const BLOCK_SIZE = 4.2;
const ROAD_STRIP = 2.4;

export const BuildingLayer: React.FC = () => {
  const { buildings, landmarks } = useMemo(() => {
    const bList: Array<{
      position: [number, number, number];
      size: [number, number, number];
      color: string;
      id: string;
    }> = [];

    const lList: Array<{
      name: string;
      position: [number, number, number];
      size: [number, number, number];
      color: string;
      type: 'substation' | 'hospital' | 'civic_center';
    }> = [
      {
        name: 'SCADA Drainage Substation 4',
        position: [-6, 1.8, -4],
        size: [3.2, 3.6, 3.2],
        color: '#1e293b',
        type: 'substation',
      },
      {
        name: 'District Civic Command Center',
        position: [12, 4.5, -12],
        size: [4.5, 9.0, 4.5],
        color: '#0f172a',
        type: 'civic_center',
      },
      {
        name: 'Metro Transit Terminal',
        position: [-14, 2.5, 12],
        size: [6.0, 5.0, 3.5],
        color: '#1e293b',
        type: 'hospital',
      },
    ];

    const palette = ['#0b121e', '#0e1726', '#121d30', '#16233a', '#1a2a44'];

    for (let x = -GRID_COUNT / 2; x < GRID_COUNT / 2; x++) {
      for (let z = -GRID_COUNT / 2; z < GRID_COUNT / 2; z++) {
        // Reserve underpass area at center
        if (Math.abs(x) <= 1 && Math.abs(z) <= 1) continue;
        // Reserve drainage canal strip at z = 2 (approx Z = 16)
        if (z === 2 || z === 3) continue;
        // Reserve landmark spots
        if ((x === -1 && z === -1) || (x === 2 && z === -2) || (x === -2 && z === 2)) continue;

        const posX = x * (BLOCK_SIZE + ROAD_STRIP) + BLOCK_SIZE / 2;
        const posZ = z * (BLOCK_SIZE + ROAD_STRIP) + BLOCK_SIZE / 2;

        const seed = Math.sin(x * 17.189 + z * 43.123) * 38291.12;
        const rand = seed - Math.floor(seed);
        const height = 3.5 + rand * 12.5;

        const color = palette[Math.floor(rand * palette.length)];

        bList.push({
          position: [posX, height / 2, posZ],
          size: [BLOCK_SIZE * 0.88, height, BLOCK_SIZE * 0.88],
          color,
          id: `bldg_${x}_${z}`,
        });
      }
    }

    return { buildings: bList, landmarks: lList };
  }, []);

  return (
    <group name="BuildingLayer">
      {/* Standard Procedural Buildings */}
      {buildings.map((b) => (
        <mesh key={b.id} position={b.position} castShadow receiveShadow>
          <boxGeometry args={b.size} />
          <meshStandardMaterial 
            color={b.color} 
            roughness={0.6} 
            metalness={0.4} 
          />
        </mesh>
      ))}

      {/* Selected Infrastructure Landmarks */}
      {landmarks.map((lm, idx) => (
        <group key={idx} position={lm.position}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={lm.size} />
            <meshStandardMaterial 
              color={lm.color} 
              roughness={0.4} 
              metalness={0.6}
            />
          </mesh>
          {/* Subtle Roof Perimeter Outline */}
          <mesh position={[0, lm.size[1] / 2 + 0.05, 0]}>
            <boxGeometry args={[lm.size[0] * 0.9, 0.1, lm.size[2] * 0.9]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
