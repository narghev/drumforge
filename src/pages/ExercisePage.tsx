import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getExercise } from '../exercises/registry';
import { ExercisePlayer } from '../components/ExercisePlayer';
import { ConfigPanel } from '../components/ConfigPanel';
import { Footer } from '../components/Footer';
import { ShareButton } from '../components/ShareButton';
import { useExerciseConfig } from '../lib/useExerciseConfig';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function ExercisePage() {
  const { id } = useParams<{ id: string }>();
  const exercise = id ? getExercise(id) : undefined;

  if (!exercise) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Exercise not found</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The exercise <code className="rounded bg-gray-100 px-1 dark:bg-gray-800 dark:text-gray-200">{id}</code> is not in the
          registry.
        </p>
        <Link to="/" className="mt-6 inline-block text-accent-600 hover:text-accent-700 hover:underline dark:text-accent-400 dark:hover:text-accent-300">
          ← Back to exercises
        </Link>
      </div>
    );
  }

  return <ExerciseView exercise={exercise} />;
}

function makeRandomSeed(): number {
  return Math.floor(Math.random() * 2_147_483_646) + 1;
}

function ExerciseView({ exercise }: { exercise: ReturnType<typeof getExercise> & {} }) {
  useDocumentTitle(`${exercise.name} · Drumforge`);

  const [config, setConfig] = useExerciseConfig(exercise);
  const random = Boolean(config.random);

  // The randomization seed lives only in component state — never in the URL.
  // Each transition into random mode picks a fresh seed, so the URL is just
  // an "is randomized" indicator (?random=true), not a reproducible pattern.
  const [randomSeed, setRandomSeed] = useState(() => (random ? makeRandomSeed() : 0));
  // Re-roll the seed when `random` flips. Comparing the previous value during
  // render (rather than in an effect) sidesteps React 19's
  // `react-hooks/set-state-in-effect` rule — see
  // https://react.dev/learn/you-might-not-need-an-effect.
  const [prevRandom, setPrevRandom] = useState(random);
  if (prevRandom !== random) {
    setPrevRandom(random);
    setRandomSeed(random ? makeRandomSeed() : 0);
  }

  const effectiveConfig = useMemo(
    () => (random ? { ...config, seed: randomSeed } : config),
    [config, random, randomSeed],
  );

  // The config panel is collapsed by default on mobile to keep the score
  // above the fold; on `sm:` and up it's always visible regardless of state.
  const [configOpen, setConfigOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-6">
      <div className="flex items-start justify-between gap-3">
        <Link
          to="/"
          className="text-sm text-accent-600 hover:text-accent-700 hover:underline dark:text-accent-400 dark:hover:text-accent-300"
        >
          ← Back to exercises
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setConfigOpen((open) => !open)}
            aria-expanded={configOpen}
            aria-controls="exercise-config"
            aria-label={configOpen ? 'Hide settings' : 'Show settings'}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-accent-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 sm:hidden dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-accent-400 dark:hover:text-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span>Settings</span>
          </button>
          <ShareButton />
        </div>
      </div>
      <header>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
          {exercise.name}
        </h1>
        <p className="mt-1 hidden text-sm text-gray-600 sm:block dark:text-gray-400">
          {exercise.description}
        </p>
      </header>
      <div id="exercise-config" className={configOpen ? '' : 'hidden sm:block'}>
        <ConfigPanel exercise={exercise} config={config} onChange={setConfig} />
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        <ExercisePlayer exercise={exercise} config={effectiveConfig} />
      </div>
      <Footer />
    </div>
  );
}
