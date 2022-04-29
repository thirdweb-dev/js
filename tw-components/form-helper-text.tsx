import {
  HelpTextProps as ChakraFormHelperTextProps,
  FormHelperText as FormHelperTextText,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  BodyBase,
  BodySizes,
  TypographySize,
  baseFontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  mdFontSizes,
} from "theme/typography";
import { ComponentWithChildren } from "types/component-with-children";

export interface FormHelperTextProps
  extends Omit<ChakraFormHelperTextProps, "size"> {
  size?: BodySizes;
}

export const FormHelperText: ComponentWithChildren<FormHelperTextProps> = ({
  size = "body.sm",
  ...restProps
}) => {
  const [base, fontSizeKey] = size.split(".") as [BodyBase, TypographySize];
  const fontSizeMap =
    useBreakpointValue({
      base: baseFontSizes,
      md: mdFontSizes,
    }) || mdFontSizes;

  return (
    <FormHelperTextText
      fontSize={fontSizeMap[base][fontSizeKey]}
      fontWeight={fontWeights[base]}
      lineHeight={lineHeights[base]}
      letterSpacing={letterSpacings[base]}
      {...restProps}
    />
  );
};
