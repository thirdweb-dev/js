import { green, mauve, mauveDark, tomato } from "@radix-ui/colors";

const darkColors = {
  base1: "hsl(230deg 11.63% 8.43%)",
  base2: "hsl(230deg 11.63% 12%)",
  base3: "hsl(230deg 11.63% 15%)",
  base4: "hsl(230deg 11.63% 17%)",
  base5: "hsl(230deg 11.63% 20%)",

  primaryText: mauveDark.mauve12,
  secondaryText: mauveDark.mauve10,
  accentText: "#3385FF",
  accentBg: "hsl(216 100% 50%)",
  textOnAccentBg: mauveDark.mauve12,

  danger: tomato.tomato9,
  success: green.green7,
  overlay: "rgba(0, 0, 0, 0.7)",
};

const lightColors: typeof darkColors = {
  base1: mauve.mauve1,
  base2: mauve.mauve3,
  base3: mauve.mauve5,
  base4: mauve.mauve6,
  base5: mauve.mauve7,

  primaryText: mauve.mauve12,
  secondaryText: mauveDark.mauve10,

  accentText: "hsl(216 100% 45%)",
  accentBg: "hsl(216 100% 50%)",
  textOnAccentBg: mauve.mauve1,

  success: green.green9,
  danger: tomato.tomato9,
  overlay: "rgba(0, 0, 0, 0.7)",
};

export const darkTheme = {
  colors: darkColors,
};

export const lightTheme: typeof darkTheme = {
  colors: lightColors,
};

export type Theme = typeof darkTheme;

export const fontSize = {
  xs: "12px",
  sm: "14px",
  md: "16px",
  lg: "20px",
  xl: "24px",
};

export const spacing = {
  xxs: "6px",
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
};

export const radius = {
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "20px",
  xxl: "32px",
};

export const iconSize = {
  xs: "12",
  sm: "16",
  md: "24",
  lg: "32",
  xl: "48",
  xxl: "64",
};

// desktop first style media query
export const media = {
  mobile: `@media (max-width: 640px)`,
};

// TODO - move to theme
export const shadow = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};
