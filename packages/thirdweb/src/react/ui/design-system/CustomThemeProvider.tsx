import { type Theme, darkThemeObj, lightThemeObj } from "./index.js";
import { createContext, useContext } from "react";

const CustomThemeCtx = /* @__PURE__ */ createContext(darkThemeObj);

/**
 * @internal
 */
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

  return (
    <CustomThemeCtx.Provider value={themeObj}>
      {children}
    </CustomThemeCtx.Provider>
  );
}

/**
 *
 * @internal
 */
export function useCustomTheme() {
  return useContext(CustomThemeCtx);
}
