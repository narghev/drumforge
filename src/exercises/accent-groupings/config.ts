import type { ConfigField, ExerciseConfig } from '../types';
import {
  bpmField,
  countInField,
  metronomeField,
  muteTrackField,
  timerMinutesField,
  timerSecondsField,
} from '../fields';

export const configFields: ConfigField[] = [
  bpmField,
  {
    key: 'subdivision',
    label: 'Subdivision',
    type: 'select',
    default: '16',
    options: [
      { value: '8', label: '8th notes' },
      { value: '16', label: '16th notes' },
    ],
    enabled: true,
    group: 'Pattern',
    description: 'How many notes per beat — 2 (8ths) or 4 (16ths).',
  },
  {
    key: 'groupSize',
    label: 'Group size (N)',
    type: 'range',
    default: 3,
    min: 2,
    max: 16,
    step: 1,
    enabled: true,
    group: 'Pattern',
    description:
      'Accent every Nth note. When N matches the subdivision (4 for 16ths, 2 for 8ths), accents land on every beat; other values shift accents across the bar.',
  },
  { ...timerMinutesField, default: 5 },
  timerSecondsField,
  metronomeField,
  countInField,
  muteTrackField,
];

export const defaultConfig: ExerciseConfig = Object.fromEntries(
  configFields.map((f) => [f.key, f.default]),
);
