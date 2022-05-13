import { pxToRem } from "../utils/pxFunctions";

export const baseFontSizes = {
  display: {
    sm: pxToRem(24),
    md: pxToRem(28),
    lg: pxToRem(32),
    xl: pxToRem(36),
    "2xl": pxToRem(40),
  },
  title: {
    sm: pxToRem(16),
    md: pxToRem(18),
    lg: pxToRem(20),
    xl: pxToRem(24),
    "2xl": pxToRem(28),
  },
  subtitle: {
    sm: pxToRem(14),
    md: pxToRem(16),
    lg: pxToRem(18),
    xl: pxToRem(20),
    "2xl": pxToRem(24),
  },
  label: {
    sm: pxToRem(12),
    md: pxToRem(14),
    lg: pxToRem(16),
    xl: pxToRem(18),
    "2xl": pxToRem(20),
  },
  body: {
    sm: pxToRem(12),
    md: pxToRem(14),
    lg: pxToRem(16),
    xl: pxToRem(18),
    "2xl": pxToRem(20),
  },
} as const;

export type FontSizeRecord = typeof baseFontSizes;

export const mdFontSizes: FontSizeRecord = {
  display: {
    sm: pxToRem(56),
    md: pxToRem(64),
    lg: pxToRem(72),
    xl: pxToRem(80),
    "2xl": pxToRem(88),
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
    xl: pxToRem(28),
    "2xl": pxToRem(32),
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
    "2xl": pxToRem(24),
  },
};

export const fontWeights = {
  display: 800,
  title: 700,
  subtitle: 500,
  label: 600,
  body: 400,
} as const;

export const lineHeights = {
  display: 1.2,
  title: 1.125,
  subtitle: 1.6,
  label: 1,
  body: 1.6,
} as const;

export const letterSpacings = {
  display: -1.5,
  title: 0.15,
  subtitle: 0.1,
  label: "initial",
  body: "initial",
} as const;

export type TypographyBase =
  | "display"
  | "title"
  | "subtitle"
  | "label"
  | "body";
export type TypographySize = "sm" | "md" | "lg" | "xl" | "2xl";

export type TypographyFontSize = `${TypographyBase}.${TypographySize}`;

export type HeadingBase = Exclude<TypographyBase, "body">;

export type HeadingSizes = `${HeadingBase}.${TypographySize}`;

export type TextBase = Exclude<
  TypographyBase,
  "display" | "title" | "subtitle"
>;

export type TextSizes = `${TextBase}.${TypographySize}`;

export type LabelBase = Exclude<
  TypographyBase,
  "display" | "title" | "subtitle" | "body"
>;

export type LabelSizes = `${LabelBase}.${TypographySize}`;

export type BodyBase = Exclude<
  TypographyBase,
  "display" | "title" | "subtitle" | "label"
>;

export type BodySizes = `${BodyBase}.${TypographySize}`;
