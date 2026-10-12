import React from 'react';
import { 
  Eye, 
  Layers, 
  Droplet, 
  Radio, 
  Car, 
  CloudRain, 
  Box, 
  Compass, 
  RotateCcw,
  SlidersHorizontal 
} from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

export const MapOverlayControls: React.FC = () => {
  const { mapMode, setMapMode, layers, toggleLayer } = useUiStore();

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
      {/* 3D vs 2D Toggle Switch */}
      <div className="flex items-center p-1 rounded-lg bg-command-900/90 border border-command-750 backdrop-blur-md shadow-xl text-xs font-mono">
        <button
          onClick={() => setMapMode('3d')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-semibold ${
            mapMode === '3d'
              ? 'bg-cyan-500 text-command-950 shadow-glow-cyan'
              : 'text-command-400 hover:text-white'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D WebGL</span>
        </button>
        <button
          onClick={() => setMapMode('2d')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-semibold ${
            mapMode === '2d'
              ? 'bg-cyan-500 text-command-950 shadow-glow-cyan'
              : 'text-command-400 hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>2D Tactical</span>
        </button>
      </div>

      {/* Layer Toggles Popover / Bar */}
      <div className="p-2.5 rounded-lg bg-command-900/90 border border-command-750 backdrop-blur-md shadow-xl text-xs space-y-1.5 w-56">
        <div className="flex items-center gap-2 text-[10px] font-mono text-command-400 uppercase tracking-wider font-bold mb-1">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>Geospatial Layers</span>
        </div>

        <button
          onClick={() => toggleLayer('waterFloodExtents')}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
            layers.waterFloodExtents ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-command-400 hover:bg-command-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <Droplet className="w-3.5 h-3.5 text-cyan-400" />
            Water Inundation Extent
          </span>
          <span className="text-[10px] font-mono">{layers.waterFloodExtents ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => toggleLayer('waterSensors')}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
            layers.waterSensors ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-command-400 hover:bg-command-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            IoT Ultrasonic Sensors
          </span>
          <span className="text-[10px] font-mono">{layers.waterSensors ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => toggleLayer('trafficProbes')}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
            layers.trafficProbes ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-command-400 hover:bg-command-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <Car className="w-3.5 h-3.5 text-amber-400" />
            Traffic Flow Probes
          </span>
          <span className="text-[10px] font-mono">{layers.trafficProbes ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => toggleLayer('buildingFootprints')}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
            layers.buildingFootprints ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-command-400 hover:bg-command-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <Box className="w-3.5 h-3.5 text-purple-400" />
            3D Structural Blocks
          </span>
          <span className="text-[10px] font-mono">{layers.buildingFootprints ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </div>
  );
};
