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
import { type Stroke, getRudiment, rudiments } from '../rudiments';

const BEATS_PER_BAR = 4;

/**
 * Build the alphaTex token sequence for a single bar of a rudiment.
 * Length must divide `BEATS_PER_BAR` evenly so strokes spread cleanly
 * across the four beats. When `moneyBeat` is on, a hi-hat lands on every
 * beat and a snare on backbeats (2 and 4) layered over the kicks; off
 * means the bar is pure footwork.
 */
function buildBar(pattern: ReadonlyArray<Stroke>, moneyBeat: boolean): string {
  const length = pattern.length;
  if (length === 0 || length % BEATS_PER_BAR !== 0) {
    throw new Error(
      `Rudiment bar length must be a positive multiple of ${BEATS_PER_BAR} (got ${length}).`,
    );
  }
  const subdivisions = length / BEATS_PER_BAR;
  const duration = baseDuration(subdivisions);
  const tuplet = TUPLET_SUBDIVISIONS.has(subdivisions) ? subdivisions : null;
  const tokens: string[] = [];
  for (let i = 0; i < length; i++) {
    const beatIndex = Math.floor(i / subdivisions);
    const isFirstOfBeat = i % subdivisions === 0;
    const isBackbeat = beatIndex === 1 || beatIndex === 3;
    const stroke = pattern[i];
    const kick = stroke === 'R' ? KICK_RIGHT : KICK_LEFT;
    const chord: number[] = [kick];
    if (moneyBeat && isFirstOfBeat) {
      if (isBackbeat) chord.push(SNARE);
      chord.push(HIHAT_CLOSED);
    }
    tokens.push(buildNote(chord, duration, tuplet));
  }
  return `${tokens.join(' ')} |`;
}

export function generateAlphaTex(config: ExerciseConfig): string {
  const { bpm, rudiment: rudimentId, moneyBeat } = config as {
    bpm: number;
    rudiment: string;
    moneyBeat?: boolean;
  };
  // Fall back to the first rudiment if the URL has a value that isn't in
  // the registry (defensive — buildConfig drops unknown select values, but
  // belts and braces).
  const rudiment = getRudiment(rudimentId) ?? rudiments[0];
  const bars = rudiment.pattern.map((p) => buildBar(p, Boolean(moneyBeat)));
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
