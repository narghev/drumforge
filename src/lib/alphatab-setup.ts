const ALPHATAB_BASE = '/alphatab';
const FONT_DIRECTORY = `${ALPHATAB_BASE}/font/`;
const SOUNDFONT_URL = `${ALPHATAB_BASE}/soundfont/sonivox.sf2`;

export function buildSettings(scrollElement: HTMLElement) {
  return {
    core: {
      fontDirectory: FONT_DIRECTORY,
    },
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
