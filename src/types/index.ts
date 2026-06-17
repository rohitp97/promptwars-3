export type DecisionCategory = 'travel' | 'food' | 'energy' | 'shopping';
export type ScenePollutionLevel = 'clear' | 'hazy' | 'polluted' | 'critical';

export interface Activity {
  id: string;
  label: string;
  sublabel: string;
  category: DecisionCategory;
  icon: string;
  kgCO2: number;
  unit: string;
  isWin?: boolean; // positive/climate-win actions (negative or zero impact)
}

export interface JournalEntry {
  id: string;
  activityId: string;
  activityLabel: string;
  category: DecisionCategory;
  icon: string;
  kgCO2: number;
  relatableUnit: string;
  story: string | null;    // null while Gemini is loading
  isWin: boolean;
  timestamp: number;       // Date.now()
}

export interface SceneState {
  skyStart: string;        // CSS color for gradient start
  skyEnd: string;          // CSS color for gradient end
  sunOpacity: number;      // 0-1
  hazeOpacity: number;     // 0-1
  treeCount: number;       // 0-6
  riverColor: string;      // CSS color
  smokeActive: boolean;
  pollutionLevel: ScenePollutionLevel;
  ariaLabel: string;       // for screen readers
}

export interface SimulateState {
  choiceA: Activity | null;
  choiceB: Activity | null;
  result: SimulateResult | null;
  isLoading: boolean;
  error: string | null;
}

export interface SimulateResult {
  storyA: string;
  storyB: string;
  verdict: string;
  savingKg: number;
}
