import type { ConfigField, ExerciseConfig } from '../../exercises/types';
import { FieldLabel } from './FieldLabel';

interface Props {
  field: ConfigField;
  value: ExerciseConfig[string];
  onChange: (value: number) => void;
  effectiveMin?: number;
  effectiveMax?: number;
}

/**
 * Range / slider input — wider footprint than NumberField, with the current
 * numeric value rendered next to the label so users can see what they've
 * picked. Uses the browser-native `accent-color` (via inline style) to tint
 * the thumb and filled portion in our brand yellow.
 */
export function SliderField({ field, value, onChange, effectiveMin, effectiveMax }: Props) {
  const min = effectiveMin ?? field.min;
  const max = effectiveMax ?? field.max;
  const current = typeof value === 'number' ? value : Number(field.default);

  return (
    <div className="flex w-40 flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <FieldLabel field={field} />
        <span
          className={`font-mono text-sm tabular-nums ${
            field.enabled
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          {current}
        </span>
      </div>
      <input
        id={`field-${field.key}`}
        type="range"
        value={current}
        min={min}
        max={max}
        step={field.step ?? 1}
        disabled={!field.enabled}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ accentColor: '#FFCA28' }}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800"
      />
    </div>
  );
}
