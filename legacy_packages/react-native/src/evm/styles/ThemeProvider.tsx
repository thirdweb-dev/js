import { darkTheme, lightTheme, Theme } from "./theme";
import { ThemeProvider as ShopifyThemeProvider } from "@shopify/restyle";
import { ThirdwebThemeContext } from "@thirdweb-dev/react-core";
import { PropsWithChildren, useContext } from "react";
import { useColorScheme } from "react-native";
import { useUIContext } from "../providers/ui-context-provider";

export type ThemeType = "dark" | "light" | Theme;

export type ThemeProviderProps = {
  theme?: ThemeType;
};

export function ThemeProvider({
  children,
  theme,
}: PropsWithChildren<ThemeProviderProps>) {
  const isDarkMode = useColorScheme() === "dark";
  const themeFromCore = useContext(ThirdwebThemeContext);
  const themeFromRN = useUIContext().theme;
  const theme_ =
    theme || themeFromRN || themeFromCore || (isDarkMode ? "dark" : "light");
  return (
    <ShopifyThemeProvider
      theme={
        typeof theme_ === "object"
          ? theme_
          : theme_ === "dark"
          ? darkTheme()
          : lightTheme()
      }
    >
      {children}
    </ShopifyThemeProvider>
  );
}
