export type Environment =
  | "javascript"
  | "typescript"
  | "web3button"
  | "react"
  | "python"
  | "go";

export interface SupportedEnvironment {
  environment: Environment;
  title: string;
  icon: React.FC;
  colorScheme: string;
}

export type CodeSnippet = Partial<Record<Environment, string>>;

export interface SnippetSchema {
  name: string;
  summary: string | null;
  remarks?: string | null;
  examples: CodeSnippet;
  reference: {
    [key: string]: any;
  };
  methods?: SnippetSchema[];
  properties?: SnippetSchema[];
}

export interface SnippetApiResponse {
  [key: string]: SnippetSchema;
}
