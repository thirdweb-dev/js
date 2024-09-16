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
        j--;
      }
    }
  }
  return a;
}

/**
 * @internal
 */
export function hasDuplicates<T>(
  arr: T[],
  fn: (a: T, b: T) => boolean,
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

/**
 * @internal
 */
export function createLruCache<T>(
  maxEntries: number,
  store: Map<string, T> = new Map<string, T>(),
) {
  function put(key: string, value: T) {
    if (store.size >= maxEntries) {
      const keyToDelete = store.keys().next().value;
      if(keyToDelete){
        store.delete(keyToDelete);
      }
      
    }
    store.set(key, value);
  }

  function get(key: string): T | undefined {
    const hasKey = store.has(key);
    if (!hasKey) {
      return undefined;
    }
    const entry = store.get(key) as T;
    store.delete(key);
    store.set(key, entry);
    return entry;
  }

  function has(key: string): boolean {
    return store.has(key);
  }

  return {
    put,
    get,
    has,
    maxEntries,
    store,
  };
}
