export function ignoreTime(date: Date) {
  const newDate = new Date(date);
  newDate.setHours(1, 0, 0, 0);
  return newDate;
}
