"use client";

import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import chakraTheme from "./theme";

export function ChakraProviderSetup(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={chakraTheme}>
      {props.children}
      <SyncTheme />
    </ChakraProvider>
  );
}

function SyncTheme() {
  const { theme, setTheme } = useTheme();
  const { setColorMode } = useColorMode();

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setColorMode(theme === "light" ? "light" : "dark");
  }, [setColorMode, theme]);

  // handle dashboard with now old "system" set
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (theme === "system") {
      setTheme("dark");
      setColorMode("dark");
    }
  }, [theme, setTheme, setColorMode]);

  return null;
}
