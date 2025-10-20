import { describe, expect, it } from "vitest";

import {
  isObject,
  isObjectWithKeys,
  isRecord,
  isString,
} from "./type-guards.js";

describe("isObject", () => {
  it("returns true for plain objects", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
  });

  it("returns true for non-null object-like values (arrays, dates, maps)", () => {
    expect(isObject([])).toBe(true);
    expect(isObject(new Date())).toBe(true);
    expect(isObject(new Map())).toBe(true);
  });

  it("returns false for primitives, functions and null/undefined", () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(123)).toBe(false);
    expect(isObject("str")).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(() => {})).toBe(false);
  });
});

describe("isString", () => {
  it("returns true for string primitives", () => {
    expect(isString("" as unknown)).toBe(true);
    expect(isString("hello" as unknown)).toBe(true);
  });

  it("returns false for non-strings and String objects", () => {
    // String objects are typeof "object"
    // eslint-disable-next-line no-new-wrappers
    expect(isString(new String("x") as unknown)).toBe(false);
    expect(isString(1 as unknown)).toBe(false);
    expect(isString({} as unknown)).toBe(false);
    expect(isString([] as unknown)).toBe(false);
    expect(isString(null as unknown)).toBe(false);
    expect(isString(undefined as unknown)).toBe(false);
  });
});

describe("isObjectWithKeys", () => {
  it("returns true when object has all specified keys", () => {
    const value = { a: 1, b: 2 } as const;
    expect(isObjectWithKeys(value, ["a"])).toBe(true);
    expect(isObjectWithKeys(value, ["a", "b"])).toBe(true);
  });

  it("returns false when any specified key is missing", () => {
    const value = { a: 1 } as const;
    expect(isObjectWithKeys(value, ["a", "b"])).toBe(false);
  });

  it("defaults to just checking object-ness when no keys are provided", () => {
    expect(isObjectWithKeys({})).toBe(true);
    expect(isObjectWithKeys([])).toBe(true);
    expect(isObjectWithKeys(123 as unknown)).toBe(false);
  });

  it("works with arrays when keys exist on the array", () => {
    const arr = ["x"];
    expect(isObjectWithKeys(arr, ["0"])).toBe(true);
    expect(isObjectWithKeys(arr, ["length"])).toBe(true);
    expect(isObjectWithKeys([], ["0"])).toBe(false);
  });
});

describe("isRecord", () => {
  it("returns true for plain object with string values (default)", () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord({ a: "x", b: "y" })).toBe(true);
  });

  it("returns false for arrays and non-objects", () => {
    expect(isRecord([] as unknown)).toBe(false);
    expect(isRecord(1 as unknown)).toBe(false);
    expect(isRecord(null as unknown)).toBe(false);
    expect(isRecord(undefined as unknown)).toBe(false);
  });

  it("returns false when any value is not a string (default guards)", () => {
    expect(isRecord({ a: 1 })).toBe(false);
    expect(isRecord({ a: "x", b: 2 as unknown as string })).toBe(false);
  });

  it("respects a custom value guard (numbers)", () => {
    const numberGuard = (v: unknown): v is number => typeof v === "number";
    expect(isRecord({ a: 1, b: 2 }, { value: numberGuard })).toBe(true);
    expect(isRecord({ a: 1, b: "x" }, { value: numberGuard })).toBe(false);
  });

  it("applies a custom key guard", () => {
    const keyStartsWithA = (k: unknown): k is string =>
      typeof k === "string" && k.startsWith("a");
    expect(
      isRecord({ apple: "x", aardvark: "y" }, { key: keyStartsWithA }),
    ).toBe(true);
    expect(isRecord({ banana: "x" }, { key: keyStartsWithA })).toBe(false);
  });

  it("objects with only symbol keys are considered records (no enumerable string keys)", () => {
    const s = Symbol("s");
    const obj = { [s]: "x" } as Record<symbol, string>;
    // Object.entries ignores symbol keys; guard will see zero entries
    expect(isRecord(obj)).toBe(true);
  });
});
