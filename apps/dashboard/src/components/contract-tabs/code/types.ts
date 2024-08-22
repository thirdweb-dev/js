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
