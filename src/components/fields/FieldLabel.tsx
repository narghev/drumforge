import type { ConfigField } from '../../exercises/types';

interface Props {
  field: ConfigField;
}

/**
 * Small uppercase caption rendered above number/select inputs. Greys out
 * for disabled fields and adds a "(soon)" hint when applicable. Uses the
 * field's description as a `title` tooltip when one is provided.
 */
export function FieldLabel({ field }: Props) {
  return (
    <label
      htmlFor={`field-${field.key}`}
      title={field.description}
      className={`text-[10px] font-medium uppercase tracking-wider ${
        field.enabled
          ? 'text-gray-500 dark:text-gray-400'
          : 'text-gray-400 dark:text-gray-500'
      } ${field.description ? 'cursor-help' : ''}`}
    >
      {field.label}
      {!field.enabled && (
        <span className="ml-1 text-gray-300 dark:text-gray-600">(soon)</span>
      )}
    </label>
  );
}
