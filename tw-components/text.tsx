import { convertFontSizeToCSSVar } from "./utils/typography";
import {
  Text as ChakraText,
  TextProps as ChakraTextProps,
} from "@chakra-ui/react";
import {
  TextBase,
  TextSizes,
  TypographySize,
  fontWeights,
  letterSpacings,
  lineHeights,
} from "theme/typography";
import { ComponentWithChildren } from "types/component-with-children";

export interface TextProps extends Omit<ChakraTextProps, "size"> {
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
