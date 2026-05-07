# CLAUDE.md — Drumforge: Interactive Drum Exercise Trainer

## Vision

A free, browser-based drum exercise platform with synchronized scrolling notation (Songsterr-style), configurable BPM, timers, and — eventually — randomization and gamification. No login, no subscription. The MVP ships with one exercise (Double Bass Pyramid) and an architecture that makes adding more exercises trivial.

## MVP Scope (this build)

- Single-page app, two routes:
  - `/` — list of exercises (only one for now)
  - `/exercises/:id` — exercise player view
- One exercise: **Double Bass Pyramid**
- Player loads with default config:
  - Pyramid range: 1–8 (15 bars total: 1,2,3,4,5,6,7,8,7,6,5,4,3,2,1)
  - BPM: 60
  - Timer: 15 minutes
- Notation rendered + played back via **alphaTab** with synchronized cursor
- **Only BPM is editable** in the UI for MVP. All other config fields are visible but disabled (greyed out, "Coming soon" tooltip), so the user can see what's coming.
- Playback loops the pyramid until the timer expires, at which point it stops automatically.

## Out of Scope for MVP (but architecture must support)

The following must not be implemented now, but the data model, components, and folder structure must make these straightforward to add later without refactoring:

- Configurable timer duration
- Configurable pyramid start/end (e.g., 1–4, 3–8)
- Randomization (e.g., generate a random sequence of subdivisions like `1 3 5 3 3 4 8`)
- Hand pattern variations (different hi-hat/ride patterns)
- Time signature variations
- Additional exercises (rudiments, polyrhythms, paradiddle-feet, etc.)
- Gamification (streaks, BPM personal bests, daily challenges)
- User accounts / cloud persistence

## Tech Stack

