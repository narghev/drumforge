import type { ConfigField, ExerciseConfig } from '../../exercises/types';

interface Props {
  field: ConfigField;
  value: ExerciseConfig[string];
  onChange: (value: boolean) => void;
}

/**
 * Inline checkbox + label. The parent `<section>` uses `items-end`, so the
 * checkbox row aligns with the baseline of the group label and the bottoms
 * of the number/slider inputs in the same row.
 *
 * The native `<input type="checkbox">` is tinted via `accent-color` (inline
 * style) so the checked state matches our brand yellow in both light and
 * dark themes — this is the same approach we use for the BPM slider thumb.
 */
export function BooleanField({ field, value, onChange }: Props) {
  return (
    <label
      htmlFor={`field-${field.key}`}
      className={`flex items-center gap-2 text-sm ${
        field.enabled ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'
      } ${field.description ? 'cursor-help' : 'cursor-pointer'}`}
      title={field.description}
    >
      <input
        id={`field-${field.key}`}
        type="checkbox"
        checked={Boolean(value)}
        disabled={!field.enabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{ accentColor: '#FFCA28' }}
        className="h-4 w-4 cursor-pointer disabled:cursor-not-allowed"
      />
      <span>{field.label}</span>
    </label>
  );
}
