import { DeepPartial, deepMerge } from "../types/deepPartial";
import { _en } from "./en";
import { _es } from "./es";
import { _tl } from "./tl";
import { _ja } from "./ja";
import { _tr } from "./tr";
import { Locale, LocaleType } from "./types";

const locales = { en: _en, es: _es, ja: _ja, tl: _tl, tr: _tr };

/**
 * @internal
 */
export const setLocale = (locale: Locale): LocaleType => {
  if (typeof locale === "string") {
    const selectedLocale = locales[locale];
    if (!selectedLocale) {
      throw new Error(`Locale ${locale} not supported`);
    }
    return selectedLocale;
  }
  return locale;
};

/**
 * @internal
 */
export const getLocale = (
  localeKey: keyof typeof locales,
  locale?: DeepPartial<LocaleType>,
): LocaleType => {
  const defaultLocale = locales[localeKey];
  if (!locale) {
    return defaultLocale;
  }
  return deepMerge(defaultLocale, locale);
};

export const en = (locale?: DeepPartial<LocaleType>) => getLocale("en", locale);
export const es = (locale?: DeepPartial<LocaleType>) => getLocale("es", locale);
export const ja = (locale?: DeepPartial<LocaleType>) => getLocale("ja", locale);
export const tl = (locale?: DeepPartial<LocaleType>) => getLocale("tl", locale);
export const tr = (locale?: DeepPartial<LocaleType>) => getLocale("tr", locale);
