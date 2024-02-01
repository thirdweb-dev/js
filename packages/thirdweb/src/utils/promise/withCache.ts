// copy of: https://github.com/wevm/viem/blob/6cf2c3b5fe608bce9c828af867dfaa65103753a6/src/utils/promise/withCache.ts
// with slight adjustments made to comply with our linting rules
// TODO: explore extracting this from viem and instead having a separate general purpose library for this kind of thing
// alternatively viem could maybe export this helpful util
// TODO: explore using a LRU cache instead of a Map

export const promiseCache = /*#__PURE__*/ new Map();
export const responseCache = /*#__PURE__*/ new Map();

/**
 *@internal
 */
export function getCache<TData>(cacheKey: string) {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const buildCache = <TData>(cacheKey_: string, cache: Map<string, TData>) => ({
    clear: () => cache.delete(cacheKey_),
    get: () => cache.get(cacheKey_),
    set: (data: TData) => cache.set(cacheKey_, data),
  });

  const promise = buildCache<Promise<TData>>(cacheKey, promiseCache);
  const response = buildCache<{ created: Date; data: TData }>(
    cacheKey,
    responseCache,
  );

  return {
    clear: () => {
      promise.clear();
      response.clear();
    },
    promise,
    response,
  };
}

export type WithCacheParameters = {
  /** The key to cache the data against. */
  cacheKey: string;
  /** The time that cached data will remain in memory. Default: Infinity (no expiry) */
  cacheTime?: number;
};

/**
 * Returns the result of a given promise, and caches the result for
 * subsequent invocations against a provided cache key.
 * @internal
 */
export async function withCache<TData>(
  fn: () => Promise<TData>,
  { cacheKey, cacheTime = Infinity }: WithCacheParameters,
) {
  const cache = getCache<TData>(cacheKey);

  // If a response exists in the cache, and it's not expired, return it
  // and do not invoke the promise.
  // If the max age is 0, the cache is disabled.
  const response = cache.response.get();
  if (response && cacheTime > 0) {
    const age = new Date().getTime() - response.created.getTime();
    if (age < cacheTime) {
      return response.data;
    }
  }

  let promise = cache.promise.get();
  if (!promise) {
    promise = fn();

    // Store the promise in the cache so that subsequent invocations
    // will wait for the same promise to resolve (deduping).
    cache.promise.set(promise);
  }

  try {
    const data = await promise;

    // Store the response in the cache so that subsequent invocations
    // will return the same response.
    cache.response.set({ created: new Date(), data });

    return data;
  } finally {
    // Clear the promise cache so that subsequent invocations will
    // invoke the promise again.
    cache.promise.clear();
  }
}
