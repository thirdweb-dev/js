export type Environment = "javascript" | "typescript";

export interface SupportedEnvironment {
  environment: Environment;
  title: string;
  icon: React.FC;
}

export type CodeSnippet = Partial<Record<Environment, string>>;

export interface SnippetSchema {
  name: string;
  summary: string | null;
  remarks?: string | null;
  examples: CodeSnippet;
  reference: string;
  methods?: SnippetSchema[];
  properties?: SnippetSchema[];
}

export interface SnippetApiResponse {
  [key: string]: SnippetSchema;
}
