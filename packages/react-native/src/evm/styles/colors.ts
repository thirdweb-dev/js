export type Palette = {
  background: string;
  backgroundHighlight: string;

  textPrimary: string;
  textSecondary: string;

  iconPrimary: string;
  iconSecondary: string;
  iconHighlight: string;

  warning: string;

  linkPrimary: string;

  border: string;

  black: string;
  white: string;
};

export const paletteBase = {
  black: "black",
  white: "white",
  warning: "#F46565",
};

export const paletteLight: Palette = {
  background: "#F7F7F9",
  backgroundHighlight: "#FFFFFF",

  textPrimary: "#313640",
  textSecondary: "#6B7A8E",

  iconPrimary: "#646D7A",
  iconSecondary: "#8E99A8",
  iconHighlight: "#646D7A",

  linkPrimary: "#3385FF",

  border: "#CBD2DB",
  ...paletteBase,
};

export const paletteDark: Palette = {
  background: "#131417",
  backgroundHighlight: "#232429",

  textPrimary: "#F1F1F1",
  textSecondary: "#646D7A",

  iconPrimary: "#646D7A",
  iconSecondary: "#F1F1F1",
  iconHighlight: "#FF8181",

  linkPrimary: "#3385FF",

  border: "#2E3339",
  ...paletteBase,
};
