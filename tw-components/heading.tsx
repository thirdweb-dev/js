import {
  Heading as ChakraHeading,
  HeadingProps as ChakraHeadingProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  HeadingBase,
  HeadingSizes,
  TypographySize,
  baseFontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  mdFontSizes,
} from "theme/typography";
import { ComponentWithChildren } from "types/component-with-children";

export interface HeadingProps extends Omit<ChakraHeadingProps, "size"> {
  size?: HeadingSizes;
}

export const Heading: ComponentWithChildren<HeadingProps> = ({
  size = "title.lg",
  ...restProps
}) => {
  const [base, fontSizeKey] = size.split(".") as [HeadingBase, TypographySize];
  const fontSizeMap =
    useBreakpointValue({
      base: baseFontSizes,
      md: mdFontSizes,
    }) || mdFontSizes;

  return (
    <ChakraHeading
      fontSize={fontSizeMap[base][fontSizeKey]}
      fontWeight={fontWeights[base]}
      lineHeight={lineHeights[base]}
      letterSpacing={letterSpacings[base]}
      {...restProps}
    />
  );
};
