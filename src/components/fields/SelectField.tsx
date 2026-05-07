import type { ConfigField, ExerciseConfig } from '../../exercises/types';
import { FieldLabel } from './FieldLabel';
import { INPUT_CLASS } from './styles';

interface Props {
  field: ConfigField;
  value: ExerciseConfig[string];
  onChange: (value: string) => void;
}

/**
 * Dropdown rendered from `field.options`. Stacks the small label above
 * the select, matching `NumberField`'s layout so they align horizontally.
 */
export function SelectField({ field, value, onChange }: Props) {
  if (!field.options) return null;

  return (
    <div className="flex flex-col gap-1">
      <FieldLabel field={field} />
      <select
        id={`field-${field.key}`}
        value={typeof value === 'string' ? value : String(field.default)}
        disabled={!field.enabled}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLASS}
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
