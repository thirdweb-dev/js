import { CodeEnvironment, CodeSnippet, SupportedEnvironment } from "./types";
import { ButtonGroup, Flex, Icon, Stack } from "@chakra-ui/react";
import { SiGo } from "@react-icons/all-files/si/SiGo";
import { SiJavascript } from "@react-icons/all-files/si/SiJavascript";
import { SiPython } from "@react-icons/all-files/si/SiPython";
import { SiReact } from "@react-icons/all-files/si/SiReact";
import { SiTypescript } from "@react-icons/all-files/si/SiTypescript";
import { SiUnity } from "@react-icons/all-files/si/SiUnity";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Button, CodeBlock, Text, TrackedLink } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface ICodeSegment {
  snippet: CodeSnippet;
  environment: CodeEnvironment;
  setEnvironment: Dispatch<SetStateAction<CodeEnvironment>>;
  isInstallCommand?: boolean;
  hideTabs?: boolean;
}

const Environments: SupportedEnvironment[] = [
  {
    environment: "react",
    title: "React",
    icon: SiReact,
    colorScheme: "purple",
  },
  {
    environment: "web3button",
    title: "Web3Button",
    icon: SiReact,
    colorScheme: "purple",
  },
  {
    environment: "javascript",
    title: "JavaScript",
    icon: SiJavascript,
    colorScheme: "yellow",
  },
  {
    environment: "typescript",
    title: "TypeScript",
    icon: SiTypescript,
    colorScheme: "blue",
  },
  {
    environment: "python",
    title: "Python",
    icon: SiPython,
    colorScheme: "blue",
  },
  {
    environment: "go",
    title: "Go",
    icon: SiGo,
    colorScheme: "blue",
  },
  {
    environment: "unity",
    title: "Unity",
    icon: SiUnity,
    colorScheme: "purple",
  },
];

export const CodeSegment: React.FC<ICodeSegment> = ({
  snippet,
  environment,
  setEnvironment,
  isInstallCommand,
  hideTabs,
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
    <Stack spacing={2}>
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

      <CodeBlock
        code={code}
        language={
          isInstallCommand
            ? "bash"
            : activeEnvironment === "react" ||
              activeEnvironment === "web3button"
            ? "jsx"
            : activeEnvironment === "unity"
            ? "cpp"
            : activeEnvironment
        }
      />
      {activeEnvironment === "web3button" && (
        <Text>
          <TrackedLink
            href="https://portal.thirdweb.com/ui-components/web3button"
            isExternal
            category="code-tab"
            label="web3button"
          >
            Read the full documentation on Web3Button
          </TrackedLink>
          .
        </Text>
      )}
    </Stack>
  );
};

interface ISupportedEnvironment {
  active: boolean;
  icon?: JSX.Element;
  isDisabled?: boolean;
  onClick: () => void;
}

const SupportedEnvironmentButton: ComponentWithChildren<
  ISupportedEnvironment
> = ({ active, icon, onClick, children, isDisabled }) => {
  return (
    <Button
      variant={active ? "solid" : "outline"}
      onClick={onClick}
      leftIcon={icon}
      fill={"red"}
      isDisabled={isDisabled}
    >
      {children}
    </Button>
  );
};
