import { getLastNDaysRange } from "components/analytics/date-range-selector";
import { createLoader, parseAsIsoDate, parseAsStringEnum } from "nuqs/server";

export const searchParams = {
  from: parseAsIsoDate.withDefault(getLastNDaysRange("last-120").from),
  interval: parseAsStringEnum(["day", "week"]).withDefault("week"),
  range: parseAsStringEnum([
    "last-120",
    "last-60",
    "last-30",
    "last-7",
    "custom",
  ]).withDefault("last-120"),
  to: parseAsIsoDate.withDefault(getLastNDaysRange("last-120").to),
};

export const searchParamLoader = createLoader(searchParams);
