import { format, isValid } from "date-fns";

const DATE_TIME_LOCAL_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

export function toDateTimeLocal(date?: Date) {
  return date && isValid(date)
    ? format(date, DATE_TIME_LOCAL_FORMAT)
    : undefined;
}
