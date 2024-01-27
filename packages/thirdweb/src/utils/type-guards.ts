export function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function isObjectWithKeys<key extends string>(
  value: unknown,
  keys: key[] = [],
): value is Record<key, unknown> {
  return isObject(value) && keys.every((key) => key in value);
}
