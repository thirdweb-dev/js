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