- **Language**: **TypeScript (required, strict mode).** No `.js` or `.jsx` files anywhere in `src/`. The exercise registry pattern leans on the type system to keep new exercise contributions safe — the `ExerciseDefinition` contract is the type-checked guardrail that makes "add a folder, register it, done" actually work without breaking the player. `tsconfig.json` must have `"strict": true`.
- **Framework**: React 18
- **Build tool**: Vite
- **Styling**: Tailwind CSS
- **Notation + playback**: [`@coderline/alphatab`](https://www.npmjs.com/package/@coderline/alphatab) (MPL-2.0 — fine to consume as a dependency under any project license, since we don't modify its source files)
- **Routing**: `react-router-dom`
- **State**: React `useState` / `useReducer` / `useContext`. No Redux.
- **Persistence**: none for MVP (architect for `localStorage` later)
- **URL state (required)**: every `ConfigField` must round-trip through query parameters so a configured exercise is shareable by URL. See "Shareable URL state" below.

## Shareable URL state (required)

The exercise page URL is the canonical source of truth for any non-default config. The user must be able to copy the URL, send it to a friend, and have the friend land on an identical setup.

**Rules:**

- On `/exercises/:id` mount, hydrate the exercise config from `URLSearchParams`, falling back to `exerciseDef.defaultConfig` for any missing keys.
- Whenever the user changes a config field, immediately update the URL via `history.replaceState` (or `useSearchParams` in `react-router-dom` v7 with `{ replace: true }` — no history entry per keystroke).
- **Only encode non-default values.** If a field equals its default, omit it from the query string. This keeps shared URLs short and makes intent explicit (a friend opening `?bpm=140` clearly wanted 140, not "the default which happens to be 140 today").
- Coerce types per `ConfigField.type`:
  - `number` / `range` → `Number(value)`, ignore if `NaN` or out of `[min, max]`
  - `boolean` → `'true'`/`'false'` ↔ `true`/`false`; reject anything else
  - `select` → must match one of the field's `options[].value`
  - `action` → not URL-encoded (transient triggers like "Randomize" don't belong in the URL; if a randomization produces a sequence the user wants to share, encode the *resolved seed*, not the action — see below)
- **Disabled fields are still hydratable.** A field with `enabled: false` in the UI should still accept a value from the URL — this lets us pre-share configurations whose UI controls aren't built yet (e.g., share `?start=3&end=6` today even though the start/end inputs are greyed out).
- Validate on hydrate; silently drop invalid values and log a `console.warn` so the player still loads.
- Reserved param names: avoid using `id`, `t` (tempo override), or any single letter as a `ConfigField.key` to prevent collisions with future routing or analytics params.

**Randomization & seeds (forward-looking, not in MVP):**

- Pure randomization (`Math.random()`) is unshareable — never use it for anything that affects the generated AlphaTex.
- When randomization lands, the generator must accept a `seed: number` config field. Randomize button = "pick a new seed and put it in the URL." The generator is then deterministic given `(config + seed)`.

**Implementation hint:**

A small `useExerciseConfig(exercise)` hook is the cleanest place to put this. It returns `[config, setConfig]`, reads/writes `URLSearchParams`, and handles coercion + validation against the exercise's `configFields`. Both `ConfigPanel` and `ExercisePlayer` consume the same hook so they stay in sync.

## Folder Structure

```
drumforge/
├── public/
│   └── (static assets)
├── src/
│   ├── exercises/
│   │   ├── types.ts                    # ExerciseDefinition, ConfigField types
│   │   ├── registry.ts                 # imports & exports all exercises
│   │   └── double-bass-pyramid/
│   │       ├── index.ts                # exports the ExerciseDefinition
│   │       ├── metadata.ts             # name, slug, description, difficulty
│   │       ├── config.ts               # config fields, defaults
│   │       └── generator.ts            # (config) => AlphaTex string
│   ├── components/
│   │   ├── ExerciseList.tsx            # home page list/grid
│   │   ├── ExerciseCard.tsx
│   │   ├── ExercisePlayer.tsx          # alphaTab host + orchestration
│   │   ├── ConfigPanel.tsx             # renders ConfigField[] dynamically
│   │   ├── ConfigField.tsx             # one field renderer (number/range/bool/select)
│   │   ├── PlaybackControls.tsx        # Play/Pause/Stop
│   │   └── Timer.tsx                   # countdown display
│   ├── lib/
│   │   ├── alphatab-setup.ts           # init helpers, settings factory
│   │   └── timer.ts                    # countdown hook (useCountdown)
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── ExercisePage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                       # tailwind directives
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── LICENSE
├── README.md
└── CLAUDE.md
```

## Architecture: How to Add a New Exercise

To add an exercise (post-MVP), the only required steps are:

1. Create a new folder under `src/exercises/` (e.g., `src/exercises/paradiddle-feet/`)
2. Add `metadata.ts`, `config.ts`, `generator.ts`, `index.ts`
3. Import and register it in `src/exercises/registry.ts`

That's it. The home page reads from the registry, and the player uses the `ExerciseDefinition` to render the config panel and generate AlphaTex. **No changes to player or routing should be needed.**

## Type Definitions

```typescript
// src/exercises/types.ts

export type ConfigFieldType = 'number' | 'range' | 'boolean' | 'select' | 'action';

export interface SelectOption {
  value: string;
  label: string;
}

export interface ConfigField {
  key: string;                   // e.g. 'bpm', matches key in defaultConfig
  label: string;                 // user-visible label
  type: ConfigFieldType;
  default: unknown;
  min?: number;                  // for number/range
  max?: number;
  step?: number;
  options?: SelectOption[];      // for select
  enabled: boolean;              // false => visible but disabled in UI ("Coming soon")
  description?: string;          // tooltip / helper text
  group?: string;                // optional grouping in UI (e.g., 'Pattern', 'Tempo', 'Timer')
}

export type ExerciseConfig = Record<string, unknown>;

export interface ExerciseDefinition {
  id: string;                    // url slug, kebab-case
  name: string;
  description: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  configFields: ConfigField[];
  defaultConfig: ExerciseConfig;
  generateAlphaTex: (config: ExerciseConfig) => string;
}
```

```typescript
// src/exercises/registry.ts
import { doubleBassPyramid } from './double-bass-pyramid';
import type { ExerciseDefinition } from './types';

export const exercises: ExerciseDefinition[] = [
  doubleBassPyramid,
];

export function getExercise(id: string): ExerciseDefinition | undefined {
  return exercises.find(e => e.id === id);
}
```

## Double Bass Pyramid Specification

### Musical Structure

Time signature: **4/4**

Each bar contains three simultaneous voices that must play together:

- **Hi-hat**: closed hi-hat on every quarter beat (4 hits per bar, always)
- **Snare**: on beats 2 and 4 (2 hits per bar, always)
- **Kick (double bass)**: N evenly-spaced hits across the bar, where N varies bar-by-bar

For the default 1→8 pyramid, kick subdivision counts go:

```
Bar:   1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
Kicks: 1  2  3  4  5  6  7  8  7  6  5  4  3  2  1
```

(That's "kicks per beat" × 4 beats per bar. So bar 1 has 1 kick per beat = 4 kicks total in the bar; bar 8 has 8 kicks per beat = 32 kicks total.)

> **Note on interpretation.** "1 to 8" can mean either (a) N kicks per *beat* — bar 1 = 4 kicks total, bar 8 = 32 kicks total / 32nd notes — or (b) N kicks per *bar* — bar 1 = 1 kick total, bar 8 = 8 kicks total. Use **(a) kicks per beat**. This is the standard "rhythmic scale" pyramid taught by Drumeo and Aquiles Priester. The config can be extended later to expose (b) if needed.

### Subdivision Implementation Notes

When N kicks per beat is:

| N | Notation | Notes |
|---|---|---|
| 1 | quarter notes | straight |
| 2 | eighth notes | straight |
| 3 | eighth-note triplets | tuplet (3 in space of 2) |
| 4 | sixteenth notes | straight |
| 5 | sixteenth quintuplets | tuplet (5 in space of 4) |
| 6 | sixteenth sextuplets | tuplet (6 in space of 4) |
| 7 | sixteenth septuplets | tuplet (7 in space of 4) |
| 8 | thirty-second notes | straight |

### Config Schema

```typescript
// src/exercises/double-bass-pyramid/config.ts
import type { ConfigField, ExerciseConfig } from '../types';

export const configFields: ConfigField[] = [
  {
    key: 'bpm',
    label: 'BPM',
    type: 'number',
    default: 60,
    min: 30,
    max: 300,
    step: 1,
    enabled: true,
    group: 'Tempo',
  },
  {
    key: 'start',
    label: 'Pyramid start',
    type: 'number',
    default: 1,
    min: 1,
    max: 8,
    step: 1,
    enabled: false,
    group: 'Pattern',
    description: 'Lowest subdivision count (kicks per beat)',
  },
  {
    key: 'end',
    label: 'Pyramid end',
    type: 'number',
    default: 8,
    min: 1,
    max: 8,
    step: 1,
    enabled: false,
    group: 'Pattern',
    description: 'Highest subdivision count (kicks per beat)',
  },
  {
    key: 'randomize',
    label: 'Randomize order',
    type: 'action',
    default: false,
    enabled: false,
    group: 'Pattern',
    description: 'Shuffle the subdivision sequence',
  },
  {
    key: 'timerSeconds',
    label: 'Timer',
    type: 'number',
    default: 900,
    min: 60,
    max: 3600,
    step: 60,
    enabled: false,
    group: 'Timer',
    description: 'Total practice time in seconds',
  },
  {
    key: 'loop',
    label: 'Loop until timer ends',
    type: 'boolean',
    default: true,
    enabled: false,
    group: 'Timer',
  },
];

export const defaultConfig: ExerciseConfig = Object.fromEntries(
  configFields.map(f => [f.key, f.default])
);
```

### Generator Spec

```typescript
// src/exercises/double-bass-pyramid/generator.ts

export function generateAlphaTex(config: ExerciseConfig): string {
  const { bpm, start, end } = config as { bpm: number; start: number; end: number };

  // 1. Build the subdivision sequence: ascending then descending
  //    e.g., start=1, end=8 => [1,2,3,4,5,6,7,8,7,6,5,4,3,2,1]
  // 2. For each subdivision count N, generate one bar of AlphaTex with:
  //    - Voice 1: hi-hat on every quarter, snare on 2 and 4
  //    - Voice 2: N evenly-spaced kicks across the bar (use tuplets when N is not a power of 2)
  // 3. Concatenate all bars into a single AlphaTex score.
  // 4. Return the full AlphaTex string.

  // Pseudocode:
  // const sequence = [...range(start, end), ...range(end-1, start, -1)];
  // const bars = sequence.map(n => buildBar(n));
  // return [`\\title "Double Bass Pyramid"`, `\\tempo ${bpm}`, `.`, ...buildTrack(bars)].join('\n');
}
```

> **Implementation note for the agent**: AlphaTex syntax for drum tracks needs to be verified against the alphaTab docs and examples — specifically:
> - How to declare a percussion track (`\track "Drums" \instrument percussion` or similar)
> - Named drum articulations (e.g., `KickHit`, `SnareHit`, `HiHat`) vs. MIDI numbers (e.g., `36` kick, `38` snare, `42` closed hi-hat)
> - Multi-voice syntax for simultaneous independent rhythms (the hi-hat/snare quarter-note voice and the kick subdivision voice). AlphaTab supports multiple voices per track.
> - Tuplet syntax (likely `note.duration { tu N }` over a group, but verify)
> - Whether `\ts 4 4` is needed per bar or just once
>
> **Recommended workflow:**
> 1. Manually build a 1-bar AlphaTex sample for N=1 (the simplest case) and load it via `api.tex(...)` to confirm the syntax renders and plays.
> 2. Then N=2 (eighth notes), then N=3 (triplet — first tuplet test).
> 3. Then build the generator and verify each bar renders correctly.
> 4. Then concatenate the full pyramid and visually + aurally check it.

### Validation Checklist for Generated Output

When the generator is wired up, the playable score must satisfy:

- [ ] 15 bars total for default 1–8 pyramid
- [ ] Hi-hat fires on all 4 quarter beats of every bar
- [ ] Snare fires on beats 2 and 4 of every bar
- [ ] Kick subdivision count per bar matches the sequence `[1,2,3,4,5,6,7,8,7,6,5,4,3,2,1]`
- [ ] Each kick is evenly spaced across its beat (tuplets where needed for 3, 5, 6, 7)
- [ ] Tempo respects the BPM config
- [ ] Score plays back without timing drift over a full loop
- [ ] alphaTab cursor follows playback bar-by-bar

## UI / UX Requirements

### Home page (`/`)

- Page title: "Drum Exercises"
- Brief subtitle/tagline (one line)
- A simple grid (or list) of `ExerciseCard` components, one per exercise in the registry
- Each card shows: name, short description, difficulty badge
- Clicking the card navigates to `/exercises/:id`

### Exercise page (`/exercises/:id`)

Layout (rough):

```
┌────────────────────────────────────────────────────────────┐
│  ← Back to exercises                                        │
│  Double Bass Pyramid                                        │
│  <one-line description>                                     │
├──────────────────────────────────────────┬─────────────────┤
│                                          │  Tempo          │
│                                          │  ┌──────────┐   │
│   [alphaTab notation, scrolling          │  │ BPM 60   │   │
│    horizontally, with playback cursor]   │  └──────────┘   │
│                                          │                 │
│                                          │  Pattern        │
│                                          │  Start: 1 🔒    │
│                                          │  End:   8 🔒    │
│                                          │  [Randomize] 🔒 │
│                                          │                 │
│                                          │  Timer          │
│                                          │  15:00     🔒   │
│                                          │  Loop  ✓   🔒   │
├──────────────────────────────────────────┴─────────────────┤
│      [⏮ Stop]   [▶ Play / ⏸ Pause]                 14:23   │
└────────────────────────────────────────────────────────────┘
```

- The alphaTab container should have a fixed height and horizontal auto-scroll set as the `scrollElement` so the cursor stays visible during playback.
- Disabled config fields render with `opacity-50`, `cursor-not-allowed`, `disabled` attribute, and a small "Coming soon" badge or tooltip.
- BPM input updates alphaTab tempo in real-time without restarting playback (use the API; verify whether `api.changeTempo()` / setting `score.tempo` / re-rendering is the cleanest path).
- Timer:
  - Displays as `MM:SS`, counts down from `timerSeconds` once Play is pressed
  - Pauses when playback pauses, resumes when playback resumes
  - When it hits 0, calls `api.stop()` and resets to `timerSeconds`
- Playback controls:
  - Play/Pause toggles
  - Stop returns cursor to bar 1 and resets the timer to its starting value
- Loop behavior: alphaTab fires `playerFinished` (or equivalent) when the score ends; the player component listens for this and, if the timer hasn't expired, calls `api.playPause()` again to restart from the top. Alternatively use alphaTab's built-in looping if it works for the whole score.

### Error / loading states

- While alphaTab is loading the SoundFont, show a small spinner and disable Play.
- If exercise id is not found in registry, show a 404-style "Exercise not found" message with a link back to `/`.

## alphaTab Integration Notes

- Install: `npm install @coderline/alphatab`
- Create the API instance once per mount, dispose on unmount:
  ```typescript
  const api = new alphaTab.AlphaTabApi(containerEl, {
    player: {
      enablePlayer: true,
      soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2',
      scrollElement: scrollContainerEl,
    },
  });
  ```
  (Verify additional settings like cursor/interaction toggles against current alphaTab docs — the defaults usually work.)
- Load notation: `api.tex(alphaTexString)`
- Controls: `api.playPause()`, `api.stop()`
- Events to subscribe to: `playerReady`, `playerStateChanged`, `playerFinished` (verify exact names against current API), `playerPositionChanged`
- Tempo updates: prefer the live API method if available; otherwise the cleanest fallback is to regenerate AlphaTex with the new tempo and reload, but that interrupts playback — only acceptable while paused. Verify the current alphaTab API for live tempo changes before settling on an approach.
- Cleanup: call `api.destroy()` in the React component's cleanup function

## Package Manager

**Use `pnpm`** for all install/run/script commands. Do not use `npm` or `yarn`. Commit `pnpm-lock.yaml`.

## Setup Commands

```bash
pnpm create vite@latest drumforge --template react-ts
cd drumforge
pnpm install
pnpm add @coderline/alphatab react-router-dom
pnpm add -D tailwindcss postcss autoprefixer
pnpm exec tailwindcss init -p
```

Configure `tailwind.config.js` `content` to `['./index.html', './src/**/*.{ts,tsx}']`. Add Tailwind directives to `src/index.css`.

## Recommended Build Order

1. **Scaffold**: Vite + React + TS + Tailwind + Router. Confirm dev server runs.
2. **Types & registry**: Create `src/exercises/types.ts` and an empty `registry.ts`.
3. **Exercise stub**: Create the `double-bass-pyramid` folder with `metadata.ts`, `config.ts`, and a stub `generator.ts` that returns hardcoded one-bar AlphaTex (just to validate alphaTab end-to-end).
4. **Routes & pages**: Wire up `HomePage` (lists exercises from the registry) and `ExercisePage` (loads exercise by id, shows placeholder player).
5. **alphaTab integration**: Build `ExercisePlayer.tsx` that hosts alphaTab, loads AlphaTex from the exercise's generator, renders, and supports basic Play/Pause/Stop. Verify cursor + audio work with the stub.
6. **ConfigPanel**: Render the exercise's `configFields` dynamically. Wire up the BPM field (only enabled one). Disabled fields render greyed-out.
7. **Real generator**: Implement the pyramid generator. Test incrementally: N=1 first, then N=2, then a 3-bar test (1,2,1), then full pyramid. Use the validation checklist above.
8. **Timer**: Build `Timer.tsx` and the `useCountdown` hook. Hook timer state to play/pause/stop and to alphaTab events. Implement looping logic.
9. **Polish**: Loading state, "Coming soon" badges, basic responsive layout, README.

Each step should be independently runnable and testable.

## Resources

- alphaTab homepage: https://alphatab.net/
- alphaTab docs (start here): https://alphatab.net/docs/introduction
- AlphaTex syntax: https://alphatab.net/docs/alphatex/introduction
- Player tutorial: https://alphatab.net/docs/tutorial-web/player
- alphaTab GitHub: https://github.com/CoderLine/alphaTab
- npm package: https://www.npmjs.com/package/@coderline/alphatab
- Drumeo lesson explaining the pyramid (musical reference): https://www.drumeo.com/beat/the-double-bass-drum-pyramid/

## License

**MIT.** When creating the GitHub repository, check "Add a license" and pick the MIT template — GitHub fills in the year and copyright holder automatically. Add a one-line license note to the bottom of the `README.md`:

> Copyright © 2026 [Your Name]. Released under the [MIT License](./LICENSE).

The `@coderline/alphatab` dependency is MPL-2.0, which is compatible with MIT for our purposes — we consume alphaTab via npm without modifying its source files, so its file-level copyleft does not propagate to Drumforge's own code.

## Code Style

- TypeScript strict mode on (`"strict": true` in `tsconfig.json`); no `.js`/`.jsx` files in `src/`
- Functional components with hooks; no class components
- Pure functions for generators (no side effects, easy to unit-test)
- Prefer named exports over default exports
- Co-locate types with the code that uses them when there's no shared consumer
- Keep components small (< 150 lines); extract sub-components when needed
- Tailwind utility classes preferred over custom CSS; only fall back to a `.css` file when utilities are insufficient

## Open Questions / Decisions Deferred

These are intentionally not decided yet. Don't block on them — pick a reasonable default and note it in the README so future iterations can revisit:

- Whether to use alphaTab's built-in score-looping API or implement looping manually via `playerFinished` events
- How to update tempo live without restarting playback (verify what the current API supports)
- Whether the timer should pause automatically when the browser tab is backgrounded
- Whether to show a count-in click before playback starts (probably yes, but not in MVP)
- SoundFont quality (Sonivox is bundled and fine; FluidR3 GM sounds noticeably better but is larger)
