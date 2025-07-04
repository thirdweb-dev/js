import { parseAsString, parseAsStringEnum } from "nuqs/server";

export const searchParams = {
  addons: parseAsString.withDefault(""),
  freq: parseAsStringEnum(["monthly", "annual"]).withDefault("monthly"),
};
