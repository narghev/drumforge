import type { ExerciseConfig } from '../types';

const KICK = 36;
const SNARE = 38;
const HIHAT_CLOSED = 42;

const TUPLET_SUBDIVISIONS = new Set([3, 5, 6, 7]);

function baseDuration(n: number): number {
  switch (n) {
    case 1:
      return 4;
    case 2:
    case 3:
      return 8;
    case 4:
    case 5:
    case 6:
    case 7:
      return 16;
    case 8:
      return 32;
    default:
      throw new Error(`Unsupported subdivision count: ${n}. Expected 1-8.`);
  }
}

function pyramidSequence(start: number, end: number): number[] {
  const lo = Math.min(start, end);
  const hi = Math.max(start, end);
  const up: number[] = [];
  for (let i = lo; i <= hi; i++) up.push(i);
  const down: number[] = [];
  for (let i = hi - 1; i >= lo; i--) down.push(i);
  return [...up, ...down];
}

function buildNote(midiPitches: number[], duration: number, tuplet: number | null): string {
  const head = `(${midiPitches.join(' ')}).${duration}`;
  return tuplet ? `${head}{tu ${tuplet}}` : head;
}

function buildBeat(beatIndex: number, subdivisions: number): string {
  const duration = baseDuration(subdivisions);
  const tuplet = TUPLET_SUBDIVISIONS.has(subdivisions) ? subdivisions : null;
  const isBackbeat = beatIndex === 1 || beatIndex === 3;
  const tokens: string[] = [];
  for (let i = 0; i < subdivisions; i++) {
    const chord: number[] = [KICK];
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
  const { bpm, start, end } = config as { bpm: number; start: number; end: number };
  const sequence = pyramidSequence(start, end);
  const bars = sequence.map(buildBar);
  return [
    '\\title "Double Bass Pyramid"',
    `\\tempo ${bpm}`,
    '.',
    '\\track "Drums"',
    '\\instrument percussion',
    '\\ts 4 4',
    bars.join('\n'),
  ].join('\n');
}
