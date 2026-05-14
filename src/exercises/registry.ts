import type { ExerciseDefinition } from './types';
import { accentGroupings } from './accent-groupings';
import { doubleBassPyramid } from './double-bass-pyramid';
import { doubleBassRudiments } from './double-bass-rudiments';

export const exercises: ExerciseDefinition[] = [
  accentGroupings,
  doubleBassPyramid,
  doubleBassRudiments,
];

export function getExercise(id: string): ExerciseDefinition | undefined {
  return exercises.find((e) => e.id === id);
}
