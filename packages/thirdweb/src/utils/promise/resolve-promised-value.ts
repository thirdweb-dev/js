/**
 * Resolves a possibly asynchronous value.
 * If the value is a function that returns a promise, it will be awaited and the resolved value will be returned.
 * Otherwise, the value itself will be returned.
 *
 * @param value - The value to resolve.
 * @returns A promise that resolves to the resolved value.
 * @internal
 */
export async function resolvePromisedValue<V>(
  value: V,
): Promise<V extends () => Promise<infer R> ? R : V> {
  return typeof value === "function" ? await value() : value;
}

export type PromisedValue<T> = T | (() => Promise<T>);
