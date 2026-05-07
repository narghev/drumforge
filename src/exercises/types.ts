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

export interface ExerciseDefinition {
  id: string;
  name: string;
  description: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  configFields: ConfigField[];
  defaultConfig: ExerciseConfig;
  generateAlphaTex: (config: ExerciseConfig) => string;
}
