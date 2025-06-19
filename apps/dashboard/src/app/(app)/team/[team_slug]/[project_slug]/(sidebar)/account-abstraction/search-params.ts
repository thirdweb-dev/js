import { getLastNDaysRange } from "components/analytics/date-range-selector";
import { createLoader, parseAsIsoDate, parseAsStringEnum } from "nuqs/server";

export const searchParams = {
  range: parseAsStringEnum([
    "last-120",
    "last-60",
    "last-30",
    "last-7",
    "custom",
  ]).withDefault("last-120"),
  from: parseAsIsoDate.withDefault(getLastNDaysRange("last-120").from),
  to: parseAsIsoDate.withDefault(getLastNDaysRange("last-120").to),
  interval: parseAsStringEnum(["day", "week"]).withDefault("week"),
};

export const searchParamLoader = createLoader(searchParams);
