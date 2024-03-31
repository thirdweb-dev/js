import chakraTheme from "../../theme";
import {
  TypographyBase,
  TypographyFontSize,
  TypographySize,
  baseFontSizes,
  mdFontSizes,
} from "theme/typography";

const FONT_SIZE_CSS_VAR_PREFIX = "--tw-font-size-" as const;

function createCssVariable(size: TypographyFontSize) {
  return `${FONT_SIZE_CSS_VAR_PREFIX}${size.replace(/\./g, "-")}`;
}

export function convertFontSizeToCSSVar(fontSize: TypographyFontSize) {
  return `var(${createCssVariable(fontSize)})`;
}

export function generateBreakpointTypographyCssVars() {
  const baseCSSVars = Object.entries(baseFontSizes)
    .flatMap(([typographyBase, typographySizeMap]) => {
      return Object.entries(typographySizeMap).map(
        ([typographySize, fontSizeValue]) => {
          return `${createCssVariable(
            `${typographyBase as TypographyBase}.${
              typographySize as TypographySize
            }`,
          )}: ${fontSizeValue};`;
        },
      );
    })
    .join("\n");

  const mdCSSVars = Object.entries(mdFontSizes)
    .flatMap(([typographyBase, typographySizeMap]) => {
      return Object.entries(typographySizeMap).map(
        ([typographySize, fontSizeValue]) => {
          return `${createCssVariable(
            `${typographyBase as TypographyBase}.${
              typographySize as TypographySize
            }`,
          )}: ${fontSizeValue};`;
        },
      );
    })
    .join("\n");

  return `:root {
    ${baseCSSVars}
    @media screen and (min-width: ${chakraTheme.breakpoints.md}) {
      ${mdCSSVars}
    }
  }`;
}
