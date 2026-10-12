import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  Eye, 
  Camera, 
  SlidersHorizontal 
} from 'lucide-react';
import { CameraViewMode } from './types';

interface SimulationControllerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  cameraMode: CameraViewMode;
  onCameraModeChange: (mode: CameraViewMode) => void;
  onCameraReset: () => void;
  canStepBack: boolean;
  canStepForward: boolean;
}

export const SimulationController: React.FC<SimulationControllerProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
  onStepBack,
  onStepForward,
  playbackSpeed,
  onSpeedChange,
  cameraMode,
  onCameraModeChange,
  onCameraReset,
  canStepBack,
  canStepForward,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-command-900/90 border border-command-700/80 backdrop-blur-md shadow-xl text-xs font-mono">
      {/* Simulation Playback Actions */}
      <div className="flex items-center gap-1 bg-command-950/80 p-1 rounded border border-command-800">
        <button
          onClick={onReset}
          title="Reset Simulation (T+00)"
          className="p-1.5 rounded hover:bg-command-800 text-command-300 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onStepBack}
          disabled={!canStepBack}
          title="Step Backward (Previous Tick)"
          className="p-1.5 rounded hover:bg-command-800 text-command-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all ${
            isPlaying 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30' 
              : 'bg-cyan-500 text-command-950 hover:bg-cyan-400 font-semibold'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
        </button>
        <button
          onClick={onStepForward}
          disabled={!canStepForward}
          title="Step Forward (Next Tick)"
          className="p-1.5 rounded hover:bg-command-800 text-command-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Speed Multiplier */}
      <div className="flex items-center gap-1 bg-command-950/80 p-1 rounded border border-command-800">
        <span className="text-[10px] text-command-500 px-1">SPEED</span>
        {[1, 2, 5].map((speed) => (
          <button
            key={speed}
            onClick={() => onSpeedChange(speed)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
              playbackSpeed === speed
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-command-400 hover:text-white'
            }`}
          >
            {speed}x
          </button>
        ))}
      </div>

      {/* Camera View Mode Toggle */}
      <div className="flex items-center gap-1 bg-command-950/80 p-1 rounded border border-command-800">
        <span className="text-[10px] text-command-500 px-1 flex items-center gap-1">
          <Camera className="w-3 h-3" /> CAM
        </span>
        <button
          onClick={() => onCameraModeChange('overview')}
          className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
            cameraMode === 'overview'
              ? 'bg-command-800 text-white font-bold'
              : 'text-command-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onCameraModeChange('incident_focus')}
          className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
            cameraMode === 'incident_focus'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-command-400 hover:text-white'
          }`}
        >
          Junction 14 Focus
        </button>
        <button
          onClick={() => onCameraModeChange('lowlands')}
          className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
            cameraMode === 'lowlands'
              ? 'bg-command-800 text-white font-bold'
              : 'text-command-400 hover:text-white'
          }`}
        >
          Canal Basin
        </button>
        <button
          onClick={onCameraReset}
          title="Reset Camera Position"
          className="p-1 rounded text-command-400 hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
