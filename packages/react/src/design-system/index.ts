import { blue, green, mauve, mauveDark, tomato } from "@radix-ui/colors";

export const darkTheme = {
  overlay: {
    subdued: "rgba(0, 0, 0, 0.74)",
  },
  bg: {
    base: mauveDark.mauve1,
    baseHover: mauveDark.mauve2,
    elevated: mauveDark.mauve3,
    elevatedHover: mauveDark.mauve4,
    highlighted: mauveDark.mauve5,
    inverted: mauveDark.mauve12,
    invertedFocused: mauveDark.mauve7,
    danger: tomato.tomato12,
  },
  border: {
    base: mauveDark.mauve3,
    elevated: mauveDark.mauve4,
  },
  badge: {
    secondary: mauveDark.mauve6,
  },
  text: {
    neutral: mauveDark.mauve12,
    inverted: mauveDark.mauve1,
    secondary: mauveDark.mauve9,
    danger: tomato.tomato9,
  },
  icon: {
    secondary: mauveDark.mauve11,
    primary: mauveDark.mauve12,
    inverted: mauveDark.mauve1,
    danger: tomato.tomato9,
    success: green.green7,
    link: blue.blue9,
  },
  link: {
    primary: blue.blue9,
    primaryHover: mauveDark.mauve12,
  },
  input: {
    bg: mauveDark.mauve3,
    bgHover: mauveDark.mauve5,
    outline: mauveDark.mauve5,
    focusRing: blue.blue9,
    errorRing: tomato.tomato9,
  },
  tooltip: {
    bg: "black",
    text: "white",
  },
};

export const lightTheme: typeof darkTheme = {
  overlay: {
    subdued: "rgba(0, 0, 0, 0.4)",
  },
  bg: {
    base: mauve.mauve1,
    baseHover: mauve.mauve2,
    elevated: mauve.mauve3,
    elevatedHover: mauve.mauve4,
    highlighted: mauve.mauve5,
    inverted: mauve.mauve12,
    invertedFocused: mauve.mauve7,
    danger: tomato.tomato4,
  },
  border: {
    base: mauve.mauve6,
    elevated: mauve.mauve7,
  },
  badge: {
    secondary: mauve.mauve1,
  },
  text: {
    neutral: mauve.mauve12,
    inverted: mauve.mauve1,
    secondary: mauve.mauve10,
    danger: tomato.tomato9,
  },
  icon: {
    secondary: mauve.mauve10,
    primary: mauve.mauve12,
    inverted: mauve.mauve1,
    danger: tomato.tomato9,
    success: green.green9,
    link: blue.blue11,
  },
  link: {
    primary: blue.blue11,
    primaryHover: mauve.mauve12,
  },
  input: {
    bg: mauve.mauve3,
    bgHover: mauveDark.mauve5,
    outline: mauve.mauve7,
    focusRing: blue.blue11,
    errorRing: tomato.tomato10,
  },
  tooltip: {
    bg: "black",
    text: "white",
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
