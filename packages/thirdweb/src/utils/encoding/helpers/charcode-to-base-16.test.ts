import { describe, expect, it } from "vitest";
import { charCodeToBase16 } from "./charcode-to-base-16.js";

describe("charCodeToBase16", () => {
  it("should return correct values for digits (0-9)", () => {
    expect(charCodeToBase16("0".charCodeAt(0))).toBe(0);
    expect(charCodeToBase16("5".charCodeAt(0))).toBe(5);
    expect(charCodeToBase16("9".charCodeAt(0))).toBe(9);
  });

  it("should return correct values for uppercase letters (A-F)", () => {
    expect(charCodeToBase16("A".charCodeAt(0))).toBe(10);
    expect(charCodeToBase16("C".charCodeAt(0))).toBe(12);
    expect(charCodeToBase16("F".charCodeAt(0))).toBe(15);
  });

  it("should return correct values for lowercase letters (a-f)", () => {
    expect(charCodeToBase16("a".charCodeAt(0))).toBe(10);
    expect(charCodeToBase16("c".charCodeAt(0))).toBe(12);
    expect(charCodeToBase16("f".charCodeAt(0))).toBe(15);
  });

  // Test cases for invalid inputs
  it("should return undefined for invalid inputs", () => {
    expect(charCodeToBase16("G".charCodeAt(0))).toBeUndefined();
    expect(charCodeToBase16("z".charCodeAt(0))).toBeUndefined();
    expect(charCodeToBase16(" ".charCodeAt(0))).toBeUndefined();
    expect(charCodeToBase16("!".charCodeAt(0))).toBeUndefined();
  });

  it("should handle edge cases correctly", () => {
    expect(charCodeToBase16("0".charCodeAt(0) - 1)).toBeUndefined(); // Just below '0'
    expect(charCodeToBase16("9".charCodeAt(0) + 1)).toBeUndefined(); // Just above '9'
    expect(charCodeToBase16("A".charCodeAt(0) - 1)).toBeUndefined(); // Just below 'A'
    expect(charCodeToBase16("F".charCodeAt(0) + 1)).toBeUndefined(); // Just above 'F'
    expect(charCodeToBase16("a".charCodeAt(0) - 1)).toBeUndefined(); // Just below 'a'
    expect(charCodeToBase16("f".charCodeAt(0) + 1)).toBeUndefined(); // Just above 'f'
  });
});
