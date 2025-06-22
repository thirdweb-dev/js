import { cssVar, defineStyle, defineStyleConfig } from "@chakra-ui/react";

const $startColor = cssVar("skeleton-start-color");
const $endColor = cssVar("skeleton-end-color");

const thirdweb = defineStyle({
  _dark: {
    [$startColor.variable]: "colors.gray.900",
    [$endColor.variable]: "colors.gray.800",
  },
  _light: {
    [$startColor.variable]: "colors.gray.100",
    [$endColor.variable]: "colors.gray.300",
  },
});
export const skeletonTheme = defineStyleConfig({
  defaultProps: {
    variant: "thirdweb",
  },
  variants: { thirdweb },
});
