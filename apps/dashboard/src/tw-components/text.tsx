import {
  Text as ChakraText,
  type TextProps as ChakraTextProps,
} from "@chakra-ui/react";
import {
  fontWeights,
  letterSpacings,
  lineHeights,
  type TextBase,
  type TextSizes,
  type TypographySize,
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
      letterSpacing={letterSpacings[base]}
      lineHeight={lineHeights[base]}
      {...restProps}
    />
  );
};
