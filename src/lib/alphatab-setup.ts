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

export function buildSettings(scrollElement: HTMLElement) {
  const elements = new Map<NotationElement, boolean>();
  for (const el of HIDDEN_ELEMENTS) elements.set(el, false);

  return {
    core: {
      fontDirectory: FONT_DIRECTORY,
    },
    notation: {
      elements,
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
