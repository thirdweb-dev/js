import { toBigInt } from "./bigint.js";

/**
 * @internal
 */
export function tenYearsFromNow() {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10); // 10 years
}

/**
 * @internal
 */
export function dateToSeconds(date: Date) {
  return toBigInt(Math.floor(date.getTime() / 1000));
}
