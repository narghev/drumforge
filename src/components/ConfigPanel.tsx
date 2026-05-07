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
    if (field.hidden) continue;
    const key = field.group ?? 'Settings';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(field);
  }
  return groups;
}

export function ConfigPanel({ exercise, config, onChange }: Props) {
  const groups = groupFields(exercise.configFields);
  const groupArray = Array.from(groups.entries());

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-5 py-3 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
        {groupArray.map(([groupName, fields], i) => (
          <section
            key={groupName}
            className={`flex items-end gap-3 ${
              i < groupArray.length - 1
                ? 'lg:border-r lg:border-gray-200 lg:pr-8 dark:lg:border-gray-800'
                : ''
            }`}
          >
            <h2 className="self-end text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {groupName}
            </h2>
            <div className="flex flex-wrap items-end gap-3">
              {fields.map((field) => {
                const constraints = exercise.getFieldConstraints?.(field.key, config);
                const dynamicLabel =
                  field.type === 'action'
                    ? exercise.getActionLabel?.(field.key, config)
                    : undefined;
                return (
                  <ConfigField
                    key={field.key}
                    field={field}
                    value={config[field.key]}
                    effectiveMin={constraints?.min}
                    effectiveMax={constraints?.max}
                    actionLabel={dynamicLabel}
                    onChange={(value) => {
                      if (field.type === 'action' && value === true && exercise.handleAction) {
                        const updates = exercise.handleAction(field.key, config);
                        if (updates) onChange(updates);
                        return;
                      }
                      onChange({ [field.key]: value });
                    }}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
