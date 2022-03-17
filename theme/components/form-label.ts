import { Theme } from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";
import flatten from "flat";

const generateSize = (base: string, fontSizeKey: string) => ({
  fontSize: `${base}.${fontSizeKey}`,
  fontWeight: base,
  lineHeight: base,
  letterSpacing: base,
});

export const FormLabel: Partial<Theme["components"]["Heading"] & Dict> = {
  sizes: flatten(
    {
      label: {
        sm: generateSize("label", "sm"),
        md: generateSize("label", "md"),
        lg: generateSize("label", "lg"),
      },
    },
    { maxDepth: 2 },
  ),
  variants: {
    light: {
      color: "paragraphLight",
    },
  },
  defaultProps: {
    size: "label.md",
  },
};
