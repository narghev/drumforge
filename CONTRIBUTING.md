# Contributing to Drumforge

Drumforge welcomes contributions — new exercises, bug fixes, polish, all good. This document covers everything you need to run the project locally and how the moving parts fit together.

## A note on AI

Drumforge has been built largely with AI coding assistants — a lot of the code in this repo started as a conversation with one. PRs containing AI-generated code are explicitly welcome; no asterisks, no disclosure required. Use whatever tools make you productive.

The usual expectations still apply: build green, behavior verified by hand or tests, code reasonable to read, and changes scoped tightly. How you got there isn't tracked.

## Stack

- React 18+ / TypeScript (strict mode)
- Vite
- Tailwind CSS
- [`@coderline/alphatab`](https://www.npmjs.com/package/@coderline/alphatab) for notation rendering and playback
- `react-router-dom` v7

## Local setup

This project uses **`pnpm`** exclusively. Do not use `npm` or `yarn` — `pnpm-lock.yaml` is the lockfile.

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # production bundle
pnpm preview  # serve the production build locally
```

## Adding a new exercise

The architecture is registry-driven — to add an exercise, drop a folder under `src/exercises/` and register it.

1. `src/exercises/<your-exercise>/`:
   - `metadata.ts` — id (slug), name, description, difficulty
   - `config.ts` — `ConfigField[]` and `defaultConfig`
   - `generator.ts` — `(config) => alphaTexString`
   - `index.ts` — exports an `ExerciseDefinition`
2. Add the import + entry to `src/exercises/registry.ts`.

The home page lists it, and the player picks it up by id at `/exercises/<slug>`.

### Reusable field definitions

Common fields (BPM, timer, metronome, count-in) are exported from `src/exercises/fields.ts`. Spread them into your `configFields` array — no copy-paste required.

```ts
import {
  bpmField,
  timerMinutesField,
  timerSecondsField,
  metronomeField,
  countInField,
} from '../fields';

export const configFields = [
  bpmField,
  // …your exercise-specific fields…
  timerMinutesField,
  timerSecondsField,
  metronomeField,
  countInField,
];
```

To override defaults / range, use the `*Factory` helpers (e.g. `bpmFieldFactory({ min: 30, max: 120, default: 80 })`).

### Reusable input components

The render layer is split per field type under `src/components/fields/`:

- `NumberField` — bordered numeric input
- `SliderField` — range slider with the live value beside the label
- `BooleanField` — inline checkbox
- `SelectField` — dropdown
- `ActionField` — bordered button (used for toggles like Randomize)

`ConfigField.tsx` is a thin router that picks the right component based on `field.type`. You shouldn't need to touch any of this when adding an exercise.

## URL state architecture

Every `ConfigField` round-trips through query parameters via the `useExerciseConfig` hook in `src/lib/`.

- On mount, hydrates from `URLSearchParams`, falling back to `defaultConfig` for missing keys.
- On every change, writes back via `replaceState` (no history pollution).
- Only **non-default** values are encoded — defaults stay out of the URL, so shared links are short and intentional.
- Type coercion + range validation per field type. Invalid values are dropped with a `console.warn`.
- Disabled fields (`enabled: false`) still hydrate from the URL — useful for pre-sharing configs whose UI controls aren't built yet.
- Hidden fields (`hidden: true`) hydrate but aren't rendered (used today for the boolean `random` flag that pairs with the `Randomize` action button).

Example: `https://drumforge.app/exercises/double-bass-pyramid?bpm=120&random=true`

For exercises that need cross-field validation (e.g. "end ≥ start"), expose a `normalizeConfig` on the `ExerciseDefinition`. For dynamic input bounds (e.g. "end's min tracks current start"), expose `getFieldConstraints`. For action buttons that toggle state, expose `handleAction` and `getActionLabel`.

## Self-hosted assets

The Bravura music font (OFL) and the bundled Sonivox SoundFont (alphaTab's default) are copied into `public/alphatab/` so the player works without external CDN calls. License files are kept alongside the binaries.

The alphaTab Web Worker (`alphaTab.worker.mjs`) and main script (`alphaTab.mjs`) are also copied to `public/alphatab/`; the player's settings point at these paths so worker resolution works in both Vite dev and production.

## Project layout

```
src/
├── exercises/         # exercise registry + per-exercise folders + shared field defs
├── components/
│   ├── fields/        # NumberField, SliderField, BooleanField, SelectField, ActionField
│   ├── ConfigPanel.tsx
│   ├── ExercisePlayer.tsx
│   ├── Footer.tsx
│   └── ThemeToggle.tsx
├── pages/             # HomePage, ExercisePage
├── lib/               # alphatab-setup, useExerciseConfig, useCountdown, useTheme, useDocumentTitle
├── App.tsx            # router
└── main.tsx
public/
├── alphatab/          # self-hosted alphaTab assets (font, soundfont, worker, main script)
├── og-image.png       # Open Graph image for social previews
├── og-source.html     # source HTML for regenerating og-image.png (build-tool, noindex)
├── _redirects         # SPA fallback for Cloudflare Pages
├── robots.txt
└── sitemap.xml
```

See `CLAUDE.md` for the full original specification and architectural decisions.

## Deployment

The `main` branch auto-deploys to Cloudflare Pages via `.github/workflows/deploy.yml`. Push to `main` → GitHub Action runs `pnpm build` → `wrangler` uploads `dist/` → live at [drumforge.app](https://drumforge.app) within ~1–2 minutes.
