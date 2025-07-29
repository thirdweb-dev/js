"use client";
import type React from "react";
import { type Dispatch, type SetStateAction, useMemo } from "react";
import { CodeClient } from "@/components/ui/code/code.client";
import { TabButtons } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type CodeEnvironment =
  | "javascript"
  | "typescript"
  | "react"
  | "react-native"
  | "unity";

type SupportedEnvironment = {
  environment: CodeEnvironment;
  title: string;
};

type CodeSnippet = Partial<Record<CodeEnvironment, string>>;

const Environments: SupportedEnvironment[] = [
  {
    environment: "javascript",
    title: "JavaScript",
  },
  {
    environment: "typescript",
    title: "TypeScript",
  },
  {
    environment: "react",
    title: "React",
  },
  {
    environment: "react-native",
    title: "React Native",
  },
  {
    environment: "unity",
    title: "Unity",
  },
];

interface CodeSegmentProps {
  snippet: CodeSnippet;
  environment: CodeEnvironment;
  setEnvironment:
    | Dispatch<SetStateAction<CodeEnvironment>>
    | ((language: CodeEnvironment) => void);
  isInstallCommand?: boolean;
  hideTabs?: boolean;
  onlyTabs?: boolean;
  codeContainerClassName?: string;
}

export const CodeSegment: React.FC<CodeSegmentProps> = ({
  snippet,
  environment,
  setEnvironment,
  isInstallCommand,
  hideTabs,
  onlyTabs,
  codeContainerClassName,
}) => {
  const activeEnvironment: CodeEnvironment = useMemo(() => {
    return (
      snippet[environment] ? environment : Object.keys(snippet)[0]
    ) as CodeEnvironment;
  }, [environment, snippet]);

  const activeSnippet = useMemo(() => {
    return snippet[activeEnvironment];
  }, [activeEnvironment, snippet]);

  const lines = useMemo(
    () => (activeSnippet ? activeSnippet.split("\n") : []),
    [activeSnippet],
  );

  const code = lines.join("\n").trim();

  const environments = Environments.filter(
    (env) =>
      Object.keys(snippet).includes(env.environment) &&
      snippet[env.environment],
  );

  return (
    <div
      className={
        "flex flex-col overflow-hidden rounded-lg border border-border grow"
      }
    >
      {!hideTabs && (
        <TabButtons
          hideBottomLine={!!onlyTabs}
          tabClassName="text-sm gap-2 !text-sm"
          tabContainerClassName="px-3 pt-1.5 gap-0.5"
          tabIconClassName="size-4"
          tabs={environments.map((env) => ({
            isActive: activeEnvironment === env.environment,
            label: env.title,
            name: env.title,
            onClick: () => setEnvironment(env.environment),
          }))}
        />
      )}

      {onlyTabs ? null : (
        <CodeClient
          className={cn(
            "rounded-none border-none grow",
            codeContainerClassName,
          )}
          scrollableContainerClassName="h-full"
          code={code}
          lang={
            isInstallCommand
              ? activeEnvironment === "react-native"
                ? "tsx"
                : "bash"
              : activeEnvironment === "react" ||
                  activeEnvironment === "react-native"
                ? "tsx"
                : activeEnvironment === "unity"
                  ? "cpp"
                  : activeEnvironment
          }
        />
      )}
    </div>
  );
};
