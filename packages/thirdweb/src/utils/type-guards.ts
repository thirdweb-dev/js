/**
 * Checks if a value is an object.
 * @param value - The value to check.
 * @returns True if the value is an object, false otherwise.
 * @internal
 */
export function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

/**
 * Checks if a value is an object with specified keys.
 * @param value - The value to check.
 * @param keys - The keys to check for in the object. Defaults to an empty array.
 * @returns True if the value is an object with the specified keys, false otherwise.
 * @internal
 */
export function isObjectWithKeys<key extends string>(
  value: unknown,
  keys: key[] = [],
): value is Record<key, unknown> {
  return isObject(value) && keys.every((key) => key in value);
}
