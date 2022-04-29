import {
  Text as ChakraText,
  TextProps as ChakraTextProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  TextBase,
  TextSizes,
  TypographySize,
  baseFontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  mdFontSizes,
} from "theme/typography";
import { ComponentWithChildren } from "types/component-with-children";

export interface TextProps extends Omit<ChakraTextProps, "size"> {
  size?: TextSizes;
}

export const Text: ComponentWithChildren<TextProps> = ({
  size = "body.md",
  ...restProps
}) => {
  const [base, fontSizeKey] = size.split(".") as [TextBase, TypographySize];
  const fontSizeMap =
    useBreakpointValue({
      base: baseFontSizes,
      md: mdFontSizes,
    }) || mdFontSizes;

  return (
    <ChakraText
      fontSize={fontSizeMap[base][fontSizeKey]}
      fontWeight={fontWeights[base]}
      lineHeight={lineHeights[base]}
      letterSpacing={letterSpacings[base]}
      {...restProps}
    />
  );
};
