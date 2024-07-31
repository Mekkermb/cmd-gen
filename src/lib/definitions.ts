export type ParameterType = "text" | "range" | "select";

export interface Parameter {
  key: string;
  label: string;
  type: "text" | "range" | "select";
  defaultValue: string | number;
  min?: number;
  max?: number;
  options?: string[];
  appendExtension?: string;
}

export interface Encoder {
  id: string;
  name: string;
  executable?: string;
  parameters: Parameter[];
}
