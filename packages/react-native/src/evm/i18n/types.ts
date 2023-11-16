import { _en } from "./en";

export type Locale = LocaleType | "en" | "es" | "ja" | "fil";

export type LocaleType = typeof _en;
