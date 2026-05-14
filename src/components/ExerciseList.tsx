import { EXERCISE_TOPICS, exercises } from '../exercises/registry';
import { ExerciseCard } from './ExerciseCard';

export function ExerciseList() {
  return (
    <div className="space-y-8">
      {EXERCISE_TOPICS.map(({ id, label }) => {
        const topicExercises = exercises.filter((e) => e.topic === id);
        if (topicExercises.length === 0) return null;
        return (
          <section key={id}>
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topicExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
