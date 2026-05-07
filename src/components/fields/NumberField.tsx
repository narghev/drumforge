import type { ConfigField, ExerciseConfig } from '../../exercises/types';
import { FieldLabel } from './FieldLabel';
import { INPUT_CLASS } from './styles';

interface Props {
  field: ConfigField;
  value: ExerciseConfig[string];
  onChange: (value: number) => void;
  effectiveMin?: number;
  effectiveMax?: number;
}

/**
 * Compact number input. Width fixed at `w-16` (64px) — wide enough for
 * 1–3 digit values plus the browser's spinner buttons. For sliders, see
 * `SliderField`. `effectiveMin`/`effectiveMax` override the static
 * `field.min`/`field.max` for cross-field constraints (e.g. "end"
 * tracking the current "start").
 */
export function NumberField({ field, value, onChange, effectiveMin, effectiveMax }: Props) {
  const min = effectiveMin ?? field.min;
  const max = effectiveMax ?? field.max;

  return (
    <div className="flex w-16 flex-col gap-1">
      <FieldLabel field={field} />
      <input
        id={`field-${field.key}`}
        type="number"
        value={typeof value === 'number' ? value : Number(field.default)}
        min={min}
        max={max}
        step={field.step ?? 1}
        disabled={!field.enabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className={INPUT_CLASS}
      />
    </div>
  );
}
