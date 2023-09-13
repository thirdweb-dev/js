import { ThemeProvider } from "@emotion/react";
import { Theme, darkThemeObj, lightThemeObj } from "./index";

export function CustomThemeProvider(props: {
  children: React.ReactNode;
  theme: "light" | "dark" | Theme;
}) {
  const { theme, children } = props;
  let themeObj: Theme;

  if (typeof theme === "string") {
    themeObj = theme === "light" ? lightThemeObj : darkThemeObj;
  } else {
    themeObj = theme;
  }

  return <ThemeProvider theme={themeObj}>{children}</ThemeProvider>;
}
