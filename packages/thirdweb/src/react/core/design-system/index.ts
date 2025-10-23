/**
 * @theme
 */
export type Theme = {
  type: "light" | "dark";
  colors: {
    primaryText: string;
    secondaryText: string;
    accentText: string;

    danger: string;
    success: string;

    modalOverlayBg: string;

    accentButtonBg: string;
    accentButtonText: string;

    primaryButtonBg: string;
    primaryButtonText: string;

    secondaryButtonBg: string;
    secondaryButtonText: string;
    secondaryButtonHoverBg: string;

    modalBg: string;

    tooltipBg: string;
    tooltipText: string;

    inputAutofillBg: string;
    scrollbarBg: string;
    tertiaryBg: string;

    separatorLine: string;

    secondaryIconColor: string;
    secondaryIconHoverBg: string;
    secondaryIconHoverColor: string;

    borderColor: string;
    skeletonBg: string;

    selectedTextColor: string;
    selectedTextBg: string;

    connectedButtonBg: string;
    connectedButtonBgHover: string;
  };
  fontFamily: string;
};

export const darkThemeObj: Theme = {
  type: "dark",
  colors: {
    accentButtonBg: "hsl(221 83% 54%)",
    accentButtonText: "hsl(0 0% 100%)",
    accentText: "hsl(209.61deg 100% 65.31%)",
    borderColor: "hsl(0 0% 15%)",
    connectedButtonBg: "hsl(0 0% 3.92%)",
    connectedButtonBgHover: "hsl(0 0% 11%)",
    danger: "hsl(360 72% 55%)",
    inputAutofillBg: "hsl(0 0% 11%)",
    modalBg: "hsl(0 0% 3.92%)",
    primaryButtonBg: "hsl(0 0% 100%)",
    primaryButtonText: "hsl(0 0% 0%)",
    primaryText: "hsl(0 0% 98%)",
    scrollbarBg: "hsl(0 0% 11%)",
    secondaryButtonBg: "hsl(0 0% 9%)",
    modalOverlayBg: "rgba(0, 0, 0, 0.7)",
    secondaryButtonHoverBg: "hsl(0 0% 9%/80%)",
    secondaryButtonText: "hsl(0 0% 98%)",
    secondaryIconColor: "hsl(0 0% 63%)",
    secondaryIconHoverBg: "hsl(0 0% 11%)",
    secondaryIconHoverColor: "hsl(0 0% 98%)",
    secondaryText: "hsl(0 0% 63%)",
    selectedTextBg: "hsl(0 0% 100%)",
    selectedTextColor: "hsl(0 0% 0%)",
    separatorLine: "hsl(0 0% 15%)",
    skeletonBg: "hsl(0 0% 12%)",
    success: "hsl(142 75% 50%)",
    tertiaryBg: "hsl(0 0% 11%/50%)",
    tooltipBg: "hsl(0 0% 11%)",
    tooltipText: "hsl(0 0% 98%)",
  },
  fontFamily: "inherit",
};

export const lightThemeObj: Theme = {
  type: "light",
  colors: {
    accentButtonBg: "hsl(221 83% 54%)",
    accentButtonText: "hsl(0 0% 100%)",
    accentText: "hsl(211.23deg 100% 44.47%)",
    borderColor: "hsl(0 0% 85%)",
    connectedButtonBg: "hsl(0 0% 100%)",
    connectedButtonBgHover: "hsl(0 0% 93%)",
    danger: "hsl(360 72% 60%)",
    inputAutofillBg: "hsl(0 0% 93%)",
    modalBg: "hsl(0 0% 100%)",
    primaryButtonBg: "hsl(0 0% 4%)",
    primaryButtonText: "hsl(0 0% 100%)",
    primaryText: "hsl(0 0% 4%)",
    scrollbarBg: "hsl(0 0% 93%)",
    secondaryButtonBg: "hsl(0 0% 93%)",
    modalOverlayBg: "rgba(0, 0, 0, 0.7)",
    secondaryButtonHoverBg: "hsl(0 0% 93%/80%)",
    secondaryButtonText: "hsl(0 0% 4%)",
    secondaryIconColor: "hsl(0 0% 40%)",
    secondaryIconHoverBg: "hsl(0 0% 93%)",
    secondaryIconHoverColor: "hsl(0 0% 4%)",
    secondaryText: "hsl(0 0% 40%)",
    selectedTextBg: "hsl(0 0% 4%)",
    selectedTextColor: "hsl(0 0% 100%)",
    separatorLine: "hsl(0 0% 85%)",
    skeletonBg: "hsl(0 0% 85%)",
    success: "hsl(142.09 70.56% 35.29%)",
    tertiaryBg: "hsl(0 0% 93%/70%)",
    tooltipBg: "hsl(0 0% 100%)",
    tooltipText: "hsl(0 0% 4%)",
  },
  fontFamily: "inherit",
};

