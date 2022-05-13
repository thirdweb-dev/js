import { convertFontSizeToCSSVar } from "./utils/typography";
import {
  FormErrorMessage as ChakraFormErrorMessage,
  FormErrorMessageProps as ChakraFormErrorMessageProps,
  FormHelperText as ChakraFormHelperText,
  FormLabelProps as ChakraFormLabelprops,
  HelpTextProps as ChakraHelperTextProps,
  FormLabel as FormLabelText,
} from "@chakra-ui/react";
import {
  BodyBase,
  BodySizes,
  LabelBase,
  LabelSizes,
  TypographySize,
  fontWeights,
  letterSpacings,
  lineHeights,
} from "theme/typography";
import { ComponentWithChildren } from "types/component-with-children";

export interface FormLabelProps extends Omit<ChakraFormLabelprops, "size"> {
  size?: LabelSizes;
}

export const FormLabel: ComponentWithChildren<FormLabelProps> = ({
  size = "label.md",
  ...restProps
}) => {
  const [base] = size.split(".") as [LabelBase, TypographySize];

  return (
    <FormLabelText
      fontSize={convertFontSizeToCSSVar(size)}
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
  const [base] = size.split(".") as [BodyBase, TypographySize];

  return (
    <ChakraFormHelperText
      fontSize={convertFontSizeToCSSVar(size)}
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
  const [base] = size.split(".") as [BodyBase, TypographySize];

  return (
    <ChakraFormErrorMessage
      fontSize={convertFontSizeToCSSVar(size)}
      fontWeight={fontWeights[base]}
      lineHeight={lineHeights[base]}
      letterSpacing={letterSpacings[base]}
      {...restProps}
    />
  );
};
