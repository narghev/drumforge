import type { ConfigField } from './types';

/**
 * Cross-exercise reusable ConfigField definitions. Drop these into a new
 * exercise's `configFields` array as-is, or use the `*Factory()` helpers
 * to override defaults / range without re-declaring the whole field.
 *
 * Example — minimal config for a new exercise:
 *
 *   import { bpmField, timerMinutesField, timerSecondsField,
 *            metronomeField, countInField } from '../fields';
 *
 *   export const configFields = [
 *     bpmField,
 *     // …exercise-specific fields…
 *     timerMinutesField,
 *     timerSecondsField,
 *     metronomeField,
 *     countInField,
 *   ];
 */

export const bpmField: ConfigField = {
  key: 'bpm',
  label: 'BPM',
  type: 'range',
  default: 60,
  min: 30,
  max: 200,
  step: 1,
  enabled: true,
  group: 'Tempo',
};

/** Override BPM defaults / range for an exercise that needs different limits. */
export function bpmFieldFactory(overrides: Partial<ConfigField> = {}): ConfigField {
  return { ...bpmField, ...overrides };
}

export const timerMinutesField: ConfigField = {
  key: 'timerMinutes',
  label: 'Minutes',
  type: 'number',
  default: 15,
  min: 0,
  max: 180,
  step: 1,
  enabled: true,
  group: 'Timer',
};

export const timerSecondsField: ConfigField = {
  key: 'timerSeconds',
  label: 'Seconds',
  type: 'number',
  default: 0,
  min: 0,
  max: 59,
  step: 1,
  enabled: true,
  group: 'Timer',
};

export const metronomeField: ConfigField = {
  key: 'metronome',
  label: 'Metronome',
  type: 'boolean',
  default: true,
  enabled: true,
  group: 'Playback',
  description: 'Play a click on every beat during playback.',
};

export const countInField: ConfigField = {
  key: 'countIn',
  label: 'Count-in',
  type: 'boolean',
  default: true,
  enabled: true,
  group: 'Playback',
  description: 'Play one bar of clicks before playback starts.',
};

export const moneyBeatField: ConfigField = {
  key: 'moneyBeat',
  label: 'Money beat',
  type: 'boolean',
  default: true,
  enabled: true,
  group: 'Pattern',
  description: 'Layer hi-hat on every beat and snare on beats 2 and 4 over the footwork.',
};
