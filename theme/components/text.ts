import { Theme } from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";
import flatten from "flat";

const generateSize = (base: string, fontSizeKey: string) => ({
  fontSize: `${base}.${fontSizeKey}`,
  fontWeight: base,
  lineHeight: base,
  letterSpacing: base,
});

export const Text: Partial<Theme["components"]["Heading"] & Dict> = {
  baseStyle: {
    color: "paragraph",
  },
  sizes: flatten(
    {
      label: {
        sm: generateSize("label", "sm"),
        md: generateSize("label", "md"),
        lg: generateSize("label", "lg"),
      },
      body: {
        sm: generateSize("body", "sm"),
        md: generateSize("body", "md"),
        lg: generateSize("body", "lg"),
      },
    },
    { maxDepth: 2 },
  ),
  defaultProps: {
    size: "body.md",
  },
};
