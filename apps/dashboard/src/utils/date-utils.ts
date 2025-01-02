import { format } from "date-fns/format";
import { isValid } from "date-fns/isValid";

const DATE_TIME_LOCAL_FORMAT = "yyyy-MM-dd HH:mm";

export function toDateTimeLocal(date?: Date | number | string) {
  let parsedDate: Date | undefined = undefined;
  if (date instanceof Date) {
    parsedDate = date;
  } else if (typeof date === "number") {
    parsedDate = new Date(date * 1000);
  } else if (typeof date === "string") {
    parsedDate = new Date(date);
  }

  return parsedDate && isValid(parsedDate)
    ? format(parsedDate, DATE_TIME_LOCAL_FORMAT)
    : undefined;
}

export function remainingDays(isoDate: string) {
  const currentDate = new Date();
  const targetDate = new Date(isoDate);

  if (targetDate < currentDate) {
    return undefined;
  }

  const timeDifference = targetDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysRemaining;
}
