import { _en } from "./en";

export type Locale = LocaleType | "en" | "es" | "ja";

export type LocaleType = typeof _en;
