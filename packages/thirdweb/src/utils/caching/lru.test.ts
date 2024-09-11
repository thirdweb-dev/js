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