/**
 * @theme
 */
export type ThemeOverrides = {
  [key in Exclude<keyof Theme, "type">]?: Partial<Theme[key]>;
};

export const fontSize = {
  "3xl": "48px",
  lg: "20px",
  md: "16px",
  sm: "14px",
  xl: "24px",
  xs: "12px",
  xxl: "32px",
};

export const spacing = {
  "3xl": "64px",
  "3xs": "4px",
  "4xs": "2px",
  lg: "24px",
  md: "16px",
  "md+": "20px",
  sm: "12px",
  xl: "32px",
  xs: "8px",
  xxl: "48px",
  xxs: "6px",
};

export const radius = {
  lg: "12px",
  md: "8px",
  sm: "6px",
  xl: "20px",
  xs: "4px",
  xxl: "32px",
  full: "9999px",
};

export const iconSize = {
  "3xl": "96",
  "4xl": "128",
  lg: "32",
  md: "24",
  "sm+": "20",
  sm: "16",
  xl: "48",
  xs: "12",
  xxl: "64",
};

// desktop first style media query
export const media = {
  mobile: "@media (max-width: 640px)",
};

// TODO - move to theme
export const shadow = {
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};

/**
 * Create a custom light theme object by using the default dark theme as a base and applying overrides.
 * @example
 * ### Get the default light theme
 * ```ts
 * const defaultLightTheme = lightTheme()
 * ```
 *
 * ### Create a custom light theme
 * ```ts
 * const customTheme = lightTheme({
 *   colors: {
 *     modalBg: "red",
 *   },
 * });
 * ```
 * @param overrides - The overrides to apply to the default light theme.
 * @theme
 * @returns Theme object
 */
export function lightTheme(overrides?: ThemeOverrides): Theme {
  if (!overrides) {
    return lightThemeObj;
  }
  return applyThemeOverrides(lightThemeObj, overrides);
}

/**
 * Create a custom dark theme object by using the default dark theme as a base and applying overrides.
 * @example
 * ### Get the default dark theme
 * ```ts
 * const defaultDarkTheme = darkTheme()
 * ```
 *
 * ### Create a custom dark theme
 * ```ts
 * const customTheme = darkTheme({
 *   colors: {
 *     modalBg: "red",
 *   },
 * });
 * ```
 * @param overrides - The overrides to apply to the default dark theme.
 * @theme
 * @returns Theme object
 */
export function darkTheme(overrides?: ThemeOverrides): Theme {
  if (!overrides) {
    return darkThemeObj;
  }
  return applyThemeOverrides(darkThemeObj, overrides);
}

/**
 * @internal
 */
function applyThemeOverrides(
  baseTheme: Theme,
  themeOverrides: ThemeOverrides,
): Theme {
  const theme = { ...baseTheme };

  if (themeOverrides.colors) {
    theme.colors = { ...theme.colors, ...themeOverrides.colors };
  }

  if (themeOverrides.fontFamily) {
    theme.fontFamily = themeOverrides.fontFamily;
  }

  return theme;
}
