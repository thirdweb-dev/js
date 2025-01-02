/**
 * @internal
 */
export function hasDuplicates<T>(
  arr: T[],
  fn: (a: T | undefined, b: T | undefined) => boolean,
): boolean {
  if (arr.length === 0 || arr.length === 1) {
    return false;
  }
  if (!fn) {
    throw new Error("Comparison function required");
  }

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (fn(arr[i], arr[j])) {
        return true;
      }
    }
  }
  return false;
}
