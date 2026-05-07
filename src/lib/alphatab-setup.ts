import { NotationElement } from '@coderline/alphatab';

const ALPHATAB_BASE = '/alphatab';
const FONT_DIRECTORY = `${ALPHATAB_BASE}/font/`;
const SOUNDFONT_URL = `${ALPHATAB_BASE}/soundfont/sonivox.sf2`;

const HIDDEN_ELEMENTS: ReadonlyArray<NotationElement> = [
  NotationElement.ScoreTitle,
  NotationElement.ScoreSubTitle,
  NotationElement.ScoreArtist,
  NotationElement.ScoreAlbum,
  NotationElement.ScoreCopyright,
  NotationElement.EffectTempo,
  NotationElement.EffectDynamics,
  NotationElement.TrackNames,
];

export type AlphaTabTheme = 'light' | 'dark';

export interface ThemeResources {
  staffLineColor: string;
  barSeparatorColor: string;
  barNumberColor: string;
  mainGlyphColor: string;
  secondaryGlyphColor: string;
  scoreInfoColor: string;
}

// Dark-mode resource overrides. Light mode uses alphaTab's built-in defaults
// (black notation on a light background) — passing custom "light" colors
// turned out to be flaky on theme switch, so we only override for dark.
const DARK_RESOURCES: ThemeResources = {
  staffLineColor: '#6b7280',      // gray-500 — subtle but visible on dark
  barSeparatorColor: '#9ca3af',   // gray-400 — slightly stronger than staff lines
  barNumberColor: '#9ca3af',      // gray-400 — labels
  mainGlyphColor: '#f3f4f6',      // gray-100 — notes / symbols
  secondaryGlyphColor: '#f3f4f6',
  scoreInfoColor: '#d1d5db',      // gray-300
};

export function buildSettings(scrollElement: HTMLElement, theme: AlphaTabTheme = 'light') {
  const elements = new Map<NotationElement, boolean>();
  for (const el of HIDDEN_ELEMENTS) elements.set(el, false);

  const display: { resources?: ThemeResources } = {};
  if (theme === 'dark') {
    display.resources = DARK_RESOURCES;
  }

  return {
    core: {
      fontDirectory: FONT_DIRECTORY,
    },
    notation: {
      elements,
    },
    display,
    player: {
      enablePlayer: true,
      enableCursor: true,
      enableUserInteraction: false,
      soundFont: SOUNDFONT_URL,
      scrollElement,
      outputMode: 1, // WebAudioScriptProcessor — avoids audio worklet (incompatible with Vite dev)
    },
  };
}
