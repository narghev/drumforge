import type { ExerciseConfig, ExerciseDefinition, FieldConstraints } from '../types';
import { metadata } from './metadata';
import { configFields, defaultConfig } from './config';
import { generateAlphaTex } from './generator';

function maxGroupSize(subdivision: unknown): number {
  return subdivision === '8' ? 8 : 16;
}

function normalizeConfig(config: ExerciseConfig): ExerciseConfig {
  const max = maxGroupSize(config.subdivision);
  const groupSize = Number(config.groupSize);
  if (Number.isFinite(groupSize) && groupSize > max) {
    return { ...config, groupSize: max };
  }
  return config;
}

function getFieldConstraints(
  fieldKey: string,
  config: ExerciseConfig,
): FieldConstraints | undefined {
  if (fieldKey === 'groupSize') return { max: maxGroupSize(config.subdivision) };
  return undefined;
}

export const accentGroupings: ExerciseDefinition = {
  ...metadata,
  configFields,
  defaultConfig,
  generateAlphaTex,
  normalizeConfig,
  getFieldConstraints,
};
