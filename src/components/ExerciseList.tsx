import { exercises } from '../exercises/registry';
import { ExerciseCard } from './ExerciseCard';

export function ExerciseList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}
