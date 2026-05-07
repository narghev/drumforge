import type { ConfigField as ConfigFieldType, ExerciseConfig } from '../exercises/types';

interface Props {
  field: ConfigFieldType;
  value: ExerciseConfig[string];
  onChange: (value: unknown) => void;
  effectiveMin?: number;
  effectiveMax?: number;
  /** For action fields: optional label override (e.g. toggling
   * "Randomize" ⇄ "Pyramid" based on current state). */
  actionLabel?: string;
}

export function ConfigField({ field, value, onChange, effectiveMin, effectiveMax, actionLabel }: Props) {
  const baseInput =
    'w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 transition focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-accent-400 dark:disabled:bg-gray-900 dark:disabled:text-gray-500';

  const min = effectiveMin ?? field.min;
  const max = effectiveMax ?? field.max;

  const labelText = (
    <span
      title={field.description}
      className={`text-[10px] font-medium uppercase tracking-wider ${
        field.enabled
          ? 'text-gray-500 dark:text-gray-400'
          : 'text-gray-400 dark:text-gray-500'
      } ${field.description ? 'cursor-help' : ''}`}
    >
      {field.label}
      {!field.enabled && <span className="ml-1 text-gray-300 dark:text-gray-600">(soon)</span>}
    </span>
  );

  if (field.type === 'number' || field.type === 'range') {
    return (
      <div className="flex w-20 flex-col gap-1">
        <label htmlFor={`field-${field.key}`}>{labelText}</label>
        <input
          id={`field-${field.key}`}
          type={field.type === 'range' ? 'range' : 'number'}
          value={typeof value === 'number' ? value : Number(field.default)}
          min={min}
          max={max}
          step={field.step ?? 1}
          disabled={!field.enabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className={baseInput}
        />
      </div>
    );
  }

  if (field.type === 'boolean') {
    return (
      <label
        htmlFor={`field-${field.key}`}
        className={`flex items-center gap-2 self-end pb-2 text-sm ${
          field.enabled
            ? 'text-gray-800 dark:text-gray-200'
            : 'text-gray-400 dark:text-gray-500'
        } ${field.description ? 'cursor-help' : 'cursor-pointer'}`}
        title={field.description}
      >
        <input
          id={`field-${field.key}`}
          type="checkbox"
          checked={Boolean(value)}
          disabled={!field.enabled}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-950"
        />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === 'select' && field.options) {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={`field-${field.key}`}>{labelText}</label>
        <select
          id={`field-${field.key}`}
          value={typeof value === 'string' ? value : String(field.default)}
          disabled={!field.enabled}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'action') {
    return (
      <button
        type="button"
        disabled={!field.enabled}
        onClick={() => onChange(true)}
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

  return null;
}
