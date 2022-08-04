import { Icon, useBreakpointValue } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { Dispatch, SetStateAction } from "react";
import { flushSync } from "react-dom";
import { SiGo, SiJavascript, SiPython, SiReact } from "react-icons/si";
import { Button, ButtonProps, PossibleButtonSize } from "tw-components";

const LOGO_OPTIONS = {
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
