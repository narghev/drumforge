import type { ExerciseDefinition } from './types';
import { doubleBassPyramid } from './double-bass-pyramid';

export const exercises: ExerciseDefinition[] = [doubleBassPyramid];

export function getExercise(id: string): ExerciseDefinition | undefined {
  return exercises.find((e) => e.id === id);
}
