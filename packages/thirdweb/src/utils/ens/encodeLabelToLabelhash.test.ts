import { describe, expect, it } from "vitest";
import { encodedLabelToLabelhash } from "./encodeLabelToLabelhash.js";

describe("encodedLabelToLabelhash", () => {
  it("should return null if the label length is not 66", () => {
    expect(encodedLabelToLabelhash("")).toBeNull();
    expect(encodedLabelToLabelhash("[123456]")).toBeNull();
    expect(encodedLabelToLabelhash("[1234567890]".padEnd(67, "0"))).toBeNull();
  });

  it("should return null if the label does not start with '['", () => {
    const input = "1234567890".padStart(66, "0");
    expect(encodedLabelToLabelhash(input)).toBeNull();
  });

  it("should return null if the label does not end with ']' at position 65", () => {
    const input = "[1234567890".padEnd(66, "0");
    expect(encodedLabelToLabelhash(input)).toBeNull();
  });

  it("should return the hash if the label is valid", () => {
    const validHash = "a".repeat(64);
    const input = `[${validHash}]`;

    const result = encodedLabelToLabelhash(input);
    expect(result).toBe(`0x${validHash}`);
  });
});
