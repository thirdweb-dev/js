export type CodeEnvironment =
  | "javascript"
  | "typescript"
  | "web3button"
  | "react"
  | "python"
  | "go"
  | "unity";

export interface SupportedEnvironment {
  environment: CodeEnvironment;
  title: string;
  icon: React.FC;
  colorScheme: string;
}

export type CodeSnippet = Partial<Record<CodeEnvironment, string>>;

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
