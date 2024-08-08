"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { useEffect } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function useForceDarkTheme() {
  const { setTheme } = useTheme();

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);
}
