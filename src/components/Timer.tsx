import { formatMMSS } from '../lib/timer';

interface Props {
  remainingSeconds: number;
  totalSeconds: number;
}

export function Timer({ remainingSeconds, totalSeconds }: Props) {
  const exhausted = remainingSeconds === 0;
  return (
    <div
      className={`flex items-baseline gap-2 font-mono text-2xl tabular-nums ${exhausted ? 'text-gray-400' : 'text-gray-900'}`}
      aria-label="Practice timer"
    >
      <span>{formatMMSS(remainingSeconds)}</span>
      <span className="text-xs font-sans text-gray-400">
        / {formatMMSS(totalSeconds)}
      </span>
    </div>
  );
}
