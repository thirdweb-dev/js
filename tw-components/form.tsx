import {
  FormErrorMessage as ChakraFormErrorMessage,
  FormErrorMessageProps as ChakraFormErrorMessageProps,
  FormHelperText as ChakraFormHelperText,
  FormLabelProps as ChakraFormLabelprops,
  HelpTextProps as ChakraHelperTextProps,
  FormLabel as FormLabelText,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  BodyBase,
  BodySizes,
  LabelBase,
  LabelSizes,
  TypographySize,
  baseFontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  mdFontSizes,
} from "theme/typography";
import { ComponentWithChildren } from "types/component-with-children";

export interface FormLabelProps extends Omit<ChakraFormLabelprops, "size"> {
  size?: LabelSizes;
}

export const FormLabel: ComponentWithChildren<FormLabelProps> = ({
  size = "label.md",
  ...restProps
}) => {
  const [base, fontSizeKey] = size.split(".") as [LabelBase, TypographySize];
  const fontSizeMap =
    useBreakpointValue({
      base: baseFontSizes,
      md: mdFontSizes,
    }) || mdFontSizes;

  return (
    <FormLabelText
      fontSize={fontSizeMap[base][fontSizeKey]}
      fontWeight={fontWeights[base]}
      lineHeight={lineHeights[base]}
      letterSpacing={letterSpacings[base]}
      {...restProps}
    />
  );
};

export interface FormHelperTextProps
  extends Omit<ChakraHelperTextProps, "size"> {
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
    <ChakraFormHelperText
      fontSize={fontSizeMap[base][fontSizeKey]}
      fontWeight={fontWeights[base]}
      lineHeight={lineHeights[base]}
      letterSpacing={letterSpacings[base]}
      {...restProps}
    />
  );
};

export interface FormErrorMessageProps
  extends Omit<ChakraFormErrorMessageProps, "size"> {
  size?: BodySizes;
}

export const FormErrorMessage: ComponentWithChildren<FormErrorMessageProps> = ({
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
    <ChakraFormErrorMessage
      fontSize={fontSizeMap[base][fontSizeKey]}
      fontWeight={fontWeights[base]}
      lineHeight={lineHeights[base]}
      letterSpacing={letterSpacings[base]}
      {...restProps}
    />
  );
};
