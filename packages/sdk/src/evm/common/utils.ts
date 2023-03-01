/**
 * @internal
 */
export const isBrowser = () => typeof window !== "undefined";

/**
 * @internal
 */
export const isNode = () => !isBrowser();

/**
 * @internal
 */
export function unique<T>(a: T[], fn: (a: T, b: T) => boolean): T[] {
  if (a.length === 0 || a.length === 1) {
    return a;
  }
  if (!fn) {
    return a;
  }

  for (let i = 0; i < a.length; i++) {
    for (let j = i + 1; j < a.length; j++) {
      if (fn(a[i], a[j])) {
        a.splice(j, 1);
      }
    }
  }
  return a;
}
