import type { ExerciseDefinition } from '../types';
import { metadata } from './metadata';
import { configFields, defaultConfig } from './config';
import { generateAlphaTex } from './generator';

export const doubleBassPyramid: ExerciseDefinition = {
  ...metadata,
  configFields,
  defaultConfig,
  generateAlphaTex,
};
