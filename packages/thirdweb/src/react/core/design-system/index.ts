type ThemeColors = {
  base1: string;
  base2: string;
  base3: string;
  base4: string;
  primaryText: string;
  secondaryText: string;
  danger: string;
  success: string;
  overlay: string;
  accentText: string;
  accentBg: string;
  textOnAccent: string;
};

const darkColors = {
  base1: "hsl(230 11.63% 8.43%)",
  base2: "hsl(230 11.63% 12%)",
  base3: "hsl(230 11.63% 15%)",
  base4: "hsl(230 11.63% 17%)",
  primaryText: "#eeeef0",
  secondaryText: "#7c7a85",
  danger: "#e5484D",
  success: "#30A46C",
  overlay: "rgba(0, 0, 0, 0.7)",
  accentText: "#3385FF",
  accentBg: "hsl(216 100% 50%)",
  textOnAccent: "#eeeef0",
} as const satisfies ThemeColors;

const lightColors = {
  base1: "#fdfcfd",
  base2: "#f2eff3",
  base3: "#e3dfe6",
  base4: "#dbd8e0",
  primaryText: "#211f26",
  secondaryText: "#6f6d78",
  accentText: "hsl(216 100% 45%)",
  success: "#30A46C",
  danger: "#e5484D",
  overlay: "rgba(0, 0, 0, 0.7)",
  accentBg: "hsl(216 100% 50%)",
  textOnAccent: "#fdfcfd",
} as const satisfies ThemeColors;

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

/**
 * @internal
 */
function createThemeObj(colors: ThemeColors): Theme {
  return {
    type: "dark" as "light" | "dark",
    colors: {
      primaryText: colors.primaryText,
      secondaryText: colors.secondaryText,
      accentText: colors.accentText,

      danger: colors.danger,
      success: colors.success,

      modalOverlayBg: colors.overlay,

      accentButtonBg: colors.accentBg,
      accentButtonText: colors.textOnAccent,

      primaryButtonBg: colors.primaryText,
      primaryButtonText: colors.base1,

      secondaryButtonBg: colors.base3,
      secondaryButtonText: colors.primaryText,
      secondaryButtonHoverBg: colors.base4,

      modalBg: colors.base1,

      tooltipBg: colors.primaryText,
      tooltipText: colors.base1,

      inputAutofillBg: colors.base1,
      scrollbarBg: colors.base2,
      tertiaryBg: colors.base2,

      separatorLine: colors.base4,

      secondaryIconColor: colors.secondaryText,
      secondaryIconHoverBg: colors.base3,
      secondaryIconHoverColor: colors.primaryText,

      borderColor: colors.base4,
      skeletonBg: colors.base3,

      selectedTextColor: colors.base1,
      selectedTextBg: colors.primaryText,

      connectedButtonBg: colors.base1,
      connectedButtonBgHover: colors.base2,
    },
    fontFamily: "inherit",
  };
}

export const darkThemeObj = /* @__PURE__ */ createThemeObj(darkColors);
export const lightThemeObj = /* @__PURE__ */ createThemeObj(lightColors);

/**
 * @theme
 */
export type ThemeOverrides = {
  [key in Exclude<keyof Theme, "type">]?: Partial<Theme[key]>;
};

export const fontSize = {
  xs: "12px",
  sm: "14px",
  md: "16px",
  lg: "20px",
  xl: "24px",
  xxl: "32px",
  "3xl": "48px",
};

export const spacing = {
  xxs: "6px",
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
  "3xl": "64px",
};

export const radius = {
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "20px",
  xxl: "32px",
};

export const iconSize = {
  xs: "12",
  sm: "16",
  md: "24",
  lg: "32",
  xl: "48",
  xxl: "64",
  "3xl": "96",
  "4xl": "128",
};

// desktop first style media query
export const media = {
  mobile: "@media (max-width: 640px)",
};

// TODO - move to theme
export const shadow = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
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
