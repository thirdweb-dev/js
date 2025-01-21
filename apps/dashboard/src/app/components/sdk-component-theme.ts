import {
  type Theme,
  type ThemeOverrides,
  darkTheme,
  lightTheme,
} from "thirdweb/react";

export function getSDKTheme(theme: "light" | "dark"): Theme {
  const overrides: ThemeOverrides = {
    colors: {
      modalBg: "hsl(var(--card))",
      borderColor: "hsl(var(--border))",
      connectedButtonBg: "hsl(var(--card))",
      connectedButtonBgHover: "hsl(var(--accent))",
      tertiaryBg: "hsl(var(--muted)/50%)",
      secondaryButtonBg: "hsl(var(--secondary))",
      secondaryButtonHoverBg: "hsl(var(--secondary)/80%)",
      inputAutofillBg: "hsl(var(--muted))",
      secondaryIconHoverBg: "hsl(var(--accent))",
      separatorLine: "hsl(var(--border))",
      skeletonBg: "hsl(var(--muted))",
      scrollbarBg: "hsl(var(--muted))",
      secondaryText: "hsl(var(--muted-foreground))",
      primaryText: "hsl(var(--foreground))",
      accentText: "hsl(var(--link-foreground))",
      accentButtonBg: "hsl(var(--primary))",
      accentButtonText: "hsl(var(--primary-foreground))",
      primaryButtonBg: "hsl(var(--background))",
      primaryButtonText: "hsl(var(--foreground))",
      secondaryButtonText: "hsl(var(--secondary-foreground))",
      tooltipBg: "hsl(var(--popover))",
      tooltipText: "hsl(var(--popover-foreground))",
      secondaryIconColor: "hsl(var(--secondary-foreground))",
      secondaryIconHoverColor: "hsl(var(--foreground))",
      selectedTextBg: "hsl(var(--inverted))",
      selectedTextColor: "hsl(var(--inverted-foreground))",
      danger: "hsl(var(--destructive-text))",
      success: "hsl(var(--success-text))",
    },
  };

  return theme === "light" ? lightTheme(overrides) : darkTheme(overrides);
}
