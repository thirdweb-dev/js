import {
  darkTheme,
  lightTheme,
  type Theme,
  type ThemeOverrides,
} from "thirdweb/react";

export function getSDKTheme(theme: "light" | "dark"): Theme {
  const overrides: ThemeOverrides = {
    colors: {
      accentButtonBg: "hsl(var(--primary))",
      accentButtonText: "hsl(var(--primary-foreground))",
      accentText: "hsl(var(--link-foreground))",
      borderColor: "hsl(var(--border))",
      connectedButtonBg: "hsl(var(--card))",
      connectedButtonBgHover: "hsl(var(--accent))",
      danger: "hsl(var(--destructive-text))",
      inputAutofillBg: "hsl(var(--muted))",
      modalBg: "hsl(var(--card))",
      primaryButtonBg: "hsl(var(--inverted))",
      primaryButtonText: "hsl(var(--inverted-foreground))",
      primaryText: "hsl(var(--foreground))",
      scrollbarBg: "hsl(var(--muted))",
      secondaryButtonBg: "hsl(var(--secondary))",
      secondaryButtonHoverBg: "hsl(var(--secondary)/80%)",
      secondaryButtonText: "hsl(var(--secondary-foreground))",
      secondaryIconColor: "hsl(var(--secondary-foreground))",
      secondaryIconHoverBg: "hsl(var(--accent))",
      secondaryIconHoverColor: "hsl(var(--foreground))",
      secondaryText: "hsl(var(--muted-foreground))",
      selectedTextBg: "hsl(var(--inverted))",
      selectedTextColor: "hsl(var(--inverted-foreground))",
      separatorLine: "hsl(var(--border))",
      skeletonBg: "hsl(var(--secondary-foreground)/15%)",
      success: "hsl(var(--success-text))",
      tertiaryBg: "hsl(var(--muted)/30%)",
      tooltipBg: "hsl(var(--popover))",
      tooltipText: "hsl(var(--popover-foreground))",
    },
  };

  return theme === "light" ? lightTheme(overrides) : darkTheme(overrides);
}
