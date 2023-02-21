import { blue, gray, mauveDark, red } from "@radix-ui/colors";

export const darkTheme = {
  overlay: {
    subdued: "rgba(0, 0, 0, 0.74)",
  },
  bg: {
    base: mauveDark.mauve1,
    elevated: mauveDark.mauve3,
    highlighted: mauveDark.mauve5,
    inverted: mauveDark.mauve12,
    invertedFocused: mauveDark.mauve7,
  },
  badge: {
    secondary: mauveDark.mauve7,
  },
  text: {
    neutral: mauveDark.mauve12,
    inverted: mauveDark.mauve1,
    secondary: mauveDark.mauve9,
  },
  icon: {
    secondary: mauveDark.mauve11,
    primary: mauveDark.mauve12,
  },
  link: {
    primary: blue.blue9,
  },
  input: {
    bg: mauveDark.mauve3,
    bgHover: mauveDark.mauve5,
    focusRing: blue.blue9,
    errorRing: red.red9,
  },
};

export const lightTheme: typeof darkTheme = {
  overlay: {
    subdued: "rgba(0, 0, 0, 0.4)",
  },
  bg: {
    base: gray.gray1,
    elevated: gray.gray4,
    highlighted: gray.gray7,
    inverted: gray.gray12,
    invertedFocused: gray.gray7,
  },
  badge: {
    secondary: gray.gray7,
  },
  text: {
    neutral: gray.gray12,
    inverted: gray.gray1,
    secondary: gray.gray10,
  },
  icon: {
    secondary: gray.gray10,
    primary: gray.gray12,
  },
  link: {
    primary: blue.blue11,
  },
  input: {
    bg: mauveDark.mauve3,
    bgHover: mauveDark.mauve5,
    focusRing: blue.blue10,
    errorRing: red.red10,
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
};

export const iconSize = {
  md: "24px",
  lg: "32px",
  xl: "48px",
};

// desktop first style media query
export const media = {
  mobile: `@media (max-width: 640px)`,
};

export const shadow = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};
