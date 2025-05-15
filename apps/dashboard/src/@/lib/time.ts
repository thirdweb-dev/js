import { differenceInCalendarDays } from "date-fns";
import {
  type DurationId,
  type Range,
  getLastNDaysRange,
} from "../../components/analytics/date-range-selector";

export function normalizeTime(date: Date) {
  const newDate = new Date(date);
  newDate.setHours(1, 0, 0, 0);
  return newDate;
}

export function normalizeTimeISOString(date: Date) {
  return normalizeTime(date).toISOString();
}

export function getFiltersFromSearchParams(params: {
  from: string | undefined | string[];
  to: string | undefined | string[];
  interval: string | undefined | string[];
  defaultRange: DurationId;
}) {
  const fromStr = params.from;
  const toStr = params.to;
  const defaultRange = getLastNDaysRange(params.defaultRange);

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
    params.interval ??
    (differenceInCalendarDays(range.to, range.from) > 30
      ? ("week" as const)
      : ("day" as const));

  return {
    range,
    interval:
      params.interval === "day"
        ? ("day" as const)
        : params.interval === "week"
          ? ("week" as const)
          : (defaultInterval as "day" | "week"),
  };
}
