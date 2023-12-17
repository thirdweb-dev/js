import { green, mauve, mauveDark, tomato } from "@radix-ui/colors";

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

const darkColors: ThemeColors = {
  base1: "hsl(230deg 11.63% 8.43%)",
  base2: "hsl(230deg 11.63% 12%)",
  base3: "hsl(230deg 11.63% 15%)",
  base4: "hsl(230deg 11.63% 17%)",
  primaryText: mauveDark.mauve12,
  secondaryText: mauveDark.mauve10,
  danger: tomato.tomato9,
  success: green.green8,
  overlay: "rgba(0, 0, 0, 0.7)",
  accentText: "#3385FF",
  accentBg: "hsl(216 100% 50%)",
  textOnAccent: mauveDark.mauve12,
};

const lightColors: ThemeColors = {
  base1: mauve.mauve1,
  base2: mauve.mauve3,
  base3: mauve.mauve5,
  base4: mauve.mauve6,
  primaryText: mauve.mauve12,
  secondaryText: mauveDark.mauve9,
  accentText: "hsl(216 100% 45%)",
  success: green.green9,
  danger: tomato.tomato9,
  overlay: "rgba(0, 0, 0, 0.7)",
  accentBg: "hsl(216 100% 50%)",
  textOnAccent: mauve.mauve1,
};

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
    dropdownBg: string;

    tooltipBg: string;
    tooltipText: string;

    inputAutofillBg: string;
    scrollbarBg: string;
    walletSelectorButtonHoverBg: string;

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
      dropdownBg: colors.base1,

      tooltipBg: colors.primaryText,
      tooltipText: colors.base1,

      inputAutofillBg: colors.base2,
      scrollbarBg: colors.base2,
      walletSelectorButtonHoverBg: colors.base2,

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

export type ThemeObjectOrType = "light" | "dark" | Theme;

export type ThemeOverrides = {
  [key in Exclude<keyof Theme, "type">]?: Partial<Theme[key]>;
};

export const fontSize = {
  xs: "12px",
  sm: "14px",
  md: "16px",
  lg: "20px",
  xl: "24px",
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
};

// desktop first style media query
export const media = {
  mobile: `@media (max-width: 640px)`,
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
 *
 * @example
 * ```ts
 * const customTheme = lightTheme({
 *  colors: {
 *   modalBg: "red",
 *  }
 * })
 * ```
 *
 * @theme
 */
export function lightTheme(overrides?: ThemeOverrides): Theme {
  if (!overrides) {
    return lightThemeObj;
  }
  return applyThemeOverrides(lightThemeObj, overrides);
}

/**
 * Create a custom dark theme object by using the default dark theme as a base and applying overrides.
 *
 * @example
 * ```ts
 * const customTheme = darkTheme({
 *  colors: {
 *   modalBg: "red",
 *  }
 * })
 * ```
 *
 * @theme
 */
export function darkTheme(overrides?: ThemeOverrides): Theme {
  if (!overrides) {
    return darkThemeObj;
  }
  return applyThemeOverrides(darkThemeObj, overrides);
}

export function applyThemeOverrides(
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
