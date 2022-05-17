import {
  AspectRatio,
  AspectRatioProps,
  Center,
  Icon,
  PropsOf,
  SimpleGrid,
  Spinner,
  chakra,
  useBreakpointValue,
} from "@chakra-ui/react";
import useIntersectionObserver from "@react-hook/intersection-observer";
import { useTrack } from "hooks/analytics/useTrack";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { IconType } from "react-icons";
import { SiJavascript, SiPython, SiReact } from "react-icons/si";
import {
  Button,
  ButtonProps,
  LinkButton,
  PossibleButtonSize,
} from "tw-components";

export type CodeOptions = "typescript" | "react" | "python";

const LOGO_OPTIONS: Record<CodeOptions, { fill: string; icon: IconType }> = {
  typescript: {
    icon: SiJavascript,
    fill: "yellow",
  },
  react: {
    icon: SiReact,
    fill: "#61dafb",
  },
  python: {
    icon: SiPython,
    fill: "#3e7aac",
  },
};

interface CodeOptionButtonProps extends ButtonProps {
  language: CodeOptions;
  activeLanguage: CodeOptions;
  setActiveLanguage: Dispatch<SetStateAction<CodeOptions>>;
}
const CodeOptionButton: React.FC<CodeOptionButtonProps> = ({
  children,

  language,
  setActiveLanguage,
  activeLanguage,
  ...rest
}) => {
  const { trackEvent } = useTrack();

  const logo = LOGO_OPTIONS[language];
  const size = useBreakpointValue(
    { base: "sm", md: "md" },
    "md",
  ) as PossibleButtonSize;

  return (
    <Button
      leftIcon={<Icon as={logo.icon} fill={logo.fill} />}
      borderRadius="md"
      variant="solid"
      colorScheme="blackAlpha"
      bg="#1E1E24"
      borderWidth="1px"
      size={size}
      borderColor={
        language === activeLanguage ? "#0098EE" : "rgba(255, 255, 255, 0.1)"
      }
      _hover={{ borderColor: "#0098EE" }}
      _active={{
        borderColor: language === activeLanguage ? "#0098EE" : undefined,
      }}
      onClick={() => {
        trackEvent({
          category: "code-selector",
          action: "switch-language",
          label: language,
        });
        flushSync(() => {
          setActiveLanguage(language);
        });
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export const CodeSelector: React.FC = () => {
  const [activeLanguage, setActiveLanguage] =
    useState<CodeOptions>("typescript");
  const { trackEvent } = useTrack();
  return (
    <>
      <SimpleGrid
        gap={{ base: 2, md: 3 }}
        columns={3}
        justifyContent={{ base: "space-between", md: "center" }}
      >
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="typescript"
        >
          JavaScript
        </CodeOptionButton>
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="python"
        >
          Python
        </CodeOptionButton>
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="react"
        >
          React
        </CodeOptionButton>
      </SimpleGrid>
      <LazyLoadedIframe
        aspectRatioProps={{
          ratio: { base: 9 / 16, md: 16 / 9 },
          w: "full",
          borderRadius: "xl",
          overflow: "hidden",
          border: "2px solid",
          borderColor: "#4953AF",
          bg: "#1C2333",
        }}
        frameBorder="0"
        width="1200px"
        height="800px"
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
        src={`https://replit.com/@thirdweb-dev/${activeLanguage}-sdk?lite=true`}
      />
      <LinkButton
        bg="white"
        color="#000"
        variant="solid"
        borderRadius="md"
        _hover={{
          bg: "whiteAlpha.800",
        }}
        w="full"
        maxW="300px"
        href={`https://portal.thirdweb.com/${activeLanguage}`}
        isExternal
        p={6}
        onClick={() =>
          trackEvent({
            category: "code-selector",
            action: "click-documentation",
            label: activeLanguage,
          })
        }
      >
        See documentation
      </LinkButton>
    </>
  );
};

const ChakraIframe = chakra("iframe");

type LazyLoadedIframeProps = PropsOf<typeof ChakraIframe> & {
  aspectRatioProps?: AspectRatioProps;
};

export const LazyLoadedIframe: React.FC<LazyLoadedIframeProps> = ({
  aspectRatioProps,
  ...iframeProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const { isIntersecting } = useIntersectionObserver(containerRef);
  if (isIntersecting) {
    lockRef.current = true;
  }
  return (
    <AspectRatio {...aspectRatioProps} ref={containerRef}>
      {lockRef.current ? (
        <ChakraIframe {...iframeProps} />
      ) : (
        <Center>
          <Spinner color="heading" />
        </Center>
      )}
    </AspectRatio>
  );
};
