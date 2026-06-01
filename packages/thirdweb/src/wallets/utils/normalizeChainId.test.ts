import { describe, expect, it } from "vitest";
import { normalizeChainId } from "./normalizeChainId.js";

describe("normalizeChainId", () => {
  it("should return the value un-altered if that value is a number", () => {
    expect(normalizeChainId(1)).toBe(1);
  });

  it("should convert hex value to a number", () => {
    expect(normalizeChainId("0x1")).toBe(1);
  });

  it("should convert bigint to type number", () => {
    expect(normalizeChainId(1n)).toBe(1);
  });

  it("should try to convert a string to a decimal (base 10) integer", () => {
    expect(normalizeChainId("1")).toBe(1);
  });

  it("should reject invalid chain ids", () => {
    expect(() => normalizeChainId("1abc")).toThrow("Invalid chain ID");
    expect(() => normalizeChainId("abc")).toThrow("Invalid chain ID");
    expect(() => normalizeChainId("0x")).toThrow("Invalid chain ID");
    expect(() => normalizeChainId(Number.NaN)).toThrow("Invalid chain ID");
    expect(() =>
      normalizeChainId(BigInt(Number.MAX_SAFE_INTEGER) + 1n),
    ).toThrow("Invalid chain ID");
  });
});
