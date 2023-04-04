import { format, isValid } from "date-fns";

const DATE_TIME_LOCAL_FORMAT = "yyyy-MM-dd'T'HH:mm";

export function toDateTimeLocal(date?: Date | number) {
  if (typeof date === "number") {
    date = new Date(date * 1000);
  };

  return date && isValid(date)
    ? format(date, DATE_TIME_LOCAL_FORMAT)
    : undefined;
}
