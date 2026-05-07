import { useEffect, useRef, useState } from 'react';

const RESET_MS = 2000;

/**
 * Top-right share button for the exercise page. On click it copies the
 * current URL (with all query parameters intact) to the clipboard, so a
 * friend opening the link sees the exact same config — same BPM, same
 * subdivisions, same metronome state, etc.
 *
 * The button briefly swaps its icon + label to "Copied!" for confirmation,
 * then reverts after a couple of seconds. Uses the modern `navigator.clipboard`
 * API which works on HTTPS and on `localhost` (treated as a secure context).
 */
export function ShareButton() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), RESET_MS);
    } catch (err) {
      console.error('[Drumforge] Failed to copy URL to clipboard', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Copy link to this exercise"
      title="Copy link to this exercise"
      className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-accent-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-accent-400 dark:hover:text-gray-100"
    >
      {copied ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span>Share</span>
        </>
      )}
    </button>
  );
}
