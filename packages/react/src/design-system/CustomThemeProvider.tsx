import { ThemeProvider } from "@emotion/react";
import { Theme, ThemeOptions, darkTheme, lightTheme } from "./index";

export function CustomThemeProvider(props: {
  children: React.ReactNode;
  theme: "light" | "dark";
  themeOptions?: ThemeOptions;
}) {
  const { theme, themeOptions, children } = props;
  const baseTheme = theme === "light" ? lightTheme : darkTheme;
  const themeObj: Theme = { ...baseTheme };

  if (themeOptions) {
    themeObj.colors = {
      ...themeObj.colors,
      ...themeOptions.colors,
    };
  }

  return <ThemeProvider theme={themeObj}>{children}</ThemeProvider>;
}
