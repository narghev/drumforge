import type { ExerciseConfig } from '../types';
import { HIHAT_PEDAL, SNARE } from '../percussion';

const BEATS_PER_BAR = 4;

/**
 * Resolve the subdivision string from config into notes-per-beat. Anything
 * unexpected falls back to 4 (sixteenth notes) so a malformed URL still loads.
 */
function notesPerBeat(subdivision: string | undefined): 2 | 4 {
  return subdivision === '8' ? 2 : 4;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Build enough bars that the accent pattern resolves: the next iteration must
 * start with an accent on beat 1. That means `numBars * notesPerBar` has to be
 * divisible by `groupSize`, so we pick the smallest such count —
 * `lcm(notesPerBar, N) / notesPerBar`, which simplifies to `N / gcd(...)`.
 */
function buildBars(groupSize: number, perBeat: 2 | 4): string {
  const notesPerBar = perBeat * BEATS_PER_BAR;
  const duration = perBeat === 2 ? 8 : 16;
  const numBars = groupSize / gcd(notesPerBar, groupSize);
  const bars: string[] = [];
  for (let bar = 0; bar < numBars; bar++) {
    const tokens: string[] = [];
    for (let j = 0; j < notesPerBar; j++) {
      const globalIndex = bar * notesPerBar + j;
      const isFirstOfBeat = j % perBeat === 0;
      const isAccented = globalIndex % groupSize === 0;
      // Accent is a note-level property in alphaTex, so it sits inside the
      // chord parens attached directly to the snare MIDI — `(38{ac} 44).16`.
      // MIDI numbers stay ascending: SNARE (38) before HIHAT_PEDAL (44).
      // `{beam down}` forces the beam/stem below the staff so accent marks
      // render above the note heads, which is the conventional placement.
      const snareToken = isAccented ? `${SNARE}{ac}` : `${SNARE}`;
      const inner = isFirstOfBeat ? `${snareToken} ${HIHAT_PEDAL}` : snareToken;
      tokens.push(`(${inner}).${duration}{beam down}`);
    }
    bars.push(`${tokens.join(' ')} |`);
  }
  return bars.join('\n');
}

export function generateAlphaTex(config: ExerciseConfig): string {
  const { bpm, groupSize, subdivision } = config as {
    bpm: number;
    groupSize: number;
    subdivision: string;
  };
  const perBeat = notesPerBeat(subdivision);
  return [
    `\\tempo ${bpm}`,
    '.',
    '\\track "Drums"',
    '\\instrument percussion',
    '\\clef neutral',
    '\\ts 4 4',
    buildBars(groupSize, perBeat),
  ].join('\n');
}
