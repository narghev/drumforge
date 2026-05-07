import { useEffect, useRef, useState } from 'react';
import { AlphaTabApi, synth } from '@coderline/alphatab';
import type { ExerciseConfig, ExerciseDefinition } from '../exercises/types';
import { buildSettings } from '../lib/alphatab-setup';
import { useCountdown } from '../lib/timer';
import { useTheme } from '../lib/useTheme';
import { Timer } from './Timer';

interface Props {
  exercise: ExerciseDefinition;
  config: ExerciseConfig;
}

export function ExercisePlayer({ exercise, config }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<AlphaTabApi | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [theme] = useTheme();

  const timerMinutes = Math.max(0, Number(config.timerMinutes) || 0);
  const timerSecondsField = Math.max(0, Number(config.timerSeconds) || 0);
  const totalSeconds = timerMinutes * 60 + timerSecondsField;

  const { remaining, reset: resetTimer } = useCountdown({
    totalSeconds,
    running: playing && totalSeconds > 0,
    onZero: totalSeconds > 0 ? () => apiRef.current?.stop() : undefined,
  });

  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return;

    const api = new AlphaTabApi(containerRef.current, buildSettings(scrollRef.current, theme));
    apiRef.current = api;
    api.isLooping = true;

    const onPlayerReady = () => setReady(true);
    const onPlayerStateChanged = (e: { state: synth.PlayerState }) => {
      setPlaying(e.state === synth.PlayerState.Playing);
    };

    api.playerReady.on(onPlayerReady);
    api.playerStateChanged.on(onPlayerStateChanged);

    return () => {
      api.playerReady.off(onPlayerReady);
      api.playerStateChanged.off(onPlayerStateChanged);
      api.destroy();
      apiRef.current = null;
      setReady(false);
      setPlaying(false);
    };
    // The theme is read once at mount. The toggle is intentionally only
    // rendered on the home page, so users pick their theme there before
    // entering an exercise — this side-steps alphaTab's SVG/glyph caching
    // that makes mid-session theme switches unreliable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise]);

  useEffect(() => {
    apiRef.current?.tex(exercise.generateAlphaTex(config));
  }, [exercise, config]);

  const handlePlayPause = () => {
    apiRef.current?.playPause();
  };

  const handleStop = () => {
    apiRef.current?.stop();
    resetTimer();
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-auto rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
      >
        <div ref={containerRef} />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
        <button
          type="button"
          onClick={handleStop}
          disabled={!ready}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          ■ Stop
        </button>
        <button
          type="button"
          onClick={handlePlayPause}
          disabled={!ready}
          className="rounded-md bg-accent-400 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-accent-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        {!ready && <span className="text-sm text-gray-500 dark:text-gray-400">Loading soundfont…</span>}
        <div className="ml-auto">
          <Timer remainingSeconds={remaining} totalSeconds={totalSeconds} />
        </div>
      </div>
    </div>
  );
}
