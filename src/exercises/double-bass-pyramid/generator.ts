import type { ExerciseConfig } from '../types';
import {
  HIHAT_CLOSED,
  KICK_LEFT,
  KICK_RIGHT,
  SNARE,
  TUPLET_SUBDIVISIONS,
  baseDuration,
  buildNote,
} from '../percussion';

function pyramidSequence(start: number, end: number): number[] {
  const lo = Math.min(start, end);
  const hi = Math.max(start, end);
  const up: number[] = [];
  for (let i = lo; i <= hi; i++) up.push(i);
  const down: number[] = [];
  for (let i = hi; i >= lo; i--) down.push(i);
  return [...up, ...down];
}

const RANDOM_SEQUENCE_LENGTH = 200;

// Mulberry32 — small, fast, well-distributed seeded PRNG.
// Same seed → same sequence, so a config + seed combination is reproducible.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomSequence(start: number, end: number, seed: number): number[] {
  const lo = Math.min(start, end);
  const hi = Math.max(start, end);
  const span = hi - lo + 1;
  const rng = mulberry32(seed);
  const sequence: number[] = [];
  for (let i = 0; i < RANDOM_SEQUENCE_LENGTH; i++) {
    sequence.push(lo + Math.floor(rng() * span));
  }
  return sequence;
}

function buildBeat(beatIndex: number, subdivisions: number): string {
  const duration = baseDuration(subdivisions);
  const tuplet = TUPLET_SUBDIVISIONS.has(subdivisions) ? subdivisions : null;
  const isBackbeat = beatIndex === 1 || beatIndex === 3;
  const tokens: string[] = [];
  for (let i = 0; i < subdivisions; i++) {
    // Alternate kick across the whole bar so feet stay coordinated.
    // Every bar's kick count is `4 * subdivisions`, which is always even,
    // so each new bar consistently starts on the right foot.
    const globalIndex = beatIndex * subdivisions + i;
    const kick = globalIndex % 2 === 0 ? KICK_RIGHT : KICK_LEFT;
    const chord: number[] = [kick];
    if (i === 0) {
      if (isBackbeat) chord.push(SNARE);
      chord.push(HIHAT_CLOSED);
    }
    tokens.push(buildNote(chord, duration, tuplet));
  }
  return tokens.join(' ');
}

function buildBar(subdivisions: number): string {
  const beats = [0, 1, 2, 3].map((b) => buildBeat(b, subdivisions));
  return `${beats.join(' ')} |`;
}

export function generateAlphaTex(config: ExerciseConfig): string {
  const { bpm, start, end, seed } = config as {
    bpm: number;
    start: number;
    end: number;
    seed?: number;
  };
  const seedValue = Number(seed) || 0;
  const sequence =
    seedValue > 0 ? randomSequence(start, end, seedValue) : pyramidSequence(start, end);
  const bars = sequence.map(buildBar);
  return [
    `\\tempo ${bpm}`,
    '.',
    '\\track "Drums"',
    '\\instrument percussion',
    '\\clef neutral',
    '\\ts 4 4',
    bars.join('\n'),
  ].join('\n');
}
