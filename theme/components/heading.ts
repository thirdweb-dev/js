import { Theme } from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";
import flatten from "flat";

const generateSize = (base: string, fontSizeKey: string) => ({
  fontSize: `${base}.${fontSizeKey}`,
  fontWeight: base,
  lineHeight: base,
  letterSpacing: base,
});

export const Heading: Partial<Theme["components"]["Heading"] & Dict> = {
  baseStyle: {
    color: "heading",
  },
  sizes: flatten(
    {
      display: {
        sm: generateSize("display", "sm"),
        md: generateSize("display", "md"),
        lg: generateSize("display", "lg"),
      },
      title: {
        sm: generateSize("title", "sm"),
        md: generateSize("title", "md"),
        lg: generateSize("title", "lg"),
      },
      subtitle: {
        sm: generateSize("subtitle", "sm"),
        md: generateSize("subtitle", "md"),
        lg: generateSize("subtitle", "lg"),
      },
      label: {
        sm: generateSize("label", "sm"),
        md: generateSize("label", "md"),
        lg: generateSize("label", "lg"),
      },
    },
    { maxDepth: 2 },
  ),

  defaultProps: {
    size: "title.lg",
  },
};
