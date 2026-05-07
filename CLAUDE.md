# CLAUDE.md — Drumforge: Interactive Drum Exercise Trainer

## Vision

A free, browser-based drum exercise platform with synchronized scrolling notation (Songsterr-style), configurable BPM, metronome, count-in, and a built-in practice timer. No login, no subscription. The exercise registry is built so adding a new exercise is "drop a folder, register it, done."

Live at **[drumforge.app](https://drumforge.app)** (Cloudflare Pages, deployed via the GitHub Action in `.github/workflows/deploy.yml`).

## Current Exercises

- **Double Bass Pyramid** (`/exercises/double-bass-pyramid`, beginner) — climb 1→8 kicks per beat and back down, alternating right/left foot. Configurable start, end, BPM, and a Randomize action that picks a fresh sequence each click.
- **Double Bass Rudiments** (`/exercises/double-bass-rudiments`, intermediate) — apply a classic sticking (singles, doubles, paradiddle, inverted paradiddle — both leads) to the kicks, with an optional money-beat layer (hi-hat + snare on top).

Both exercises share BPM, timer (minutes + seconds), metronome, and count-in via the reusable `ConfigField` definitions in `src/exercises/fields.ts`.

## Tech Stack

- **Language**: TypeScript, **strict mode**. No `.js` / `.jsx` files in `src/`. The exercise registry leans on the `ExerciseDefinition` type to keep new exercise contributions safe — that contract is what makes "add a folder, register it, done" actually work without breaking the player.
- **Framework**: React 19
- **Build tool**: Vite 7
- **Styling**: Tailwind CSS (with `darkMode: 'class'` — see Theming)
- **Notation + playback**: [`@coderline/alphatab`](https://www.npmjs.com/package/@coderline/alphatab) (MPL-2.0 — fine to consume as a dependency under MIT, since we don't modify its source)
- **Routing**: `react-router-dom` v7
- **State**: React `useState` / `useReducer` / `useContext`. No Redux.
- **Persistence**: none — config lives in URL query params (see Shareable URL state)
- **Package manager**: **`pnpm` exclusively.** Never `npm` or `yarn`. Commit `pnpm-lock.yaml`.

## Shareable URL state (load-bearing)

The exercise page URL is the canonical source of truth for any non-default config. Copy the URL → send to a friend → they land on an identical setup.

**Rules:**

- On `/exercises/:id` mount, hydrate from `URLSearchParams`, falling back to `exerciseDef.defaultConfig` for any missing keys. The `useExerciseConfig(exercise)` hook in `src/lib/useExerciseConfig.ts` is the single place this happens — both `ConfigPanel` and `ExercisePlayer` consume it.
- Whenever the user changes a config field, update the URL via `useSearchParams` with `{ replace: true }` — no history entry per keystroke.
- **Only encode non-default values.** Fields equal to their default are omitted. Keeps shared URLs short and makes intent explicit (`?bpm=140` clearly wanted 140, not "the default which happens to be 140 today").
- Coerce per `ConfigField.type`:
  - `number` / `range` → `Number(value)`, drop if `NaN` or out of `[min, max]`
  - `boolean` → `'true'` / `'false'`; reject anything else
  - `select` → must match one of `options[].value`
  - `action` → never URL-encoded (transient triggers)
- **Disabled fields are still hydratable.** A field with `enabled: false` still accepts a URL value — lets us pre-share configurations whose UI controls aren't built yet.
- **Hidden fields** (`hidden: true`) are persisted in the URL but not rendered in the panel. Used for `seed` on the pyramid's randomized mode.
- Validate on hydrate; silently drop invalid values and `console.warn` so the player still loads.
- **Reserved param names**: avoid `id`, `t`, or any single letter as a `ConfigField.key` to prevent collisions.

**Randomization & seeds:**

- Pure `Math.random()` is unshareable — never affect the AlphaTex with it directly.
- The pyramid's randomization works as follows: clicking the "Randomize"/"Pyramid" action button toggles `?random=true` in the URL and the component picks a fresh seed (state-only, **not** in URL — re-clicking Randomize means "give me a new sequence", which would be weird if shareable). Each new visitor of `?random=true` sees their own random sequence. If a future exercise needs reproducible randomness, expose `seed` as a `hidden: true` ConfigField and put it in the URL.

## Folder Structure (current)

```
drumforge/
├── .github/workflows/
│   └── deploy.yml                      # Cloudflare Pages deploy
├── public/
│   ├── alphatab/                       # workers + worklet copied at build
│   ├── soundfont/                      # FluidR3 .sf2
│   ├── font/                           # Bravura music font
│   ├── og-image.png, favicon.*, robots.txt, sitemap.xml, _redirects
├── src/
│   ├── exercises/
│   │   ├── types.ts                    # ExerciseDefinition, ConfigField, FieldConstraints
│   │   ├── registry.ts                 # imports & exports all exercises
│   │   ├── fields.ts                   # shared ConfigField definitions (bpm, timer, metronome, …)
│   │   ├── percussion.ts               # MIDI constants + baseDuration / buildNote helpers
│   │   ├── rudiments.ts                # Rudiment library (used by double-bass-rudiments)
│   │   ├── double-bass-pyramid/
│   │   │   ├── index.ts                # exports the ExerciseDefinition
│   │   │   ├── metadata.ts
│   │   │   ├── config.ts
│   │   │   └── generator.ts
│   │   └── double-bass-rudiments/
│   │       ├── index.ts
│   │       ├── metadata.ts
│   │       ├── config.ts
│   │       └── generator.ts
│   ├── components/
│   │   ├── ExerciseCard.tsx            # home page card
│   │   ├── ExerciseList.tsx            # grid of cards
│   │   ├── ExercisePlayer.tsx          # alphaTab host + Play/Pause/Stop + timer wiring
│   │   ├── ConfigPanel.tsx             # renders ConfigField[] dynamically (groups, etc.)
│   │   ├── ConfigField.tsx             # dispatches by type to the right field renderer
│   │   ├── fields/                     # per-type field renderers
│   │   │   ├── NumberField.tsx
│   │   │   ├── SliderField.tsx         # used for type: 'range' (e.g. BPM)
│   │   │   ├── BooleanField.tsx        # native checkbox, themed via accent-color
│   │   │   ├── SelectField.tsx
│   │   │   ├── ActionField.tsx
│   │   │   ├── FieldLabel.tsx
│   │   │   ├── styles.ts               # shared Tailwind class strings
│   │   │   └── index.ts
│   │   ├── Footer.tsx                  # "built by narghev" + GitHub link
│   │   ├── ShareButton.tsx             # copies window.location.href, shows "Copied!"
│   │   ├── ThemeToggle.tsx             # light/dark switch (home page only)
│   │   └── Timer.tsx                   # MM:SS countdown display
│   ├── lib/
│   │   ├── alphatab-setup.ts           # buildSettings(scrollEl, theme) factory
│   │   ├── timer.ts                    # useCountdown hook
│   │   ├── useDocumentTitle.ts
│   │   ├── useExerciseConfig.ts        # URL ⇄ config round-trip
│   │   └── useTheme.ts                 # light/dark theme state
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── ExercisePage.tsx            # lazy-loaded (see App.tsx)
│   ├── App.tsx                         # routes; ExercisePage is React.lazy'd
│   ├── main.tsx
│   └── index.css                       # tailwind directives + tokens
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json, tsconfig.app.json, tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── LICENSE
├── CONTRIBUTING.md
├── README.md
└── CLAUDE.md
```

## Architecture: How to Add a New Exercise

The required steps:

1. Create a folder under `src/exercises/` (e.g., `src/exercises/paradiddle-feet/`).
2. Add `metadata.ts`, `config.ts`, `generator.ts`, `index.ts`.
3. Reuse shared `ConfigField` definitions from `src/exercises/fields.ts` (`bpmField`, `timerMinutesField`, `timerSecondsField`, `metronomeField`, `countInField`, `moneyBeatField`). Override defaults via spread (e.g., `{ ...timerMinutesField, default: 3 }`) — don't redeclare the whole field unless the structure genuinely differs.
4. Reuse `src/exercises/percussion.ts` (`KICK_RIGHT`, `KICK_LEFT`, `SNARE`, `HIHAT_CLOSED`, `baseDuration`, `buildNote`, `TUPLET_SUBDIVISIONS`) — the alphaTex MIDI-chord and tuplet conventions are encoded there. Don't duplicate them.
5. Import and register the exercise in `src/exercises/registry.ts`.

That's it. The home page reads from the registry, and the player + config panel are entirely driven by `ExerciseDefinition`. **No changes to player, panel, routing, or URL state should be needed.**

### Cross-field constraints, dynamic ranges, actions

`ExerciseDefinition` exposes three optional hooks for exercises whose fields interact:

- **`normalizeConfig(config)`** — runs after URL hydration and after every UI update. Use it for "end ≥ start" type invariants. The pyramid uses this so URL-injected `?start=5&end=2` gets coerced sanely.
- **`getFieldConstraints(fieldKey, config)`** — returns dynamic `{ min, max }` for a field given the current config. Lets one field's allowed range depend on another's value (e.g. `end.min` tracks current `start`).
- **`handleAction(actionKey, config)`** — handles clicks on `action`-typed fields. Returns the partial-config update to apply (or `null`). The pyramid's Randomize / Pyramid toggle is implemented here.
- **`getActionLabel(actionKey, config)`** — dynamic label for an action (e.g. flipping between "Randomize" and "Pyramid").

Reach for these only when needed; most exercises won't.

## Type Definitions (canonical — see `src/exercises/types.ts`)

```typescript
export type ConfigFieldType = 'number' | 'range' | 'boolean' | 'select' | 'action';

export interface SelectOption { value: string; label: string; }

export interface ConfigField {
  key: string;
  label: string;
  type: ConfigFieldType;
  default: unknown;
  min?: number; max?: number; step?: number;
  options?: SelectOption[];        // for select
  enabled: boolean;                // false → visible but disabled
  description?: string;            // tooltip / helper
  group?: string;                  // 'Tempo' | 'Pattern' | 'Timer' | 'Playback' | …
  hidden?: boolean;                // not rendered, but still URL-roundtrips
}

export type ExerciseConfig = Record<string, unknown>;

export interface FieldConstraints { min?: number; max?: number; }

export interface ExerciseDefinition {
  id: string;                      // url slug, kebab-case
  name: string;
  description: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  configFields: ConfigField[];
  defaultConfig: ExerciseConfig;
  generateAlphaTex: (config: ExerciseConfig) => string;
  normalizeConfig?: (config: ExerciseConfig) => ExerciseConfig;
  getFieldConstraints?: (fieldKey: string, config: ExerciseConfig) => FieldConstraints | undefined;
  handleAction?: (actionKey: string, config: ExerciseConfig) => Partial<ExerciseConfig> | null;
  getActionLabel?: (actionKey: string, config: ExerciseConfig) => string | undefined;
}
```

## Subdivision-to-AlphaTex Conventions (`percussion.ts`)

When N kicks per beat:

| N | Notation | alphaTex `duration` | Tuplet (`{tu N}`)? |
|---|---|---|---|
| 1 | quarter notes        |  4 | no  |
| 2 | eighth notes         |  8 | no  |
| 3 | eighth-note triplets |  8 | yes |
| 4 | sixteenth notes      | 16 | no  |
| 5 | sixteenth quintuplets| 16 | yes |
| 6 | sixteenth sextuplets | 16 | yes |
| 7 | sixteenth septuplets | 16 | yes |
| 8 | thirty-second notes  | 32 | no  |

`baseDuration(n)` returns the duration; membership in `TUPLET_SUBDIVISIONS` (`{3,5,6,7}`) tells you whether to wrap in `{tu N}`.

**Foot alternation** uses two MIDI slots:
- `KICK_RIGHT = 36` (Bass Drum 1)
- `KICK_LEFT  = 35` (Acoustic Bass Drum)

So `R / L` strokes render as different note-heads in alphaTab and the user gets a visual + aural cue for which foot to use.

**alphaTex chord ordering**: MIDI numbers in `(...)`-chords **must be ascending** — alphaTab rejects descending percussion chords with "Wrong note kind 'Fretted'". `buildNote()` does not re-sort, so callers are responsible.

## Theming

- Tailwind config: `darkMode: 'class'`. The `<html>` element gets `class="dark"` toggled by the `useTheme` hook + `<ThemeToggle>`.
- `index.html` has a small bootstrap script that reads the saved theme from `localStorage` *before* React mounts so there's no flash-of-wrong-theme.
- Native form controls (slider, checkbox) are themed via the CSS `accent-color` property — set on the field components themselves, not via custom shadow DOM.
- `<ThemeToggle>` is rendered **only on the home page**. The exercise page intentionally does not let you switch themes mid-session because alphaTab caches SVG glyphs in a way that makes mid-session re-themes unreliable. Theme is captured at `<ExercisePlayer>` mount and held until unmount.

## Performance / Bundle Splitting

`ExercisePage` is `React.lazy()`'d in `src/App.tsx`. The home page ships React + router + our UI (~78 KB gz). alphaTab (~280 KB gz of JS plus the worker / worklet / soundfont) only loads when a user actually opens an exercise.

Don't undo this — first-paint on `/` is the conversion-funnel page.

## alphaTab Integration Notes

- API construction is centralised in `src/lib/alphatab-setup.ts` (`buildSettings(scrollEl, theme)`). It points the soundfont, worker, and worklet to `/public/alphatab/` + `/public/soundfont/` so they're served from the same origin (avoids cross-origin worker headaches).
- `<ExercisePlayer>` constructs the API once per `exercise` change, sets `api.isLooping = true`, and pushes config updates via:
  - `api.tex(generator.generateAlphaTex(config))` whenever the config or exercise changes
  - `api.metronomeVolume = metronome ? 0.5 : 0`
  - `api.countInVolume   = countIn   ? 0.5 : 0`
- Events: `playerReady`, `playerStateChanged`. Disposal: `api.destroy()` in the cleanup function.
- **Timer reset gotcha**: `useCountdown.onZero` runs from inside a `setRemaining` updater. Calling `resetTimer()` directly from there is unreliable due to React's update batching. Instead: `onZero` calls `api.stop()`, and a separate `useEffect` watches `(remaining === 0 && !playing && totalSeconds > 0)` and resets the timer there.

## UI / UX

### Home page (`/`)

- Title, tagline, theme toggle (top-right), grid of `ExerciseCard`s (one per registry entry: name, short description, difficulty badge), footer.

### Exercise page (`/exercises/:id`)

- Top-right: `<ShareButton>` (copies `window.location.href`).
- Top: "← Back to exercises", title, description.
- `<ConfigPanel>` (dynamic from `configFields`, grouped).
- `<ExercisePlayer>` (alphaTab notation + Play/Pause/Stop + timer).
- `<Footer>` at the bottom.
- 404: "Exercise not found" with a link back to `/` if the slug isn't in the registry.

### Disabled / coming-soon fields

`enabled: false` ConfigFields render greyed-out with a "Coming soon" tooltip. They still hydrate from the URL (so we can pre-share configurations whose UI isn't built yet).

## Setup

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # production bundle into dist/
pnpm preview      # serve dist/
pnpm lint
```

## License

MIT. `Copyright © 2026 Narek Ghevandiani.` See `LICENSE`.

The `@coderline/alphatab` dependency is MPL-2.0 — compatible with MIT for our use because we consume it via npm without modifying its source files, so its file-level copyleft does not propagate to Drumforge's own code.

## Code Style

- TypeScript strict on (`"strict": true`); no `.js`/`.jsx` in `src/`.
- Functional components with hooks; no class components.
- Pure functions for generators (no side effects, easy to unit-test).
- Prefer named exports.
- Keep components small (< 150 lines); extract sub-components.
- Tailwind utility classes preferred over custom CSS; only fall back to a `.css` file when utilities are insufficient.

## Resources

- alphaTab homepage: https://alphatab.net/
- alphaTab docs: https://alphatab.net/docs/introduction
- AlphaTex syntax: https://alphatab.net/docs/alphatex/introduction
- Player tutorial: https://alphatab.net/docs/tutorial-web/player
- alphaTab GitHub: https://github.com/CoderLine/alphaTab
- Drumeo lesson on the pyramid (musical reference): https://www.drumeo.com/beat/the-double-bass-drum-pyramid/

## Open Questions / Decisions Deferred

- Whether the timer should pause automatically when the browser tab is backgrounded.
- SoundFont quality — currently FluidR3 (in `public/soundfont/`); Sonivox is smaller but noticeably worse.
- Whether to expose pattern-randomization with reproducible seeds (`hidden: true` ConfigField) for future exercises.
