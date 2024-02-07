import { describe, expect, it } from "vitest";
import { min, max } from "./bigint.js";

describe("min", () => {
  it("should return the smaller value when a is smaller than b", () => {
    const a = BigInt(5);
    const b = BigInt(10);
    const result = min(a, b);
    expect(result).toBe(a);
  });

  it("should return the smaller value when b is smaller than a", () => {
    const a = BigInt(15);
    const b = BigInt(8);
    const result = min(a, b);
    expect(result).toBe(b);
  });

  it("should return the same value when a and b are equal", () => {
    const a = BigInt(20);
    const b = BigInt(20);
    const result = min(a, b);
    expect(result).toBe(a);
  });
});

describe("max", () => {
  it("should return the larger value when a is larger than b", () => {
    const a = BigInt(15);
    const b = BigInt(8);
    const result = max(a, b);
    expect(result).toBe(a);
  });

  it("should return the larger value when b is larger than a", () => {
    const a = BigInt(5);
    const b = BigInt(10);
    const result = max(a, b);
    expect(result).toBe(b);
  });

  it("should return the same value when a and b are equal", () => {
    const a = BigInt(20);
    const b = BigInt(20);
    const result = max(a, b);
    expect(result).toBe(a);
  });
});
