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
