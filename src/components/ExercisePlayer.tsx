import { useEffect, useRef, useState } from 'react';
import { AlphaTabApi, synth } from '@coderline/alphatab';
import type { ExerciseConfig, ExerciseDefinition } from '../exercises/types';
import { buildSettings } from '../lib/alphatab-setup';
import { useCountdown } from '../lib/timer';
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

    const api = new AlphaTabApi(containerRef.current, buildSettings(scrollRef.current));
    apiRef.current = api;

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
  }, [exercise]);

  useEffect(() => {
    apiRef.current?.tex(exercise.generateAlphaTex(config));
  }, [exercise, config]);

  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    const onFinished = () => {
      const timerExpired = totalSeconds > 0 && remaining === 0;
      if (!timerExpired) {
        api.playPause();
      }
    };
    api.playerFinished.on(onFinished);
    return () => {
      api.playerFinished.off(onFinished);
    };
  }, [remaining, totalSeconds]);

  const handlePlayPause = () => {
    apiRef.current?.playPause();
  };

  const handleStop = () => {
    apiRef.current?.stop();
    resetTimer();
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={scrollRef}
        className="h-[420px] overflow-auto rounded-lg border border-gray-200 bg-white"
      >
        <div ref={containerRef} />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
        <button
          type="button"
          onClick={handleStop}
          disabled={!ready}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ■ Stop
        </button>
        <button
          type="button"
          onClick={handlePlayPause}
          disabled={!ready}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        {!ready && <span className="text-sm text-gray-500">Loading soundfont…</span>}
        <div className="ml-auto">
          <Timer remainingSeconds={remaining} totalSeconds={totalSeconds} />
        </div>
      </div>
    </div>
  );
}
