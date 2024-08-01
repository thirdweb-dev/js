import {
  type Theme,
  type ThemeOverrides,
  darkTheme,
  lightTheme,
} from "thirdweb/react";

export function getSDKTheme(theme: "light" | "dark"): Theme {
  const overrides: ThemeOverrides = {
    colors: {
      modalBg: "hsl(var(--background))",
      borderColor: "hsl(var(--border))",
      connectedButtonBg: "hsl(var(--background))",
      connectedButtonBgHover: "hsl(var(--muted))",
      tertiaryBg: "hsl(var(--muted))",
      secondaryButtonBg: "hsl(var(--muted))",
      secondaryButtonHoverBg: "hsl(var(--accent))",
      inputAutofillBg: "hsl(var(--muted))",
      secondaryIconHoverBg: "hsl(var(--accent))",
      separatorLine: "hsl(var(--border))",
      skeletonBg: "hsl(var(--muted))",
    },
  };

  return theme === "light" ? lightTheme(overrides) : darkTheme(overrides);
}
