import { blue, green, mauve, mauveDark, tomato } from "@radix-ui/colors";

const darkColors = {
  base: "hsl(228deg 11.63% 8.43%)",
  baseHover: "hsl(228deg 11.63% 10%)",
  elevated: "hsl(228deg 11.63% 12%)",
  elevatedHover: "hsl(228deg 11.63% 17%)",
  highlighted: "hsl(228deg 11.63% 20%)",
  inverted: mauveDark.mauve12,
  invertedFocused: mauveDark.mauve7,
  danger: tomato.tomato9,
  accent: "#3385FF",
  success: green.green7,
};

const lightColors = {
  base: mauve.mauve1,
  baseHover: mauve.mauve2,
  elevated: mauve.mauve5,
  elevatedHover: mauve.mauve6,
  highlighted: mauve.mauve7,
  inverted: mauve.mauve12,
  invertedFocused: mauve.mauve9,
  danger: tomato.tomato9,
  accent: blue.blue11,
  success: green.green9,
};

export const darkTheme = {
  overlay: "rgba(0, 0, 0, 0.7)",
  bg: darkColors,
  text: {
    neutral: darkColors.inverted,
    inverted: darkColors.base,
    secondary: mauveDark.mauve9, // new color
    danger: darkColors.danger,
    success: darkColors.success,
    accent: darkColors.accent,
  },
  input: {
    bg: darkColors.elevated,
    bgHover: darkColors.elevatedHover,
    outline: darkColors.elevatedHover,
    focusRing: darkColors.accent,
    errorRing: darkColors.danger,
  },
  btn: {
    accent: {
      bg: darkColors.accent,
      color: darkColors.inverted,
    },
  },
};

export const lightTheme: typeof darkTheme = {
  overlay: "rgba(0, 0, 0, 0.7)",
  bg: lightColors,
  text: {
    neutral: lightColors.inverted,
    inverted: lightColors.base,
    secondary: mauve.mauve10, // new color
    danger: lightColors.danger,
    success: lightColors.success,
    accent: lightColors.accent,
  },
  input: {
    bg: lightColors.elevated,
    bgHover: lightColors.elevatedHover,
    outline: lightColors.elevatedHover,
    focusRing: lightColors.accent,
    errorRing: lightColors.danger,
  },
  btn: {
    accent: {
      bg: lightColors.accent,
      color: lightColors.base,
    },
  },
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
};

// desktop first style media query
export const media = {
  mobile: `@media (max-width: 640px)`,
};

export const shadow = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};
