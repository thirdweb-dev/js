import { beforeEach, describe, expect, test as it, vi } from "vitest";

import { wait } from "./wait.js";

import { getCache, withCache } from "./withCache.js";

beforeEach(() => getCache("foo").clear());

it("caches responses", async () => {
  const fn = vi.fn().mockResolvedValue("bar");

  let data = await withCache(fn, { cacheKey: "foo" });
  expect(data).toBe("bar");

  data = await withCache(fn, { cacheKey: "foo" });
  expect(data).toBe("bar");

  expect(fn).toBeCalledTimes(1);
});

describe("args: cacheTime", () => {
  it("invalidates when cacheTime = 0", async () => {
    const fn = vi.fn().mockResolvedValue("bar");

    let data = await withCache(fn, { cacheKey: "foo" });
    expect(data).toBe("bar");
    data = await withCache(fn, { cacheKey: "foo", cacheTime: 0 });
    expect(data).toBe("bar");
    expect(fn).toBeCalledTimes(2);
  });

  it("invalidates when expired", async () => {
    const fn = vi.fn().mockResolvedValue("bar");

    let data = await withCache(fn, { cacheKey: "foo" });
    expect(data).toBe("bar");
    data = await withCache(fn, { cacheKey: "foo" });
    expect(data).toBe("bar");
    expect(fn).toBeCalledTimes(1);

    await wait(150);
    data = await withCache(fn, { cacheKey: "foo", cacheTime: 100 });
    expect(data).toBe("bar");
    expect(fn).toBeCalledTimes(2);
  });
});

describe("args: cacheKey", () => {
  it("different cacheKeys", async () => {
    const fn = vi.fn().mockResolvedValue("bar");

    let data = await withCache(fn, { cacheKey: "foo" });
    expect(data).toBe("bar");
    data = await withCache(fn, { cacheKey: "baz" });
    expect(data).toBe("bar");
    expect(fn).toBeCalledTimes(2);
  });
});

describe("behavior: caches promises (deduping)", () => {
  it("basic", async () => {
    const fn = vi.fn();
    await Promise.all(
      Array.from({ length: 10 }, () =>
        withCache(async () => fn(), { cacheKey: "foo" }),
      ),
    );
    expect(fn).toBeCalledTimes(1);
  });

  it("different cacheKeys", async () => {
    const fn = vi.fn().mockResolvedValue("bar");
    await Promise.all([
      ...Array.from({ length: 10 }, () =>
        withCache(() => fn(), { cacheKey: "foo" }),
      ),
      ...Array.from({ length: 10 }, () =>
        withCache(() => fn(), { cacheKey: "bar" }),
      ),
    ]);
    expect(fn).toBeCalledTimes(2);
  });
});

it("behavior: programmatic removal", async () => {
  const fn = vi.fn().mockResolvedValue("bar");

  let data = await withCache(fn, { cacheKey: "foo" });
  expect(data).toBe("bar");

  getCache("foo").clear();

  data = await withCache(fn, { cacheKey: "foo" });
  expect(data).toBe("bar");

  expect(fn).toBeCalledTimes(2);
});

describe("getCache", () => {
  it("should return an object with clear, get, and set methods", () => {
    const cacheKey = "testKey";
    const cache = getCache<string>(cacheKey);

    expect(typeof cache.clear).toBe("function");
    expect(typeof cache.promise.get).toBe("function");
    expect(typeof cache.promise.set).toBe("function");
    expect(typeof cache.response.get).toBe("function");
    expect(typeof cache.response.set).toBe("function");
  });

  it("should allow setting and getting values from the promise cache", () => {
    const cacheKey = "testKey";
    const cache = getCache<string>(cacheKey);
    const testPromise = Promise.resolve("testValue");

    cache.promise.set(testPromise);
    expect(cache.promise.get()).toBe(testPromise);
  });

  it("should allow clearing the cache", () => {
    const cacheKey = "testKey";
    const cache = getCache<string>(cacheKey);
    const testPromise = Promise.resolve("testValue");

    cache.promise.set(testPromise);
    cache.clear();
    expect(cache.promise.get()).toBeUndefined();
  });
});

describe("withCache", () => {
  it("should execute the function and cache the result", async () => {
    const cacheKey = "testKey1";
    const fn = vi.fn().mockResolvedValue("testValue");

    const result1 = await withCache(fn, { cacheKey });
    const result2 = await withCache(fn, { cacheKey });

    expect(result1).toBe("testValue");
    expect(result2).toBe("testValue");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should not return expired cache data", async () => {
    const cacheKey = "testKey2";
    const fn = vi.fn().mockResolvedValue("newValue");

    const result1 = await withCache(fn, { cacheKey, cacheTime: 10 });
    await new Promise((resolve) => setTimeout(resolve, 20)); // Wait for cache to expire
    const result2 = await withCache(fn, { cacheKey, cacheTime: 10 });

    expect(result1).toBe("newValue");
    expect(result2).toBe("newValue");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should deduplicate concurrent calls to the same cache key", async () => {
    const cacheKey = "testKey3";
    const fn = vi.fn().mockResolvedValue("testValue");

    const [result1, result2] = await Promise.all([
      withCache(fn, { cacheKey, cacheTime: 100 }),
      withCache(fn, { cacheKey, cacheTime: 100 }),
    ]);

    expect(result1).toBe("testValue");
    expect(result2).toBe("testValue");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
