"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { useForceDarkTheme } from "@/components/theme-provider";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";
import { useTheme } from "next-themes";
import {
  IBM_Plex_Mono as ibmPlexMonoConstructor,
  Inter as interConstructor,
} from "next/font/google";
import { useEffect } from "react";
import { generateBreakpointTypographyCssVars } from "tw-components/utils/typography";
import chakraTheme from "../../theme";

const inter = interConstructor({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

const ibmPlexMono = ibmPlexMonoConstructor({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Consolas", "Courier New", "monospace"],
});

const fontSizeCssVars = generateBreakpointTypographyCssVars();

const chakraThemeWithFonts = {
  ...chakraTheme,
  fonts: {
    ...chakraTheme.fonts,
    heading: inter.style.fontFamily,
    body: inter.style.fontFamily,
    mono: ibmPlexMono.style.fontFamily,
  },
};

export function LandingPageThemeProvider(props: {
  children: React.ReactNode;
}) {
  return (
    <TailwindTheme>
      <Global
        styles={css`
              #walletconnect-wrapper {
                color: #000;
              }
              .walletconnect-search__input::placeholder {
                color: inherit;
                opacity: 0.7;
              }
              ${fontSizeCssVars}

              .emoji {
                height: 1em;
                width: 1em;
                margin: 0 0.05em 0 0.1em;
                vertical-align: -0.1em;
                display: inline;
              }
              body {
                font-variant-ligatures: none !important;
              }
              .chakra-checkbox__control > div > svg {
                font-size: 10px !important;
              }
            `}
      />
      <ChakraProvider theme={chakraThemeWithFonts}>
        {props.children}
        <ForceDarkTheme />
        <SyncTheme />
      </ChakraProvider>
    </TailwindTheme>
  );
}

function TailwindTheme(props: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      enableSystem={false}
      defaultTheme="dark"
    >
      {props.children}
    </ThemeProvider>
  );
}

const SyncTheme: React.FC = () => {
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
};

function ForceDarkTheme() {
  useForceDarkTheme();
  return null;
}
