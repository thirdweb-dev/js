import {
  FormLabelProps as ChakraFormLabelprops,
  FormLabel as FormLabelText,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
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
