import { DeepPartial, deepMerge } from "../types/deepPartial";
import { _en } from "./en";
import { _es } from "./es";
import { _fil } from "./fil";
import { _ja } from "./ja";
import { Locale, LocaleType } from "./types";

export const setLocale = (locale: Locale): LocaleType => {
  if (typeof locale === "string") {
    switch (locale) {
      case "en":
        return _en;
      case "es":
        return _es;
      case "ja":
        return _ja;
      case "fil":
        return _fil;
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

export const es = (locale?: DeepPartial<LocaleType>): LocaleType => {
  if (!locale) {
    return _es;
  }
  return deepMerge(_es, locale);
};

export const ja = (locale?: DeepPartial<LocaleType>): LocaleType => {
  if (!locale) {
    return _ja;
  }
  return deepMerge(_ja, locale);
};

export const fil = (locale?: DeepPartial<LocaleType>): LocaleType => {
  if (!locale) {
    return _fil;
  }
  return deepMerge(_fil, locale);
};
