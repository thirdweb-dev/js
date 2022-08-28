export const lightModeTheme = {
  colors: {
    accent: "#fff",
    background: "#fff",
    text: "#000",
  },
};

export const darkModeTheme: TwUiTheme = {
  colors: {
    accent: "#000",
    background: "#000",
    text: "#fff",
  },
};

export const fontFamily = `SFRounded, ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

export type TwUiTheme = typeof lightModeTheme;

export type ColorMode = "light" | "dark";

export type AccentColor = string;
