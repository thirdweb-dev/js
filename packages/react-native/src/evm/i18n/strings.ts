import { DeepPartial } from "../types/deepPartial";
import { Locale, LocaleType, _en, _es } from "./types";

export const setLocale = (locale: Locale): LocaleType => {
  if (typeof locale === "string") {
    if (locale === "es") {
      return es();
    } else if (locale === "en") {
      return en();
    }
  }
  return locale;
};

export const en = (locale?: DeepPartial<LocaleType>): LocaleType => {
  return {
    ..._en,
    ...locale,
  } as LocaleType;
};

export const es = (locale?: DeepPartial<LocaleType>): LocaleType => {
  return {
    ..._es,
    ...locale,
  } as LocaleType;
};
