// Shared percussion helpers used by every drum exercise generator.
//
// MIDI numbers come from General MIDI percussion. We split the kick across
// two slots so we can teach foot alternation:
//   - Bass Drum 1 (36) → right foot ("R")
//   - Acoustic Bass Drum (35) → left foot ("L")

export const KICK_RIGHT = 36;
export const KICK_LEFT = 35;
export const SNARE = 38;
export const HIHAT_CLOSED = 42;
export const HIHAT_PEDAL = 44;

/** Subdivisions-per-beat values that need a `{tu N}` tuplet wrapper. */
export const TUPLET_SUBDIVISIONS: ReadonlySet<number> = new Set([3, 5, 6, 7]);

/**
 * Map subdivisions-per-beat (1..8) to the alphaTex base note duration.
 * Tuplets use the next-finer power-of-2 duration with a `{tu N}`
 * annotation that is applied separately by `buildNote`.
 */
export function baseDuration(n: number): number {
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

/**
 * Build a single alphaTex note token for a chord of MIDI pitches.
 * **MIDI numbers must be in ascending order** — alphaTex rejects descending
 * percussion chords with "Wrong note kind 'Fretted'".
 */
export function buildNote(
  midiPitches: ReadonlyArray<number>,
  duration: number,
  tuplet: number | null,
): string {
  const head = `(${midiPitches.join(' ')}).${duration}`;
  return tuplet ? `${head}{tu ${tuplet}}` : head;
}
