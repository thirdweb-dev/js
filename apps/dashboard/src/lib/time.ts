import { differenceInCalendarDays } from "date-fns";
import {
  type Range,
  getLastNDaysRange,
} from "../components/analytics/date-range-selector";

export function normalizeTime(date: Date) {
  const newDate = new Date(date);
  newDate.setHours(1, 0, 0, 0);
  return newDate;
}

export function getNebulaFiltersFromSearchParams(params: {
  from: string | undefined | string[];
  to: string | undefined | string[];
  interval: string | undefined | string[];
}) {
  const fromStr = params.from;
  const toStr = params.to;
  const defaultRange = getLastNDaysRange("last-30");

  const range: Range =
    fromStr && toStr && typeof fromStr === "string" && typeof toStr === "string"
      ? {
          from: normalizeTime(new Date(fromStr)),
          to: normalizeTime(new Date(toStr)),
          type: "custom",
        }
      : {
          from: normalizeTime(defaultRange.from),
          to: normalizeTime(defaultRange.to),
          type: defaultRange.type,
        };

  const defaultInterval =
    differenceInCalendarDays(range.to, range.from) > 30
      ? "week"
      : ("day" as const);

  return {
    range,
    interval:
      params.interval === "day"
        ? ("day" as const)
        : params.interval === "week"
          ? ("week" as const)
          : defaultInterval,
  };
}

export function normalizeTimeISOString(date: Date) {
  return normalizeTime(date).toISOString();
}
