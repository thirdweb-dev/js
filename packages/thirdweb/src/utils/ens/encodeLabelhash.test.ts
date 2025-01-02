import { describe, expect, it } from "vitest";
import type { Hex } from "../encoding/hex.js";
import { encodeLabelhash } from "./encodeLabelhash.js";

describe("encodeLabelhash", () => {
  it("should encode a valid hex hash correctly", () => {
    const input = "0x1234567890abcdef";
    const expectedOutput = "[1234567890abcdef]";
    expect(encodeLabelhash(input)).toBe(expectedOutput);
  });

  it("should handle hashes of varying valid lengths", () => {
    const shortHash = "0x1";
    const longHash = `0x${"a".repeat(64)}`;
    expect(encodeLabelhash(shortHash)).toBe("[1]");
    expect(encodeLabelhash(longHash as Hex)).toBe(`[${"a".repeat(64)}]`);
  });
});
