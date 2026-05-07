import type { ConfigField as ConfigFieldType, ExerciseConfig } from '../exercises/types';

interface Props {
  field: ConfigFieldType;
  value: ExerciseConfig[string];
  onChange: (value: unknown) => void;
}

export function ConfigField({ field, value, onChange }: Props) {
  const baseInput =
    'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={`field-${field.key}`}
          className={`text-xs font-medium uppercase tracking-wide ${field.enabled ? 'text-gray-700' : 'text-gray-400'}`}
        >
          {field.label}
        </label>
        {!field.enabled && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
            Coming soon
          </span>
        )}
      </div>

      {(field.type === 'number' || field.type === 'range') && (
        <input
          id={`field-${field.key}`}
          type={field.type === 'range' ? 'range' : 'number'}
          value={typeof value === 'number' ? value : Number(field.default)}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          disabled={!field.enabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className={baseInput}
        />
      )}

      {field.type === 'boolean' && (
        <label
          htmlFor={`field-${field.key}`}
          className={`flex items-center gap-2 text-sm ${field.enabled ? 'text-gray-800' : 'text-gray-400'}`}
        >
          <input
            id={`field-${field.key}`}
            type="checkbox"
            checked={Boolean(value)}
            disabled={!field.enabled}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
          />
          <span>{Boolean(value) ? 'On' : 'Off'}</span>
        </label>
      )}

      {field.type === 'select' && field.options && (
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
      )}

      {field.type === 'action' && (
        <button
          type="button"
          disabled={!field.enabled}
          onClick={() => onChange(true)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {field.label}
        </button>
      )}

      {field.description && (
        <p className={`text-xs ${field.enabled ? 'text-gray-500' : 'text-gray-400'}`}>
          {field.description}
        </p>
      )}
    </div>
  );
}
