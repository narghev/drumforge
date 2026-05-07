import type { ConfigField } from '../../exercises/types';

interface Props {
  field: ConfigField;
  onClick: () => void;
  /** Optional label override (e.g. toggling "Randomize" ⇄ "Pyramid"). */
  actionLabel?: string;
}

/**
 * Plain bordered button used for action-typed fields. Clicking calls
 * `onClick`; the parent's `onChange({...})` decides what state to write.
 */
export function ActionField({ field, onClick, actionLabel }: Props) {
  return (
    <button
      type="button"
      disabled={!field.enabled}
      onClick={onClick}
      title={field.description}
      className="self-end rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-accent-400 hover:bg-accent-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:border-accent-400 dark:hover:bg-accent-400/10"
    >
      {actionLabel ?? field.label}
      {!field.enabled && (
        <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">(soon)</span>
      )}
    </button>
  );
}
