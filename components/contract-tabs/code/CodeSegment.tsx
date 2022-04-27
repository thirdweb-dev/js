import { CodeSnippet, Environment, SupportedEnvironment } from "./types";
import {
  Box,
  ButtonGroup,
  Flex,
  Heading,
  Icon,
  Stack,
  useClipboard,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { Button } from "components/buttons/Button";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ImCopy } from "react-icons/im";
import { SiJavascript, SiPython, SiReact, SiTypescript } from "react-icons/si";

interface ICodeSegment {
  snippet: CodeSnippet;
  environment: Environment;
  setEnvironment: Dispatch<SetStateAction<Environment>>;
}

const Environments: SupportedEnvironment[] = [
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
    environment: "react",
    title: "React",
    icon: SiReact,
    colorScheme: "purple",
  },
  {
    environment: "python",
    title: "Python",
    icon: SiPython,
    colorScheme: "blue",
  },
];

export const CodeSegment: React.FC<ICodeSegment> = ({
  snippet,
  environment,
  setEnvironment,
}) => {
  const activeEnvironment: Environment = useMemo(() => {
    return (
      snippet[environment] ? environment : Object.keys(snippet)[0]
    ) as Environment;
  }, [environment, snippet]);

  const activeSnippet = useMemo(() => {
    return snippet[activeEnvironment];
  }, [activeEnvironment, snippet]);

  const lines = useMemo(
    () => (activeSnippet ? activeSnippet.split("\n") : []),
    [activeSnippet],
  );

  const code = lines.join("\n");

  const { onCopy, hasCopied } = useClipboard(code);

  const environments = Environments.filter(
    (env) =>
      Object.keys(snippet).includes(env.environment) &&
      snippet[env.environment],
  );

  return (
    <Stack spacing={2}>
      <Flex justify="space-between" align="flex-end">
        <Flex direction="column" gap={4}>
          <Heading size="label.sm">Code Snippet</Heading>
          <ButtonGroup isAttached size="xs" variant="outline">
            {environments.map((env) => (
              <SupportedEnvironmentButton
                key={env.environment}
                icon={<Icon as={env.icon} />}
                active={activeEnvironment === env.environment}
                onClick={() => setEnvironment(env.environment)}
                colorScheme={env.colorScheme}
              >
                {env.title}
              </SupportedEnvironmentButton>
            ))}
          </ButtonGroup>
        </Flex>
        <Button
          size="xs"
          onClick={onCopy}
          variant="outline"
          leftIcon={<ImCopy />}
        >
          {hasCopied ? "Code copied" : "Copy code"}
        </Button>
      </Flex>

      {activeEnvironment === "react" && (
        <Box
          borderRadius="md"
          overflow="hidden"
          height={`${11 * 19 + 16}px`}
          w="100%"
        >
          <Editor
            theme="vs-dark"
            options={{
              padding: {
                top: 8,
                bottom: 8,
              },
              contextmenu: false,
              codeLens: false,
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: 0,
            }}
            value={`// Make sure to wrap your app in a <ThirdwebProvider>\nimport { ThirdwebProvider } from "@thirdweb/react";\n\nexport default function App() {\n  return (\n    <ThirdwebProvider>\n      <AppContent />\n    </ThirdwebProvider>\n  );\n}\n`}
            language="javascript"
          />
        </Box>
      )}

      <Box
        borderRadius="md"
        overflow="hidden"
        height={`${lines.length * 19 + 16}px`}
        w="100%"
      >
        <Editor
          theme="vs-dark"
          options={{
            padding: {
              top: 8,
              bottom: 8,
            },
            contextmenu: false,
            codeLens: false,
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: 0,
          }}
          value={
            activeEnvironment === "python"
              ? code.replaceAll("\n        ", "\n")
              : code
          }
          language={activeEnvironment === "python" ? "python" : "javascript"}
        />
      </Box>
    </Stack>
  );
};

interface ISupportedEnvironment {
  active: boolean;
  icon?: JSX.Element;
  isDisabled?: boolean;
  onClick: () => void;
  colorScheme?: string;
}

const SupportedEnvironmentButton: React.FC<ISupportedEnvironment> = ({
  active,
  icon,
  colorScheme,
  onClick,
  children,
  isDisabled,
}) => {
  return (
    <Button
      colorScheme={active ? colorScheme : undefined}
      variant={active ? "solid" : "outline"}
      onClick={onClick}
      leftIcon={icon}
      isDisabled={isDisabled}
    >
      {children}
    </Button>
  );
};
