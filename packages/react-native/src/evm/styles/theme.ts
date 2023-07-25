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
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },
  borderRadii: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 20,
    xxl: 32,
  },
  iconSize: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  textVariants,
};

const darkTheme_ = createTheme({
  ...baseTheme,
  colors: {
    ...paletteDark,
  },
});

const lightTheme_: Theme = {
  ...baseTheme,
  colors: {
    ...paletteLight,
  },
};

export type Theme = typeof darkTheme_;

export type ButtonTheme = {
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
};

export const darkTheme = ({
  buttonBackgroundColor = paletteDark.buttonBackgroundColor,
  buttonTextColor = paletteDark.buttonTextColor,
}: ButtonTheme = {}) => {
  return {
    ...darkTheme_,
    colors: {
      ...darkTheme_.colors,
      buttonBackgroundColor,
      buttonTextColor,
    },
  };
};

export const lightTheme = ({
  buttonBackgroundColor = paletteLight.buttonBackgroundColor,
  buttonTextColor = paletteLight.buttonTextColor,
}: ButtonTheme = {}) => {
  return {
    ...lightTheme_,
    colors: {
      ...lightTheme_.colors,
      buttonBackgroundColor,
      buttonTextColor,
    },
  };
};
