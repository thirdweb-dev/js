import { differenceInDays, format, isValid, parseISO } from "date-fns";

const DATE_TIME_LOCAL_FORMAT = "yyyy-MM-dd HH:mm";

export function toDateTimeLocal(date?: Date | number | string) {
  if (typeof date === "number") {
    date = new Date(date * 1000);
  } else if (typeof date === "string") {
    date = new Date(date);
  }

  return date && isValid(date)
    ? format(date, DATE_TIME_LOCAL_FORMAT)
    : undefined;
}

export function toDateString(date: Date | string | number) {
  return new Date(date).toISOString().split("T")[0];
}

export function withinDays(dateISO: string, days: number) {
  const date = parseISO(dateISO);
  const today = new Date();
  return differenceInDays(today, date) <= days;
}
