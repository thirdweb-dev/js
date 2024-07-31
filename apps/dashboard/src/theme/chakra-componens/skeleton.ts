import { cssVar, defineStyle, defineStyleConfig } from "@chakra-ui/react";

const $startColor = cssVar("skeleton-start-color");
const $endColor = cssVar("skeleton-end-color");

const thirdweb = defineStyle({
  _light: {
    [$startColor.variable]: "colors.gray.100",
    [$endColor.variable]: "colors.gray.300",
  },
  _dark: {
    [$startColor.variable]: "colors.gray.900",
    [$endColor.variable]: "colors.gray.800",
  },
});
export const skeletonTheme = defineStyleConfig({
  variants: { thirdweb },
  defaultProps: {
    variant: "thirdweb",
  },
});
