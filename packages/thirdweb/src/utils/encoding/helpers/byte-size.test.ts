import { describe, expect, it } from "vitest";
import { byteSize } from "./byte-size.js";

describe("byteSize", () => {
  it('should calculate the byte size for a valid hex string with "0x" prefix', () => {
    expect(byteSize("0x1a4")).toBe(2); // "1a4" is 1 byte + 1 nibble = 2 bytes
    expect(byteSize("0x123456")).toBe(3); // "123456" is 3 bytes
  });

  it("should return 0 for an empty hex string", () => {
    expect(byteSize("0x")).toBe(0);
  });

  it("should calculate the byte size for a Uint8Array", () => {
    expect(byteSize(new Uint8Array([1, 2, 3]))).toBe(3);
    expect(byteSize(new Uint8Array([]))).toBe(0);
  });

  it('should handle a single byte hex string with "0x" prefix', () => {
    expect(byteSize("0x1")).toBe(1); // "1" is half a byte, treated as 1 byte
    expect(byteSize("0x12")).toBe(1); // "12" is 1 byte
  });

  it("should handle longer hex strings", () => {
    expect(byteSize("0x1234567890abcdef")).toBe(8); // "1234567890abcdef" is 8 bytes
    expect(byteSize("0xabcdef")).toBe(3); // "abcdef" is 3 bytes
  });

  it("should return 0 for non-hex string inputs in Uint8Array form", () => {
    expect(byteSize(new Uint8Array([]))).toBe(0); // Empty Uint8Array
  });

  it('should handle strings that are not valid hex but start with "0x"', () => {
    expect(byteSize("0xg")).toBe(1); // Not a valid hex string
  });
});
