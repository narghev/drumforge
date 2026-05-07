import type { ConfigField, ExerciseConfig } from '../types';
import {
  bpmField,
  countInField,
  metronomeField,
  moneyBeatField,
  timerMinutesField,
  timerSecondsField,
} from '../fields';
import { rudiments } from '../rudiments';

export const configFields: ConfigField[] = [
  bpmField,
  {
    key: 'rudiment',
    label: 'Rudiment',
    type: 'select',
    default: rudiments[0].id,
    options: rudiments.map((r) => ({ value: r.id, label: r.name })),
    enabled: true,
    group: 'Pattern',
    description: 'Which sticking pattern to play on the kicks.',
  },
  moneyBeatField,
  // Override the shared 15-minute default — rudiments are typically drilled
  // in shorter focused bursts.
  { ...timerMinutesField, default: 3 },
  timerSecondsField,
  metronomeField,
  countInField,
];

export const defaultConfig: ExerciseConfig = Object.fromEntries(
  configFields.map((f) => [f.key, f.default]),
);
