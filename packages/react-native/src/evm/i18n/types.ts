import { _en } from "./en";

export type Locale = LocaleType | "en" | "es" | "ja" | "tr";

export type LocaleType = typeof _en;
