import type { TypographyFontSize } from "chakra/theme/typography";

const FONT_SIZE_CSS_VAR_PREFIX = "--tw-font-size-" as const;

function createCssVariable(size: TypographyFontSize) {
  return `${FONT_SIZE_CSS_VAR_PREFIX}${size.replace(/\./g, "-")}`;
}

export function convertFontSizeToCSSVar(fontSize: TypographyFontSize) {
  return `var(${createCssVariable(fontSize)})`;
}
