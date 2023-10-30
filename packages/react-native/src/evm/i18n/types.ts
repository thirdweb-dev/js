import { _en } from "./en";

export type Locale = LocaleType | "en" | "es" | "jp";

export type LocaleType = typeof _en;
