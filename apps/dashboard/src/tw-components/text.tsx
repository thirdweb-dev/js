import {
  Text as ChakraText,
  type TextProps as ChakraTextProps,
} from "@chakra-ui/react";
import {
  type TextBase,
  type TextSizes,
  type TypographySize,
  fontWeights,
  letterSpacings,
  lineHeights,
} from "theme/typography";
import type { ComponentWithChildren } from "types/component-with-children";
import { convertFontSizeToCSSVar } from "./utils/typography";

interface TextProps extends Omit<ChakraTextProps, "size"> {
  size?: TextSizes;
}

export const Text: ComponentWithChildren<TextProps> = ({
  size = "body.md",
  ...restProps
}) => {
  const [base] = size.split(".") as [TextBase, TypographySize];

  return (
    <ChakraText
      fontSize={convertFontSizeToCSSVar(size)}
      fontWeight={fontWeights[base]}
      lineHeight={lineHeights[base]}
      letterSpacing={letterSpacings[base]}
      {...restProps}
    />
  );
};
