import { Icon } from "@chakra-ui/react";
import { SiReact } from "@react-icons/all-files/si/SiReact";
import { SiUnity } from "@react-icons/all-files/si/SiUnity";
import { JavaScriptIcon } from "components/icons/brand-icons/JavaScriptIcon";
import { useTrack } from "hooks/analytics/useTrack";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Button } from "tw-components";

const LOGO_OPTIONS = {
  javascript: {
    icon: JavaScriptIcon,
    fill: "yellow",
  },
  react: {
    icon: SiReact,
    fill: "#61dafb",
  },
  "react-native": {
    icon: SiReact,
    fill: "#61dafb",
  },
  unity: {
    icon: SiUnity,
    fill: "#ffffff",
  },
} as const;

export type CodeOptions = keyof typeof LOGO_OPTIONS;

interface ConnectPlaygroundButtonProps {
  language: CodeOptions;
  activeLanguage: CodeOptions;
  setActiveLanguage: Dispatch<SetStateAction<CodeOptions>>;
  children: ReactNode;
}

const ConnectPlaygroundButton = ({
  language,
  activeLanguage,
  setActiveLanguage,
  children,
}: ConnectPlaygroundButtonProps) => {
  const trackEvent = useTrack();

  const logo = LOGO_OPTIONS[language];

  const isActive = language === activeLanguage;

  return (
    <Button
      leftIcon={<Icon as={logo.icon} fill={logo.fill} />}
      border="1px solid transparent"
      variant="solid"
      fontWeight="normal"
      colorScheme="blackAlpha"
      bg={isActive ? "rgba(255, 255, 255, 0.07)" : "transparent"}
      minWidth="80px"
      boxShadow={
        isActive
          ? "0 0 1px 1px rgba(255, 255, 255, 1)"
          : "0 0 1px 1px rgba(255, 255, 255, 0.0)"
      }
      borderRadius={{ base: "4px", md: "6px" }}
      fontFamily="mono"
      fontSize={{ base: "12px", md: "14px" }}
      position="relative"
      height="auto"
      px={4}
      py={3}
      _hover={{
        bg: "rgba(255,255,255, 0.1)",
      }}
      onClick={() => {
        trackEvent({
          category: "code-selector",
          action: "switch-language",
          label: language,
        });
        setActiveLanguage(language);
      }}
    >
      {children}
    </Button>
  );
};

export default ConnectPlaygroundButton;
