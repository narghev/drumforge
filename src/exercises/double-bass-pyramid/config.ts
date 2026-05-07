import type { ConfigField, ExerciseConfig } from '../types';
import {
  bpmField,
  countInField,
  metronomeField,
  timerMinutesField,
  timerSecondsField,
} from '../fields';

export const configFields: ConfigField[] = [
  bpmField,
  {
    key: 'start',
    label: 'Start',
    type: 'number',
    default: 1,
    min: 1,
    max: 8,
    step: 1,
    enabled: true,
    group: 'Pattern',
    description: 'Lowest subdivision count (kicks per beat)',
  },
  {
    key: 'end',
    label: 'End',
    type: 'number',
    default: 4,
    min: 1,
    max: 8,
    step: 1,
    enabled: true,
    group: 'Pattern',
    description: 'Highest subdivision count (kicks per beat). Must be >= Pyramid start.',
  },
  {
    key: 'randomize',
    label: 'Randomize',
    type: 'action',
    default: false,
    enabled: true,
    group: 'Pattern',
    description: 'Generate a random sequence of subdivisions in the [start, end] range. Click again to return to pyramid mode.',
  },
  {
    key: 'random',
    label: 'Random mode',
    type: 'boolean',
    default: false,
    enabled: true,
    hidden: true,
    group: 'Pattern',
  },
  timerMinutesField,
  timerSecondsField,
  metronomeField,
  countInField,
];

export const defaultConfig: ExerciseConfig = Object.fromEntries(
  configFields.map((f) => [f.key, f.default]),
);
