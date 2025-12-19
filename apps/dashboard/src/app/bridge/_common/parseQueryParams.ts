import { isAddress } from "thirdweb";

export function parseQueryParams<T>(
  value: string | string[] | undefined,
  fn: (value: string) => T | undefined,
): T | undefined {
  if (typeof value === "string") {
    return fn(value);
  }
  return undefined;
}

export const onlyAddress = (v: string) => (isAddress(v) ? v : undefined);
export const onlyNumber = (v: string) =>
  Number.isNaN(Number(v)) ? undefined : Number(v);
