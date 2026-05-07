import { Link } from 'react-router-dom';
import type { ExerciseDefinition } from '../exercises/types';

interface Props {
  exercise: ExerciseDefinition;
}

const difficultyColor: Record<NonNullable<ExerciseDefinition['difficulty']>, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  intermediate:
    'bg-accent-100 text-accent-900 dark:bg-accent-400/15 dark:text-accent-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

export function ExerciseCard({ exercise }: Props) {
  return (
    <Link
      to={`/exercises/${exercise.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-accent-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-accent-400"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {exercise.name}
        </h3>
        {exercise.difficulty && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColor[exercise.difficulty]}`}
          >
            {exercise.difficulty}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{exercise.description}</p>
    </Link>
  );
}
