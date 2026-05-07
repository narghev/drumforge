import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getExercise } from '../exercises/registry';
import { ExercisePlayer } from '../components/ExercisePlayer';
import { ConfigPanel } from '../components/ConfigPanel';
import { useExerciseConfig } from '../lib/useExerciseConfig';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function ExercisePage() {
  const { id } = useParams<{ id: string }>();
  const exercise = id ? getExercise(id) : undefined;

  if (!exercise) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Exercise not found</h1>
        <p className="mt-2 text-gray-600">
          The exercise <code className="rounded bg-gray-100 px-1">{id}</code> is not in the
          registry.
        </p>
        <Link to="/" className="mt-6 inline-block text-blue-600 hover:underline">
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

  useEffect(() => {
    setRandomSeed(random ? makeRandomSeed() : 0);
  }, [random]);

  const effectiveConfig = useMemo(
    () => (random ? { ...config, seed: randomSeed } : config),
    [config, random, randomSeed],
  );

  return (
    <div className="mx-auto flex h-screen max-w-6xl flex-col gap-4 px-6 py-6">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← Back to exercises
      </Link>
      <header>
        <h1 className="text-2xl font-bold text-gray-900">{exercise.name}</h1>
        <p className="mt-1 text-sm text-gray-600">{exercise.description}</p>
      </header>
      <ConfigPanel exercise={exercise} config={config} onChange={setConfig} />
      <div className="flex min-h-0 flex-1 flex-col">
        <ExercisePlayer exercise={exercise} config={effectiveConfig} />
      </div>
    </div>
  );
}
