import { useEffect } from 'react';

const DEFAULT_TITLE = 'Drumforge — Free Drum Exercises with Notation, BPM Control & Timer';

/**
 * Sets `document.title` for the lifetime of the calling component, then
 * restores the default app title on unmount. Helps both browser tabs and
 * any crawler that runs JS before snapshotting.
 */
export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    if (!title) {
      document.title = DEFAULT_TITLE;
      return;
    }
    document.title = title;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
}
