"use client";
import { createContext, useContext } from "react";
import { type Theme, darkThemeObj, lightThemeObj } from "./index.js";

const CustomThemeCtx = /* @__PURE__ */ createContext(darkThemeObj);

/**
 * @internal
 */
export function CustomThemeProvider(props: {
  children: React.ReactNode;
  theme: "light" | "dark" | Theme;
}) {
  const { theme, children } = props;
  const themeObj = parseTheme(theme);

  return (
    <CustomThemeCtx.Provider value={themeObj}>
      {children}
    </CustomThemeCtx.Provider>
  );
}

export function parseTheme(theme: "light" | "dark" | Theme | undefined): Theme {
  if (!theme) {
    return darkThemeObj;
  }

  let themeObj: Theme;

  if (typeof theme === "string") {
    themeObj = theme === "light" ? lightThemeObj : darkThemeObj;
  } else {
    themeObj = theme;
  }

  return themeObj;
}

/**
 *
 * @internal
 */
export function useCustomTheme() {
  return useContext(CustomThemeCtx);
}
