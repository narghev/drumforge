/**
 * Stroke played in a rudiment. "R" → right foot, "L" → left foot.
 * (Same convention works just as well for hands if a future exercise
 * reuses these patterns.)
 */
export type Stroke = 'R' | 'L';

/**
 * A rudiment definition. The {@link pattern} is an array of bars; each bar
 * is an array of {@link Stroke}s. The bar's array length determines the
 * subdivision rate within a 4/4 bar:
 *
 *   length 4  → quarter notes (1 stroke per beat)
 *   length 8  → eighth notes (2 / beat)
 *   length 12 → eighth-note triplets (3 / beat)
 *   length 16 → sixteenth notes (4 / beat)
 *   length 20 → sixteenth quintuplets (5 / beat)
 *   length 24 → sixteenth sextuplets (6 / beat)
 *   length 28 → sixteenth septuplets (7 / beat)
 *   length 32 → thirty-second notes (8 / beat)
 *
 * Length **must be a multiple of 4** so the strokes spread evenly across
 * the four beats. The generator will throw if it isn't.
 */
export interface Rudiment {
  /** URL-safe slug — used in the dropdown's option value and in URL state. */
  id: string;
  /** Human-readable name shown in the dropdown. */
  name: string;
  pattern: Stroke[][];
}

// Helper: repeat a short cell across a full bar so the patterns stay readable.
const repeat = (cell: ReadonlyArray<Stroke>, times: number): Stroke[] => {
  const out: Stroke[] = [];
  for (let i = 0; i < times; i++) out.push(...cell);
  return out;
};

// Each rudiment is rendered as **two bars of eighth notes** (8 strokes per
// bar = 2 strokes per beat). Two-bar phrasing matches how these are
// typically written in method books — the repeat reinforces the pattern
// before alphaTab's native loop kicks in.

export const rudiments: ReadonlyArray<Rudiment> = [
  {
    id: 'singles-right',
    name: 'Singles (Right Lead)',
    pattern: [repeat(['R', 'L'], 4), repeat(['R', 'L'], 4)],
  },
  {
    id: 'singles-left',
    name: 'Singles (Left Lead)',
    pattern: [repeat(['L', 'R'], 4), repeat(['L', 'R'], 4)],
  },
  {
    id: 'doubles-right',
    name: 'Doubles (Right Lead)',
    pattern: [repeat(['R', 'R', 'L', 'L'], 2), repeat(['R', 'R', 'L', 'L'], 2)],
  },
  {
    id: 'doubles-left',
    name: 'Doubles (Left Lead)',
    pattern: [repeat(['L', 'L', 'R', 'R'], 2), repeat(['L', 'L', 'R', 'R'], 2)],
  },
  {
    id: 'paradiddle',
    name: 'Paradiddle',
    // 1 paradiddle per bar (RLRR LRLL = 8 eighths)
    pattern: [
      ['R', 'L', 'R', 'R', 'L', 'R', 'L', 'L'],
      ['R', 'L', 'R', 'R', 'L', 'R', 'L', 'L'],
    ],
  },
  {
    id: 'inverted-paradiddle',
    name: 'Inverted Paradiddle',
    // 1 inverted paradiddle per bar (RLLR LRRL = 8 eighths)
    pattern: [
      ['R', 'L', 'L', 'R', 'L', 'R', 'R', 'L'],
      ['R', 'L', 'L', 'R', 'L', 'R', 'R', 'L'],
    ],
  },
];

export function getRudiment(id: string): Rudiment | undefined {
  return rudiments.find((r) => r.id === id);
}
