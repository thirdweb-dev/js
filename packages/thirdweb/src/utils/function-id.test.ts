import { describe, expect, it } from "vitest";
import { getFunctionId } from "./function-id.js";

describe("getFunctionId", () => {
  it("should return the function ID for a given function", () => {
    const fn = () => {
      // Some function body
    };
    const result = getFunctionId(fn);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should return the same function ID for the same function", () => {
    const fn = () => {
      // Some function body
    };
    const result1 = getFunctionId(fn);
    const result2 = getFunctionId(fn);
    expect(result1).toBe(result2);
  });

  it("should return different function IDs for different functions", () => {
    const fn1 = () => {
      return "foo";
    };
    const fn2 = () => {
      return "bar";
    };
    const result1 = getFunctionId(fn1);
    const result2 = getFunctionId(fn2);
    expect(result1).not.toBe(result2);
  });
});
