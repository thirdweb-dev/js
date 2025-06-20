import {
  FormErrorMessage as ChakraFormErrorMessage,
  type FormErrorMessageProps as ChakraFormErrorMessageProps,
  FormHelperText as ChakraFormHelperText,
  type FormLabelProps as ChakraFormLabelprops,
  type TextProps as ChakraHelperTextProps,
  FormLabel as FormLabelText,
} from "@chakra-ui/react";
import {
  type BodyBase,
  type BodySizes,
  fontWeights,
  type LabelBase,
  type LabelSizes,
  letterSpacings,
  lineHeights,
  type TypographySize,
} from "theme/typography";
import type { ComponentWithChildren } from "types/component-with-children";
import { convertFontSizeToCSSVar } from "./utils/typography";

interface FormLabelProps extends Omit<ChakraFormLabelprops, "size"> {
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
      letterSpacing={letterSpacings[base]}
      lineHeight={lineHeights[base]}
      {...restProps}
    />
  );
};

interface FormHelperTextProps extends Omit<ChakraHelperTextProps, "size"> {
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
      letterSpacing={letterSpacings[base]}
      lineHeight={lineHeights[base]}
      {...restProps}
    />
  );
};

interface FormErrorMessageProps
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
      letterSpacing={letterSpacings[base]}
      lineHeight={lineHeights[base]}
      {...restProps}
    />
  );
};
