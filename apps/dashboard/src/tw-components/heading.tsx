import {
  Heading as ChakraHeading,
  type HeadingProps as ChakraHeadingProps,
} from "@chakra-ui/react";
import {
  type HeadingBase,
  type HeadingSizes,
  type TypographySize,
  fontWeights,
  letterSpacings,
  lineHeights,
} from "theme/typography";
import type { ComponentWithChildren } from "types/component-with-children";
import { convertFontSizeToCSSVar } from "./utils/typography";

interface HeadingProps extends Omit<ChakraHeadingProps, "size"> {
  size?: HeadingSizes;
}

export const Heading: ComponentWithChildren<HeadingProps> = ({
  size = "title.lg",
  ...restProps
}) => {
  const [base] = size.split(".") as [HeadingBase, TypographySize];

  return (
    <ChakraHeading
      fontSize={convertFontSizeToCSSVar(size)}
      fontWeight={fontWeights[base]}
      lineHeight={lineHeights[base]}
      letterSpacing={letterSpacings[base]}
      {...restProps}
    />
  );
};
