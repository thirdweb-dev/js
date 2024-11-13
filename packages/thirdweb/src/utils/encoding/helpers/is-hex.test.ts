import { describe, expect, it } from "vitest";
import { isHex } from "./is-hex.js";

describe("isHex", () => {
  it('should return true for valid hex strings with "0x" prefix in strict mode', () => {
    expect(isHex("0x1a4", { strict: true })).toBe(true);
    expect(isHex("0xABCDEF", { strict: true })).toBe(true);
  });

  it('should return false for hex strings without "0x" prefix in strict mode', () => {
    expect(isHex("1a4", { strict: true })).toBe(false);
    expect(isHex("abcdef", { strict: true })).toBe(false);
  });

  it('should return true for valid hex strings with or without "0x" prefix in non-strict mode', () => {
    expect(isHex("0x1a4", { strict: false })).toBe(true);
    expect(isHex("1a4", { strict: false })).toBe(false);
  });

  it("should return false for invalid hex strings in strict mode", () => {
    expect(isHex("0x1g4", { strict: true })).toBe(false);
    expect(isHex("0xZXY", { strict: true })).toBe(false);
  });

  it("should return false for invalid hex strings in non-strict mode", () => {
    expect(isHex("0x1g4", { strict: false })).toBe(true);
    expect(isHex("0xZXY", { strict: false })).toBe(true);
  });

  it("should return false for non-string inputs", () => {
    expect(isHex(123, { strict: true })).toBe(false);
    expect(isHex(null, { strict: true })).toBe(false);
    expect(isHex(undefined, { strict: true })).toBe(false);
    expect(isHex({}, { strict: true })).toBe(false);
  });

  it("should return false for empty strings", () => {
    expect(isHex("", { strict: true })).toBe(false);
    expect(isHex("", { strict: false })).toBe(false);
  });

  it("should return true for valid empty hex prefix in non-strict mode", () => {
    expect(isHex("0x", { strict: false })).toBe(true);
  });

  it("should return true for valid empty hex prefix in strict mode", () => {
    expect(isHex("0x", { strict: true })).toBe(true);
  });

  it("should use strict mode by default", () => {
    expect(isHex("0x1a4")).toBe(true);
    expect(isHex("1a4")).toBe(false);
  });
});
