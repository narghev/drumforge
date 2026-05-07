import type { ConfigField as ConfigFieldType, ExerciseConfig } from '../exercises/types';
import { ActionField, BooleanField, NumberField, SelectField, SliderField } from './fields';

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

/**
 * Thin router that picks the right per-type component from `./fields`.
 * Keeping this layer means ConfigPanel (and any other consumer) stays
 * generic — it doesn't need to know about specific input types.
 */
export function ConfigField({
  field,
  value,
  onChange,
  effectiveMin,
  effectiveMax,
  actionLabel,
}: Props) {
  switch (field.type) {
    case 'number':
      return (
        <NumberField
          field={field}
          value={value}
          onChange={onChange}
          effectiveMin={effectiveMin}
          effectiveMax={effectiveMax}
        />
      );
    case 'range':
      return (
        <SliderField
          field={field}
          value={value}
          onChange={onChange}
          effectiveMin={effectiveMin}
          effectiveMax={effectiveMax}
        />
      );
    case 'boolean':
      return <BooleanField field={field} value={value} onChange={onChange} />;
    case 'select':
      return <SelectField field={field} value={value} onChange={onChange} />;
    case 'action':
      return <ActionField field={field} onClick={() => onChange(true)} actionLabel={actionLabel} />;
    default:
      return null;
  }
}
