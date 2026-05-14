import type { ExerciseDefinition, ExerciseTopic } from './types';
import { accentGroupings } from './accent-groupings';
import { doubleBassPyramid } from './double-bass-pyramid';
import { doubleBassRudiments } from './double-bass-rudiments';

export const exercises: ExerciseDefinition[] = [
  accentGroupings,
  doubleBassPyramid,
  doubleBassRudiments,
];

/** Topics rendered on the home page, in display order. */
export const EXERCISE_TOPICS: ReadonlyArray<{ id: ExerciseTopic; label: string }> = [
  { id: 'hands', label: 'Hands' },
  { id: 'feet', label: 'Feet' },
];

export function getExercise(id: string): ExerciseDefinition | undefined {
  return exercises.find((e) => e.id === id);
}
