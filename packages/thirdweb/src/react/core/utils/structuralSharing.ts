import { replaceEqualDeep } from "@tanstack/react-query";

/** Forked from https://github.com/epoberezkin/fast-deep-equal */
// biome-ignore lint/suspicious/noExplicitAny: This function by nature takes any object
export function deepEqual(a: any, b: any) {
  if (a === b) return true;

  if (a && b && typeof a === "object" && typeof b === "object") {
    if (a.constructor !== b.constructor) return false;

    let length: number;
    let i: number;

    if (Array.isArray(a) && Array.isArray(b)) {
      length = a.length;
      if (length !== b.length) return false;
      for (i = length; i-- !== 0; ) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }

    if (a.valueOf !== Object.prototype.valueOf)
      return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString)
      return a.toString() === b.toString();

    const keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0; )
      // biome-ignore lint/style/noNonNullAssertion: We know its there
      if (!Object.prototype.hasOwnProperty.call(b, keys[i]!)) return false;

    for (i = length; i-- !== 0; ) {
      const key = keys[i];

      if (key && !deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  // biome-ignore lint/suspicious/noSelfCompare: <explanation>
  return a !== a && b !== b;
}

export function structuralSharing<T>(oldData: T | undefined, newData: T) {
  if (deepEqual(oldData, newData)) {
    return oldData as T;
  }
  return replaceEqualDeep(oldData, newData) as T;
}
