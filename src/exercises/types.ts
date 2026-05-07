export type ConfigFieldType = 'number' | 'range' | 'boolean' | 'select' | 'action';

export interface SelectOption {
  value: string;
  label: string;
}

export interface ConfigField {
  key: string;
  label: string;
  type: ConfigFieldType;
  default: unknown;
  min?: number;
  max?: number;
  step?: number;
  options?: SelectOption[];
  enabled: boolean;
  description?: string;
  group?: string;
}

export type ExerciseConfig = Record<string, unknown>;

export interface FieldConstraints {
  min?: number;
  max?: number;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  description: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  configFields: ConfigField[];
  defaultConfig: ExerciseConfig;
  generateAlphaTex: (config: ExerciseConfig) => string;
  /**
   * Coerce a config into a logically valid state. Runs after URL hydration
   * and after every UI update — useful for cross-field constraints like
   * "end >= start" that can't be expressed in a single ConfigField.
   */
  normalizeConfig?: (config: ExerciseConfig) => ExerciseConfig;
  /**
   * Compute UI input constraints (e.g. min/max) for a field given the current
   * config. Lets one field's allowed range depend on another (e.g. end's min
   * tracks current start). Return undefined or an empty object to fall back to
   * the static field.min / field.max.
   */
  getFieldConstraints?: (fieldKey: string, config: ExerciseConfig) => FieldConstraints | undefined;
}
