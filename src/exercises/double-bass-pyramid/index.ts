import type { ExerciseConfig, ExerciseDefinition, FieldConstraints } from '../types';
import { metadata } from './metadata';
import { configFields, defaultConfig } from './config';
import { generateAlphaTex } from './generator';

const PYRAMID_MIN = 1;
const PYRAMID_MAX = 8;

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

function normalizeConfig(config: ExerciseConfig): ExerciseConfig {
  const startRaw = Number(config.start);
  const endRaw = Number(config.end);
  const start = clamp(Number.isFinite(startRaw) ? startRaw : 1, PYRAMID_MIN, PYRAMID_MAX);
  const endCandidate = Number.isFinite(endRaw) ? endRaw : start;
  const end = clamp(Math.max(endCandidate, start), start, PYRAMID_MAX);
  return { ...config, start, end };
}

function getFieldConstraints(
  fieldKey: string,
  config: ExerciseConfig,
): FieldConstraints | undefined {
  if (fieldKey === 'end') {
    const startRaw = Number(config.start);
    const start = clamp(Number.isFinite(startRaw) ? startRaw : PYRAMID_MIN, PYRAMID_MIN, PYRAMID_MAX);
    return { min: start };
  }
  return undefined;
}

function isRandomMode(config: ExerciseConfig): boolean {
  return Boolean(config.random);
}

function handleAction(
  actionKey: string,
  config: ExerciseConfig,
): Partial<ExerciseConfig> | null {
  if (actionKey !== 'randomize') return null;
  return { random: !isRandomMode(config) };
}

function getActionLabel(actionKey: string, config: ExerciseConfig): string | undefined {
  if (actionKey !== 'randomize') return undefined;
  return isRandomMode(config) ? 'Pyramid' : 'Randomize';
}

export const doubleBassPyramid: ExerciseDefinition = {
  ...metadata,
  configFields,
  defaultConfig,
  generateAlphaTex,
  normalizeConfig,
  getFieldConstraints,
  handleAction,
  getActionLabel,
};
