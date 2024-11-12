import { CodeClient } from "@/components/ui/code/code.client";
import { ButtonGroup, Flex, Icon } from "@chakra-ui/react";
import { JavaScriptIcon } from "components/icons/brand-icons/JavaScriptIcon";
import { ReactIcon } from "components/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "components/icons/brand-icons/TypeScriptIcon";
import { UnityIcon } from "components/icons/brand-icons/UnityIcon";
import { type Dispatch, type JSX, type SetStateAction, useMemo } from "react";
import { Button } from "tw-components";
import type { ComponentWithChildren } from "types/component-with-children";
import type {
  CodeEnvironment,
  CodeSnippet,
  SupportedEnvironment,
} from "./types";

const Environments: SupportedEnvironment[] = [
  {
    environment: "javascript",
    title: "JavaScript",
    icon: JavaScriptIcon,
    colorScheme: "yellow",
  },
  {
    environment: "typescript",
    title: "TypeScript",
    icon: TypeScriptIcon,
    colorScheme: "blue",
  },
  {
    environment: "react",
    title: "React",
    icon: ReactIcon,
    colorScheme: "purple",
  },
  {
    environment: "react-native",
    title: "React Native",
    icon: ReactIcon,
    colorScheme: "purple",
  },
  {
    environment: "unity",
    title: "Unity",
    icon: UnityIcon,
    colorScheme: "purple",
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
}

export const CodeSegment: React.FC<CodeSegmentProps> = ({
  snippet,
  environment,
  setEnvironment,
  isInstallCommand,
  hideTabs,
  onlyTabs,
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
    <div className="flex flex-col gap-2">
      {!hideTabs && (
        <Flex justify="space-between" align="flex-end">
          <Flex direction="column" gap={4}>
            <ButtonGroup
              isAttached
              size="sm"
              variant="outline"
              flexWrap="wrap"
              rowGap={2}
            >
              {environments.map((env) => (
                <SupportedEnvironmentButton
                  key={env.environment}
                  icon={<Icon as={env.icon} />}
                  active={activeEnvironment === env.environment}
                  onClick={() => setEnvironment(env.environment)}
                >
                  {env.title}
                </SupportedEnvironmentButton>
              ))}
            </ButtonGroup>
          </Flex>
        </Flex>
      )}

      {onlyTabs ? null : (
        <>
          <CodeClient
            code={code}
            loadingClassName="min-h-[450px]"
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
        </>
      )}
    </div>
  );
};

interface SupportedEnvironmentButtonProps {
  active: boolean;
  icon?: JSX.Element;
  isDisabled?: boolean;
  onClick: () => void;
}

const SupportedEnvironmentButton: ComponentWithChildren<
  SupportedEnvironmentButtonProps
> = ({ active, icon, onClick, children, isDisabled }) => {
  return (
    <Button
      variant={active ? "solid" : "outline"}
      onClick={onClick}
      leftIcon={icon}
      fill="red"
      isDisabled={isDisabled}
    >
      {children}
    </Button>
  );
};
