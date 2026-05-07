import { ExerciseList } from '../components/ExerciseList';

export function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Drum Exercises</h1>
        <p className="mt-2 text-gray-600">
          Pick an exercise. Hit play. Don't stop.
        </p>
      </header>
      <ExerciseList />
    </div>
  );
}
