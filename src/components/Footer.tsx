const REPO_URL = 'https://github.com/narghev/drumforge';
const PROFILE_URL = 'https://github.com/narghev';

/**
 * Minimal site footer — one short attribution line plus a GitHub icon
 * link. Pinned to the bottom of the page via `mt-auto` (works as long as
 * the parent is `flex flex-col` with at least `min-h-screen`).
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 pt-6 pb-8 dark:border-gray-800">
      <div className="flex flex-col items-start gap-3 text-sm text-gray-600 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Built by{' '}
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-700 transition hover:text-accent-600 hover:underline dark:text-gray-300 dark:hover:text-accent-400"
          >
            narghev
          </a>
        </p>
        <div className="flex items-center gap-2">
          <span>Drumforge is open-source</span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            title="View source on GitHub"
            className="text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-1.96c-3.2.7-3.87-1.54-3.87-1.54-.52-1.34-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
