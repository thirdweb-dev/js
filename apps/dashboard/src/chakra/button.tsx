"use client";

import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
  forwardRef,
  LightMode,
  useButtonGroup,
} from "@chakra-ui/react";
import {
  fontWeights,
  letterSpacings,
  lineHeights,
} from "chakra/theme/typography";
import { convertFontSizeToCSSVar } from "./utils/typography";

const buttonSizesMap = {
  lg: "xl",
  md: "lg",
  sm: "md",
  xs: "sm",
} as const;

type PossibleButtonSize = keyof typeof buttonSizesMap;

interface ButtonProps extends Omit<ChakraButtonProps, "size"> {
  size?: PossibleButtonSize;
  fromcolor?: string;
  tocolor?: string;
}

export const Button = forwardRef<ButtonProps, "button">(
  ({ size, ...restButtonProps }, ref) => {
    const { size: groupSize, ...buttonGroupContext } = useButtonGroup() || {};
    let _size: PossibleButtonSize = (size ||
      groupSize ||
      "md") as PossibleButtonSize;
    if (!(_size in buttonSizesMap)) {
      _size = "md";
    }
    const props: ButtonProps = {
      fontSize: convertFontSizeToCSSVar(`label.${buttonSizesMap[_size]}`),
      fontWeight: fontWeights.label,
      letterSpacing: letterSpacings.label,
      lineHeight: lineHeights.label,
      size: _size,
      ...buttonGroupContext,
      ...restButtonProps,
    };
    if (
      props.colorScheme &&
      props.variant !== "outline" &&
      props.variant !== "ghost"
    ) {
      return (
        <LightMode>
          <ChakraButton
            fontWeight={fontWeights.label}
            letterSpacing={letterSpacings.label}
            lineHeight={lineHeights.label}
            {...props}
            ref={ref}
          />
        </LightMode>
      );
    }

    return (
      <ChakraButton
        {...props}
        fontWeight={fontWeights.label}
        letterSpacing={letterSpacings.label}
        lineHeight={lineHeights.label}
        ref={ref}
      />
    );
  },
);
