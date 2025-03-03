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
  // @ts-expect-error - this works fine, but TS doesn't like it since 5.8
  return typeof value === "function" ? await value() : value;
}

type PromisedValue<T> = T | (() => Promise<T>);

export type PromisedObject<T> = {
  [K in keyof T]: PromisedValue<T[K]>;
};
