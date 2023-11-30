import { Box, DarkMode, Flex, LightMode } from "@chakra-ui/react";
import { Button, Text } from "tw-components";

const ButtonShapeRecord: Record<string, string> = {
  rounded: "lg",
  square: "none",
  pill: "full",
};

const ColorSchemeRecord: Record<
  string,
  { [key: string]: { bgColor: string; color: string } }
> = {
  light: {
    gray: { bgColor: "#000", color: "#fff" },
    red: { bgColor: "#E53E3E", color: "#fff" },
    orange: { bgColor: "#DD6B20", color: "#fff" },
    yellow: { bgColor: "#D69E2E", color: "#000" },
    green: { bgColor: "#38A169", color: "#fff" },
    teal: { bgColor: "#319795", color: "#fff" },
    blue: { bgColor: "#3182CE", color: "#fff" },
    cyan: { bgColor: "#00B5D8", color: "#000" },
    purple: { bgColor: "#805AD5", color: "#fff" },
    pink: { bgColor: "#D53F8C", color: "#fff" },
  },
  dark: {
    gray: { bgColor: "#FFFFFF", color: "#000" },
    red: { bgColor: "#FEB2B2", color: "#000" },
    orange: { bgColor: "#FBD38D", color: "#000" },
    yellow: { bgColor: "#FAF089", color: "#000" },
    green: { bgColor: "#9AE6B4", color: "#000" },
    teal: { bgColor: "#81E6D9", color: "#000" },
    blue: { bgColor: "#90cdf4", color: "#000" },
    cyan: { bgColor: "#9DECF9", color: "#000" },
    purple: { bgColor: "#D6BCFA", color: "#000" },
    pink: { bgColor: "#FBB6CE", color: "#000" },
  },
};

export const BG_COLOR_DARK_MODE = "#191D27";

interface PaymentsPreviewButtonProps {
  colorScheme: string;
  buttonShape: string;
  isDarkMode: boolean;
}

export const PaymentsPreviewButton: React.FC<PaymentsPreviewButtonProps> = ({
  colorScheme = "red",
  buttonShape = "rounded",
  isDarkMode = false,
}) => {
  const LightOrDarkMode = isDarkMode ? DarkMode : LightMode;

  const colorSchemeLightOrDark =
    ColorSchemeRecord[isDarkMode ? "dark" : "light"];

  return (
    <Flex flexDir="column" gap={2}>
      <Text size="body.md">Preview</Text>
      <Box
        bg={isDarkMode ? BG_COLOR_DARK_MODE : "#fff"}
        p={3}
        rounded="lg"
        w="max-content"
      >
        <LightOrDarkMode>
          <Button
            bgColor={colorSchemeLightOrDark[colorScheme || "red"]?.bgColor}
            color={colorSchemeLightOrDark[colorScheme || "red"]?.color}
            _hover={{
              opacity: 0.8,
            }}
            rounded={ButtonShapeRecord[buttonShape]}
            px={5}
            type="button"
          >
            <Box as="span" fontWeight={400}>
              Example
            </Box>
          </Button>
        </LightOrDarkMode>
      </Box>
    </Flex>
  );
};
