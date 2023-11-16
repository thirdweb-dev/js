import { Theme, darkThemeObj, lightThemeObj } from "./index";
import { createContext, useContext } from "react";

const CustomThemeCtx = /* @__PURE__ */ createContext(darkThemeObj);

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

export function useCustomTheme() {
  return useContext(CustomThemeCtx);
}
