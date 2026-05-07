import { Link } from 'react-router-dom';
import type { ExerciseDefinition } from '../exercises/types';

interface Props {
  exercise: ExerciseDefinition;
}

const difficultyColor: Record<NonNullable<ExerciseDefinition['difficulty']>, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

export function ExerciseCard({ exercise }: Props) {
  return (
    <Link
      to={`/exercises/${exercise.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
        {exercise.difficulty && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColor[exercise.difficulty]}`}
          >
            {exercise.difficulty}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-600">{exercise.description}</p>
    </Link>
  );
}
