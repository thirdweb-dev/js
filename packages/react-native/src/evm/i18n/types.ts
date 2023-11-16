import { _en } from "./en";

/**
 * ISO 639-1: two-letter codes: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */
export type Locale = LocaleType | "en" | "es" | "ja" | "tr";

export type LocaleType = typeof _en;
