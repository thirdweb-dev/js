import {
  AspectRatio,
  AspectRatioProps,
  Box,
  Center,
  Flex,
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
import {
  SiGo,
  SiJavascript,
  SiPython,
  SiReact,
  SiReplit,
} from "react-icons/si";
import {
  Button,
  ButtonProps,
  LinkButton,
  PossibleButtonSize,
} from "tw-components";

const LOGO_OPTIONS = {
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
  go: {
    icon: SiGo,
    fill: "#50b7e0",
  },
} as const;

export type CodeOptions = keyof typeof LOGO_OPTIONS;

const isReplitEnabled = true;

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
        columns={{ base: 2, md: 4 }}
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
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="go"
        >
          Go
        </CodeOptionButton>
      </SimpleGrid>
      {isReplitEnabled ? (
        <>
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
            loading="lazy"
            src={`https://replit.com/@thirdweb-dev/${activeLanguage}-sdk?lite=true`}
          />
          <LinkButton
            variant="outline"
            borderRadius="md"
            bg="#fff"
            color="#000"
            w="full"
            maxW="container.sm"
            _hover={{
              bg: "whiteAlpha.800",
            }}
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
            Explore documentation
          </LinkButton>
        </>
      ) : (
        <Flex
          gap={{ base: 4, md: 12 }}
          align="center"
          direction={{ base: "column", md: "row" }}
          w="100%"
          maxW="container.sm"
        >
          <LinkButton
            role="group"
            borderRadius="md"
            p={6}
            variant="gradient"
            fromcolor="#1D64EF"
            tocolor="#E0507A"
            // flexShrink={0}
            isExternal
            // variant="solid"
            colorScheme="primary"
            w="full"
            // maxW="300px"
            href={`https://replit.com/@thirdweb-dev/${activeLanguage}-sdk`}
            leftIcon={
              <Icon
                color="#1D64EF"
                _groupHover={{ color: "#E0507A" }}
                as={SiReplit}
              />
            }
          >
            <Box as="span">Try it on repl.it</Box>
          </LinkButton>
          <LinkButton
            variant="outline"
            borderRadius="md"
            w="full"
            // maxW="300px"
            href={`https://portal.thirdweb.com/${activeLanguage}`}
            isExternal
            p={6}
            // flexShrink={0}
            onClick={() =>
              trackEvent({
                category: "code-selector",
                action: "click-documentation",
                label: activeLanguage,
              })
            }
          >
            Explore documentation
          </LinkButton>
        </Flex>
      )}
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
