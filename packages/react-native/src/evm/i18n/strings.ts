import { DeepPartial, deepMerge } from "../types/deepPartial";
import { Locale, LocaleType, _en, _es } from "./types";

export const setLocale = (locale: Locale): LocaleType => {
  if (typeof locale === "string") {
    if (locale === "en") {
      return en();
    }

    throw new Error(`Locale ${locale} not supported`);
  }
  return locale;
};

export const en = (locale?: DeepPartial<LocaleType>): LocaleType => {
  if (!locale) {
    return _en;
  }
  return deepMerge(_en, locale);
};

export const es = (locale?: DeepPartial<LocaleType>): LocaleType => {
  if (!locale) {
    return _es;
  }
  return deepMerge(_es, locale);
};
