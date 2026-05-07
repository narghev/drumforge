import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ConfigField, ExerciseConfig, ExerciseDefinition } from '../exercises/types';

function coerce(field: ConfigField, raw: string): unknown | undefined {
  switch (field.type) {
    case 'number':
    case 'range': {
      const n = Number(raw);
      if (Number.isNaN(n)) return undefined;
      if (field.min !== undefined && n < field.min) return undefined;
      if (field.max !== undefined && n > field.max) return undefined;
      return n;
    }
    case 'boolean': {
      if (raw === 'true') return true;
      if (raw === 'false') return false;
      return undefined;
    }
    case 'select': {
      if (!field.options) return undefined;
      return field.options.some((o) => o.value === raw) ? raw : undefined;
    }
    case 'action':
      return undefined;
    default:
      return undefined;
  }
}

function serialize(field: ConfigField, value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (field.type === 'action') return undefined;
  if (field.type === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

function buildConfig(
  exercise: ExerciseDefinition,
  params: URLSearchParams,
): ExerciseConfig {
  const config: ExerciseConfig = { ...exercise.defaultConfig };
  for (const field of exercise.configFields) {
    const raw = params.get(field.key);
    if (raw === null) continue;
    const coerced = coerce(field, raw);
    if (coerced === undefined) {
      console.warn(
        `[Drumforge] Invalid query param ${field.key}="${raw}" for exercise "${exercise.id}" — using default.`,
      );
      continue;
    }
    config[field.key] = coerced;
  }
  return exercise.normalizeConfig ? exercise.normalizeConfig(config) : config;
}

export function useExerciseConfig(
  exercise: ExerciseDefinition,
): [ExerciseConfig, (updates: Partial<ExerciseConfig>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const config = useMemo(
    () => buildConfig(exercise, searchParams),
    [exercise, searchParams],
  );

  const setConfig = useCallback(
    (updates: Partial<ExerciseConfig>) => {
      setSearchParams(
        (prev) => {
          const current = buildConfig(exercise, prev);
          const merged: ExerciseConfig = { ...current, ...updates };
          const normalized = exercise.normalizeConfig
            ? exercise.normalizeConfig(merged)
            : merged;
          const next = new URLSearchParams(prev);
          for (const field of exercise.configFields) {
            const value = normalized[field.key];
            const isDefault =
              JSON.stringify(value) === JSON.stringify(field.default);
            const serialized = isDefault ? undefined : serialize(field, value);
            if (serialized === undefined) {
              next.delete(field.key);
            } else {
              next.set(field.key, serialized);
            }
          }
          return next;
        },
        { replace: true },
      );
    },
    [exercise, setSearchParams],
  );

  return [config, setConfig];
}
