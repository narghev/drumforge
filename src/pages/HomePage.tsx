import { ExerciseList } from '../components/ExerciseList';
import { ThemeToggle } from '../components/ThemeToggle';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function HomePage() {
  useDocumentTitle(undefined);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Drum Exercises</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Pick an exercise. Hit play. Don't stop.
          </p>
        </div>
        <ThemeToggle />
      </header>
      <ExerciseList />
    </div>
  );
}
