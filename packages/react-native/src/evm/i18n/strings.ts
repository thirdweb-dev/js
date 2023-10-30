import { DeepPartial, deepMerge } from "../types/deepPartial";
import { _en } from "./en";
import { _es } from "./es";
import { _jp } from "./jp";
import { Locale, LocaleType } from "./types";

export const setLocale = (locale: Locale): LocaleType => {
  if (typeof locale === "string") {
    switch (locale) {
      case "en":
        return _en;
      case "es":
        return _es;
      case "jp":
        return _jp;
      default:
        throw new Error(`Locale ${locale} not supported`);
    }
  }
  return locale;
};

export const en = (locale?: DeepPartial<LocaleType>): LocaleType => {
  if (!locale) {
    return _en;
  }
  return deepMerge(_en, locale);
};

export const jp = (locale?: DeepPartial<LocaleType>): LocaleType => {
  if (!locale) {
    return _jp;
  }
  return deepMerge(_jp, locale);
};

export const es = (locale?: DeepPartial<LocaleType>): LocaleType => {
  if (!locale) {
    return _es;
  }
  return deepMerge(_es, locale);
};
