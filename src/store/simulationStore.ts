import { create } from 'zustand';
import { REPLAY_DEMO_FRAMES } from '../services/mockData';
import { ReplayFrame } from '../types';

interface SimulationState {
  frames: ReplayFrame[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number; // 1x, 2x, 5x, 10x
  isCounterfactualMode: boolean;
  counterfactualScenario: 'pump_remains_active' | 'radar_delayed_30min';

  setCurrentStepIndex: (idx: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  toggleCounterfactualMode: () => void;
  setCounterfactualScenario: (scenario: 'pump_remains_active' | 'radar_delayed_30min') => void;
  resetReplay: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  frames: REPLAY_DEMO_FRAMES,
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1,
  isCounterfactualMode: false,
  counterfactualScenario: 'pump_remains_active',

  setCurrentStepIndex: (idx) => {
    const clamped = Math.max(0, Math.min(idx, get().frames.length - 1));
    set({ currentStepIndex: clamped });
  },
  stepForward: () => {
    const { currentStepIndex, frames } = get();
    if (currentStepIndex < frames.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },
  stepBackward: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  toggleCounterfactualMode: () => set((state) => ({ isCounterfactualMode: !state.isCounterfactualMode })),
  setCounterfactualScenario: (counterfactualScenario) => set({ counterfactualScenario }),
  resetReplay: () => set({ currentStepIndex: 0, isPlaying: false }),
}));
