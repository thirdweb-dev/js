import { DeepPartial, deepMerge } from "../types/deepPartial";
import { paletteDark, paletteLight } from "./colors";
import { textVariants } from "./textVariants";
import { createTheme } from "@shopify/restyle";

export const baseTheme = {
  spacing: {
    none: 0,
    xxs: 6,
    xs: 8,
    sm: 12,
    md: 16,
    xmd: 20,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadii: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 20,
    xxl: 32,
  },
  textVariants,
};

export const _darkTheme = createTheme({
  ...baseTheme,
  colors: {
    ...paletteDark,
  },
});

export const _lightTheme: Theme = {
  ...baseTheme,
  colors: {
    ...paletteLight,
  },
};

export type Theme = typeof _darkTheme;

export type ButtonTheme = {
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  buttonBorderColor?: string;
};

export const darkTheme = ({
  buttonBackgroundColor = paletteDark.buttonBackgroundColor,
  buttonTextColor = paletteDark.buttonTextColor,
  buttonBorderColor = paletteLight.buttonBorderColor,
  colors,
  ...props
}: ButtonTheme & DeepPartial<Theme> = _darkTheme): Theme => {
  return deepMerge(_darkTheme, {
    colors: {
      ..._darkTheme.colors,
      ...colors,
      buttonBackgroundColor,
      buttonTextColor,
      buttonBorderColor,
    },
    ...props,
  });
};

export const lightTheme = ({
  buttonBackgroundColor = paletteLight.buttonBackgroundColor,
  buttonTextColor = paletteLight.buttonTextColor,
  buttonBorderColor = paletteLight.buttonBorderColor,
  colors,
  ...props
}: ButtonTheme & DeepPartial<Theme> = _lightTheme): Theme => {
  return deepMerge(_lightTheme, {
    colors: {
      ..._lightTheme.colors,
      ...colors,
      buttonBackgroundColor,
      buttonTextColor,
      buttonBorderColor,
    },
    ...props,
  });
};
