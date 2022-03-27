import { format } from "date-fns";

const DATE_TIME_LOCAL_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

export function toDateTimeLocal(date?: Date) {
  return date ? format(date, DATE_TIME_LOCAL_FORMAT) : undefined;
}
