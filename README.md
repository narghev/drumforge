# Drumforge

A free, browser-based drum exercise platform with synchronized scrolling notation, configurable BPM, timers, and shareable URLs. No login, no subscription.

The MVP ships with one exercise: **Double Bass Pyramid** — kicks-per-beat ramps from 1 up to 8 and back down (15 bars total) over a steady hi-hat / backbeat snare pattern.

## Stack

- React 18+ / TypeScript (strict)
- Vite
- Tailwind CSS
- [`@coderline/alphatab`](https://www.npmjs.com/package/@coderline/alphatab) for notation rendering and playback
- `react-router-dom` v7

## Run it

This project uses **`pnpm`** exclusively. Do not use `npm` or `yarn` — `pnpm-lock.yaml` is the lockfile.

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # production bundle
pnpm preview  # serve the production build locally
```

## Adding a new exercise

The whole architecture is pulled by a registry — to add an exercise, drop a folder under `src/exercises/` and register it.

1. `src/exercises/<your-exercise>/`
   - `metadata.ts` — id (slug), name, description, difficulty
   - `config.ts` — `ConfigField[]` and `defaultConfig`
   - `generator.ts` — `(config) => alphaTexString`
   - `index.ts` — exports a `ExerciseDefinition`
2. Add the import + entry to `src/exercises/registry.ts`.

That's it — the home page lists it, and the player picks it up by id at `/exercises/<slug>`.

## Shareable URLs

Every `ConfigField` round-trips through query parameters. Copy a configured URL, send it to a friend, and they land on the same setup.

- Hydrated from `URLSearchParams` on mount; missing keys fall back to `defaultConfig`.
- Only non-default values are written back to the URL (short, intentional links).
- Type coercion + range validation per field type. Invalid values are dropped with a `console.warn`.
- Disabled fields still hydrate from the URL — share `?start=3&end=6` today even though those inputs are greyed out.

Example: `http://localhost:5173/exercises/double-bass-pyramid?bpm=120&timerSeconds=600`

## Self-hosted assets

The Bravura music font (OFL) and the bundled SonivoxBundled SoundFont (alphaTab default) are copied into `public/alphatab/` so the player works without external CDN calls. License files are kept alongside the binaries.

## Project layout

```
src/
├── exercises/         # exercise registry + per-exercise folders
├── components/        # ExercisePlayer, ConfigPanel, Timer, …
├── pages/             # HomePage, ExercisePage
├── lib/               # alphatab-setup, useExerciseConfig, useCountdown
├── App.tsx            # router
└── main.tsx
```

See `CLAUDE.md` for the full specification and architectural decisions.

## License

Copyright © 2026 Narek Ghevandiani. Released under the [MIT License](./LICENSE).

The `@coderline/alphatab` dependency is MPL-2.0; consuming it via npm without modifying its source files is compatible with this project's MIT license.
