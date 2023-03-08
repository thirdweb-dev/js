import { paletteDark, paletteLight } from "./colors";
import { textVariants } from "./textVariants";
import { createTheme } from "@shopify/restyle";

export const darkTheme = createTheme({
  colors: {
    ...paletteDark,
  },
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
});

export const lightTheme: Theme = {
  ...darkTheme,
  colors: {
    ...paletteLight,
  },
};

export type Theme = typeof darkTheme;
