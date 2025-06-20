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
  accentBg: "hsl(216 100% 50%)",
  accentText: "#3385FF",
  base1: "hsl(230 11.63% 8.43%)",
  base2: "hsl(230 11.63% 12%)",
  base3: "hsl(230 11.63% 15%)",
  base4: "hsl(230 11.63% 17%)",
  danger: "#e5484D",
  overlay: "rgba(0, 0, 0, 0.7)",
  primaryText: "#eeeef0",
  secondaryText: "#7c7a85",
  success: "#30A46C",
  textOnAccent: "#eeeef0",
} as const satisfies ThemeColors;

const lightColors = {
  accentBg: "hsl(216 100% 50%)",
  accentText: "#3385FF",
  base1: "#fdfcfd",
  base2: "#f2eff3",
  base3: "#e3dfe6",
  base4: "#dbd8e0",
  danger: "#e5484D",
  overlay: "rgba(0, 0, 0, 0.7)",
  primaryText: "#211f26",
  secondaryText: "#6f6d78",
  success: "#30A46C",
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
function createThemeObj(type: "dark" | "light", colors: ThemeColors): Theme {
  return {
    colors: {
      accentButtonBg: colors.accentBg,
      accentButtonText: colors.textOnAccent,
      accentText: colors.accentText,

      borderColor: colors.base4,

      connectedButtonBg: colors.base1,
      connectedButtonBgHover: colors.base2,

      danger: colors.danger,

      inputAutofillBg: colors.base1,

      modalBg: colors.base1,

      modalOverlayBg: colors.overlay,

      primaryButtonBg: colors.primaryText,
      primaryButtonText: colors.base1,
      primaryText: colors.primaryText,
      scrollbarBg: colors.base2,

      secondaryButtonBg: colors.base3,
      secondaryButtonHoverBg: colors.base4,
      secondaryButtonText: colors.primaryText,

      secondaryIconColor: colors.secondaryText,
      secondaryIconHoverBg: colors.base3,
      secondaryIconHoverColor: colors.primaryText,
      secondaryText: colors.secondaryText,
      selectedTextBg: colors.primaryText,

      selectedTextColor: colors.base1,

      separatorLine: colors.base4,
      skeletonBg: colors.base3,
      success: colors.success,
      tertiaryBg: colors.base2,

      tooltipBg: colors.primaryText,
      tooltipText: colors.base1,
    },
    fontFamily: "inherit",
    type,
  };
}

export const darkThemeObj = /* @__PURE__ */ createThemeObj("dark", darkColors);
export const lightThemeObj = /* @__PURE__ */ createThemeObj(
  "light",
  lightColors,
);

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
};

export const iconSize = {
  "3xl": "96",
  "4xl": "128",
  lg: "32",
  md: "24",
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
