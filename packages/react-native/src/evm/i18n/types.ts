import { _en } from "./en";

export type Locale = LocaleType | "en" | "es" | "ja" | "tl";

export type LocaleType = typeof _en;
