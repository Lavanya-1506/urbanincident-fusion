import React from 'react';
import { SCENARIO_TICKS } from './scenarioData';

interface SimulationTimelineProps {
  currentTickIndex: number;
  onSelectTickIndex: (index: number) => void;
}

export const SimulationTimeline: React.FC<SimulationTimelineProps> = ({
  currentTickIndex,
  onSelectTickIndex,
}) => {
  const currentTick = SCENARIO_TICKS[currentTickIndex];

  return (
    <div className="w-full p-3 rounded-lg bg-command-900/90 border border-command-700/80 backdrop-blur-md shadow-xl font-mono text-xs">
      {/* Current Tick Header & Telemetry Summary */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-command-800">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold text-sm">
            {currentTick.tickLabel}
          </span>
          <span className="text-white font-semibold text-xs">
            {currentTick.title}
          </span>
          <span className="text-[10px] text-command-400 bg-command-950 px-1.5 py-0.5 rounded border border-command-800">
            [SIMULATED SCENARIO]
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-command-300">
          <div>Rain: <span className="text-cyan-400 font-bold">{currentTick.rainfallMmH} mm/h</span></div>
          <div>Depth: <span className="text-amber-400 font-bold">{currentTick.waterDepthCm} cm</span></div>
          <div>Speed: <span className="text-rose-400 font-bold">{currentTick.trafficSpeedKmh} km/h</span></div>
          <div>Reports: <span className="text-purple-400 font-bold">{currentTick.citizenReportsCount}</span></div>
        </div>
      </div>

      {/* Interactive Milestone Tick Scrubber Track */}
      <div className="relative flex items-center justify-between pt-1 pb-4">
        {/* Connecting track line */}
        <div className="absolute left-3 right-3 top-4 h-1 bg-command-800 rounded z-0">
          <div 
            className="h-full bg-cyan-500 rounded transition-all duration-300"
            style={{ width: `${(currentTickIndex / (SCENARIO_TICKS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Milestone Steps */}
        {SCENARIO_TICKS.map((step, idx) => {
          const isPassed = idx <= currentTickIndex;
          const isCurrent = idx === currentTickIndex;

          return (
            <button
              key={step.tick}
              onClick={() => onSelectTickIndex(idx)}
              className="group relative z-10 flex flex-col items-center focus:outline-none"
            >
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${
                  isCurrent 
                    ? 'bg-cyan-400 text-command-950 ring-4 ring-cyan-500/30 scale-110 shadow-glow-cyan' 
                    : isPassed 
                      ? 'bg-cyan-900 border border-cyan-500 text-cyan-300 hover:bg-cyan-700' 
                      : 'bg-command-950 border border-command-700 text-command-400 hover:border-command-500'
                }`}
              >
                {step.tick}
              </div>
              <span className={`absolute top-7 text-[9px] font-mono whitespace-nowrap transition-colors ${
                isCurrent ? 'text-cyan-300 font-bold' : 'text-command-500 group-hover:text-command-300'
              }`}>
                {step.tickLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Narrative Context Description */}
      <div className="mt-2 text-[11px] text-command-300 bg-command-950/70 p-2 rounded border border-command-800/80">
        <span className="text-command-400 font-bold mr-1">SCENARIO EVENT:</span>
        {currentTick.description}
      </div>
    </div>
  );
};
