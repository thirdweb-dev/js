import { expect, test } from "vitest";
import { LruMap } from "./lru.js";

test("default", () => {
  const cache = new LruMap(5);
  cache.set("a", 1);
  cache.set("b", 2);
  cache.set("c", 3);
  cache.set("d", 4);
  cache.set("e", 5);
  cache.set("f", 6);
  cache.set("g", 7);
  expect(cache.size).toBe(5);
  expect(cache.has("a")).toBe(false);
  expect(cache.has("b")).toBe(false);
  expect(cache.get("c")).toBe(3);
  expect(cache.get("d")).toBe(4);
  expect(cache.get("e")).toBe(5);
  expect(cache.get("f")).toBe(6);
  expect(cache.get("g")).toBe(7);
});

test("update touched keys", () => {
  const cache = new LruMap(5);
  cache.set("a", 1);
  cache.set("b", 2);
  cache.set("c", 3);
  cache.set("d", 4);
  cache.set("e", 5);
  expect(cache.size).toBe(5);
  cache.get("a");
  cache.set("f", 6);
  cache.set("g", 7);
  expect(cache.has("a")).toBe(true);
  expect(cache.has("b")).toBe(false);
  expect(cache.has("c")).toBe(false);
  expect(cache.has("d")).toBe(true);
});

test("evicts an empty-string oldest key", () => {
  const cache = new LruMap<number>(2);
  cache.set("", 0);
  cache.set("a", 1);
  cache.set("b", 2);

  expect(cache.size).toBe(2);
  expect([...cache.keys()]).toEqual(["a", "b"]);

  cache.set("c", 3);
  expect(cache.size).toBe(2);
  expect([...cache.keys()]).toEqual(["b", "c"]);
});

test("refreshes an empty-string key before eventually evicting it", () => {
  const cache = new LruMap<number>(2);
  cache.set("", 0);
  cache.set("a", 1);
  expect(cache.get("")).toBe(0);

  cache.set("b", 2);
  expect([...cache.keys()]).toEqual(["", "b"]);

  cache.set("c", 3);
  expect(cache.size).toBe(2);
  expect([...cache.keys()]).toEqual(["b", "c"]);
});
