export type StyleObject = Partial<CSSStyleDeclaration>;

export interface ICustomizationOptions {
  colorPrimary?: string;
  colorBackground?: string;
  colorText?: string;
  borderRadius?: number;
  fontFamily?: string;

  inputBackgroundColor?: string;
  inputBorderColor?: string;
}
export type CustomizationOptionsType = {
  [key in keyof ICustomizationOptions]: string;
};
export type Locale = "en" | "fr" | "es" | "it" | "de" | "ja" | "ko" | "zh";

export const DEFAULT_BRAND_OPTIONS = {
  colorPrimary: "#cf3781",
  colorBackground: "#ffffff",
  colorText: "#1a202c",
  borderRadius: 12,
  fontFamily: "Open Sans",
};
