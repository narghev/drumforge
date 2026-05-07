import type { ConfigField as ConfigFieldType, ExerciseConfig, ExerciseDefinition } from '../exercises/types';
import { ConfigField } from './ConfigField';

interface Props {
  exercise: ExerciseDefinition;
  config: ExerciseConfig;
  onChange: (updates: Partial<ExerciseConfig>) => void;
}

function groupFields(fields: ConfigFieldType[]): Map<string, ConfigFieldType[]> {
  const groups = new Map<string, ConfigFieldType[]>();
  for (const field of fields) {
    const key = field.group ?? 'Settings';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(field);
  }
  return groups;
}

export function ConfigPanel({ exercise, config, onChange }: Props) {
  const groups = groupFields(exercise.configFields);

  return (
    <aside className="flex w-full flex-col gap-6 rounded-lg border border-gray-200 bg-white p-5 lg:w-72">
      {Array.from(groups.entries()).map(([groupName, fields]) => (
        <section key={groupName} className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-900">{groupName}</h2>
          {fields.map((field) => {
            const constraints = exercise.getFieldConstraints?.(field.key, config);
            return (
              <ConfigField
                key={field.key}
                field={field}
                value={config[field.key]}
                effectiveMin={constraints?.min}
                effectiveMax={constraints?.max}
                onChange={(value) => onChange({ [field.key]: value })}
              />
            );
          })}
        </section>
      ))}
    </aside>
  );
}
