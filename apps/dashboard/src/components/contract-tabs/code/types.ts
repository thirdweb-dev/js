export type CodeEnvironment =
  | "javascript"
  | "typescript"
  | "react"
  | "react-native"
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
    // biome-ignore lint/suspicious/noExplicitAny: FIXME
    [key: string]: any;
  };
  methods?: SnippetSchema[];
  properties?: SnippetSchema[];
}

export interface SnippetApiResponse {
  [key: string]: SnippetSchema;
}
