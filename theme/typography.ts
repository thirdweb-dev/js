import { Theme } from "@chakra-ui/react";
import { css } from "@emotion/react";
import flatten from "flat";
import { pxToRem } from "../utils/pxFunctions";

type ThirdwebFontSizes = {
  display: {
    sm: string;
    md: string;
    lg: string;
  };
  title: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  subtitle: {
    sm: string;
    md: string;
    lg: string;
  };
  label: {
    sm: string;
    md: string;
    lg: string;
  };
  body: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
} & Theme["fontSizes"];

export const chakraFontsizeConfig: ThirdwebFontSizes = {
  xs: "var(--tw-fontsize--body--sm)",
  sm: "var(--tw-fontsize--body--sm)",
  md: "var(--tw-fontsize--body--lg)",
  lg: "var(--tw-fontsize--body--xl)",
  xl: "var(--tw-fontsize--subtitle--sm)",
  "2xl": "var(--tw-fontsize--subtitle--md)",
  "3xl": "var(--tw-fontsize--susbitle--lg)",
  "4xl": "var(--tw-fontsize--title--sm)",
  "5xl": "var(--tw-fontsize--title--md)",
  "6xl": "var(--tw-fontsize--title--lg)",
  "7xl": "var(--tw-fontsize--display--sm)",
  "8xl": "var(--tw-fontsize--display--md)",
  "9xl": "var(--tw-fontsize--display--lg)",
  display: {
    sm: "var(--tw-fontsize--display--sm)",
    md: "var(--tw-fontsize--display--md)",
    lg: "var(--tw-fontsize--display--lg)",
  },
  title: {
    sm: "var(--tw-fontsize--title--sm)",
    md: "var(--tw-fontsize--title--md)",
    lg: "var(--tw-fontsize--title--lg)",
    xl: "var(--tw-fontsize--title--xl)",
  },
  subtitle: {
    sm: "var(--tw-fontsize--subtitle--sm)",
    md: "var(--tw-fontsize--subtitle--md)",
    lg: "var(--tw-fontsize--subtitle--lg)",
  },
  label: {
    sm: "var(--tw-fontsize--label--sm)",
    md: "var(--tw-fontsize--label--md)",
    lg: "var(--tw-fontsize--label--lg)",
  },
  body: {
    sm: "var(--tw-fontsize--body--sm)",
    md: "var(--tw-fontsize--body--md)",
    lg: "var(--tw-fontsize--body--lg)",
    xl: "var(--tw-fontsize--body--xl)",
  },
};

const baseFontSizes = {
  display: {
    sm: pxToRem(24),
    md: pxToRem(28),
    lg: pxToRem(32),
  },
  title: {
    sm: pxToRem(16),
    md: pxToRem(18),
    lg: pxToRem(20),
    xl: pxToRem(24),
  },
  subtitle: {
    sm: pxToRem(14),
    md: pxToRem(16),
    lg: pxToRem(18),
  },
  label: {
    sm: pxToRem(12),
    md: pxToRem(14),
    lg: pxToRem(16),
  },
  body: {
    sm: pxToRem(12),
    md: pxToRem(14),
    lg: pxToRem(16),
    xl: pxToRem(18),
  },
};

const mdFontSizes = {
  display: {
    sm: pxToRem(56),
    md: pxToRem(64),
    lg: pxToRem(72),
  },
  title: {
    sm: pxToRem(20),
    md: pxToRem(24),
    lg: pxToRem(32),
    xl: pxToRem(40),
    "2xl": pxToRem(48),
  },
  subtitle: {
    sm: pxToRem(16),
    md: pxToRem(20),
    lg: pxToRem(24),
  },
  label: {
    sm: pxToRem(12),
    md: pxToRem(14),
    lg: pxToRem(16),
    xl: pxToRem(24),
    "2xl": pxToRem(28),
  },
  body: {
    sm: pxToRem(12),
    md: pxToRem(14),
    lg: pxToRem(16),
    xl: pxToRem(20),
  },
};

function flattenIntoVar(obj: any) {
  const flattened = flatten<any, any>(obj, { delimiter: "--" });
  const flattenedKeys = Object.keys(flattened);
  const flattenedVars = flattenedKeys.reduce((acc, key) => {
    return {
      ...acc,
      [`--tw-fontsize--${key}`.trim()]: `${flattened[key]}`,
    };
  }, {});
  return flattenedVars;
}

export const fontsizeCss = css`
  ${flattenIntoVar(baseFontSizes)};
  @media (min-width: 60em) {
    ${flattenIntoVar(mdFontSizes)};
  }
`;

export const fontWeights = {
  display: 800,
  title: 700,
  subtitle: 500,
  label: 600,
  body: 400,
};

export const lineHeights = {
  display: 1.2,
  title: 1.125,
  subtitle: 1.6,
  label: 1,
  body: 1.6,
};

export const letterSpacings = {
  display: -1.5,
  title: 0.15,
  subtitle: 0.1,
  label: "initial",
  body: "initial",
};
