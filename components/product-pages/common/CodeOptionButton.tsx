import { Icon } from "@chakra-ui/react";
import { SiGo } from "@react-icons/all-files/si/SiGo";
import { SiJavascript } from "@react-icons/all-files/si/SiJavascript";
import { SiPython } from "@react-icons/all-files/si/SiPython";
import { SiReact } from "@react-icons/all-files/si/SiReact";
import { SiUnity } from "@react-icons/all-files/si/SiUnity";
import { useTrack } from "hooks/analytics/useTrack";
import { Dispatch, SetStateAction } from "react";
import { flushSync } from "react-dom";
import { Button, ButtonProps } from "tw-components";

export const LOGO_OPTIONS = {
  javascript: {
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
  unity: {
    icon: SiUnity,
    fill: "#ffffff",
  },
} as const;

export type CodeOptions = keyof typeof LOGO_OPTIONS;

interface CodeOptionButtonProps extends ButtonProps {
  language: CodeOptions;
  activeLanguage: CodeOptions;
  setActiveLanguage: Dispatch<SetStateAction<CodeOptions>>;
}

export const CodeOptionButton: React.FC<CodeOptionButtonProps> = ({
  children,
  language,
  setActiveLanguage,
  activeLanguage,
  ...rest
}) => {
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
          ? "0 0 1px 1px rgba(255, 255, 255, 0.5)"
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
