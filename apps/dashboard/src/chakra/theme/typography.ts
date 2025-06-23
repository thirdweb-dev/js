export const fontWeights = {
  body: 400,
  display: 800,
  label: 600,
  subtitle: 500,
  title: 700,
} as const;

export const lineHeights = {
  body: 1.6,
  display: 1.2,
  label: 1,
  subtitle: 1.6,
  title: 1.125,
} as const;

export const letterSpacings = {
  body: "initial",
  display: -1.5,
  label: "initial",
  subtitle: 0.1,
  title: 0.15,
} as const;

type TypographyBase = "display" | "title" | "subtitle" | "label" | "body";
export type TypographySize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

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
