import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownOptions {
  totalSeconds: number;
  running: boolean;
  onZero?: () => void;
}

export function useCountdown({ totalSeconds, running, onZero }: UseCountdownOptions) {
  const [remaining, setRemaining] = useState(totalSeconds);
  // Reset the countdown whenever the configured length changes. Comparing the
  // previous value during render (instead of in an effect) avoids React 19's
  // `react-hooks/set-state-in-effect` warning and the cascading-render cost
  // it points at — see https://react.dev/learn/you-might-not-need-an-effect.
  const [prevTotal, setPrevTotal] = useState(totalSeconds);
  if (prevTotal !== totalSeconds) {
    setPrevTotal(totalSeconds);
    setRemaining(totalSeconds);
  }

  const onZeroRef = useRef(onZero);

  useEffect(() => {
    onZeroRef.current = onZero;
  }, [onZero]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          onZeroRef.current?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = useCallback(() => setRemaining(totalSeconds), [totalSeconds]);

  return { remaining, reset };
}

export function formatMMSS(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
