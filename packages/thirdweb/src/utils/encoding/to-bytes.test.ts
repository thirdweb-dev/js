import { describe, expect, it } from "vitest";
import { numberToHex } from "./hex.js";
import {
  boolToBytes,
  hexToBytes,
  numberToBytes,
  stringToBytes,
  toBytes,
} from "./to-bytes.js";

describe("to-bytes.js", () => {
  describe("toBytes", () => {
    it("should convert a number to bytes", () => {
      expect(toBytes(123)).toEqual(new Uint8Array([123]));
    });

    it("should convert a bigint to bytes", () => {
      expect(toBytes(BigInt(123))).toEqual(new Uint8Array([123]));
    });

    it("should convert a boolean to bytes", () => {
      expect(toBytes(true)).toEqual(new Uint8Array([1]));
      expect(toBytes(false)).toEqual(new Uint8Array([0]));
    });

    it("should convert a hex string to bytes", () => {
      expect(toBytes("0x1a")).toEqual(new Uint8Array([26])); // 0x1a = 26 in decimal
      expect(toBytes("0xabcd")).toEqual(new Uint8Array([171, 205]));
    });

    it("should convert a regular string to bytes", () => {
      expect(toBytes("abc")).toEqual(new Uint8Array([97, 98, 99])); // ASCII values for 'a', 'b', 'c'
    });

    it("should handle empty hex string", () => {
      expect(toBytes("0x")).toEqual(new Uint8Array([]));
    });

    it("should handle empty string", () => {
      expect(toBytes("")).toEqual(new Uint8Array([]));
    });
  });

  describe("boolToBytes", () => {
    it("should convert true to a Uint8Array with a value of 1", () => {
      expect(boolToBytes(true)).toEqual(new Uint8Array([1]));
    });

    it("should convert false to a Uint8Array with a value of 0", () => {
      expect(boolToBytes(false)).toEqual(new Uint8Array([0]));
    });

    it("should pad the byte array to the specified size with zeros on the left when size is provided", () => {
      expect(boolToBytes(true, { size: 4 })).toEqual(
        new Uint8Array([0, 0, 0, 1]),
      );
      expect(boolToBytes(false, { size: 4 })).toEqual(
        new Uint8Array([0, 0, 0, 0]),
      );
    });

    it("should throw an error if the specified size is less than the byte size", () => {
      expect(() => boolToBytes(true, { size: 0 })).toThrow(
        "Size cannot exceed `0` bytes. Given size: `1` bytes.",
      );
    });

    it("should not pad if no size is provided", () => {
      expect(boolToBytes(true)).toEqual(new Uint8Array([1]));
      expect(boolToBytes(false)).toEqual(new Uint8Array([0]));
    });

    it("should handle size of 1 correctly", () => {
      expect(boolToBytes(true, { size: 1 })).toEqual(new Uint8Array([1]));
      expect(boolToBytes(false, { size: 1 })).toEqual(new Uint8Array([0]));
    });
  });

  describe("hexToBytes", () => {
    it("should convert a valid hex string to Uint8Array", () => {
      expect(hexToBytes("0x1a4")).toEqual(new Uint8Array([1, 164]));
      expect(hexToBytes("0xabcdef")).toEqual(new Uint8Array([171, 205, 239]));
    });

    it("should handle odd-length hex strings by prepending a zero", () => {
      expect(hexToBytes("0xabc")).toEqual(new Uint8Array([10, 188]));
    });

    it("should throw an error for invalid hex strings", () => {
      expect(() => hexToBytes("0x1g")).toThrow(
        'Invalid byte sequence ("1g" in "1g").',
      );
      expect(() => hexToBytes("0xzz")).toThrow(
        'Invalid byte sequence ("zz" in "zz").',
      );
    });

    it("should pad the hex string to the specified size by adding extra bytes", () => {
      expect(hexToBytes("0x1a", { size: 4 })).toEqual(
        new Uint8Array([26, 0, 0, 0]),
      );
    });

    it("should throw an error if the hex string exceeds the specified size", () => {
      expect(() => hexToBytes("0x123456", { size: 2 })).toThrow(
        "Size cannot exceed `2` bytes. Given size: `3` bytes.",
      );
    });

    it("should correctly convert hex strings with even lengths without additional padding", () => {
      expect(hexToBytes("0x1234")).toEqual(new Uint8Array([18, 52]));
    });
  });

  describe("numberToBytes", () => {
    it("should convert a number to a Uint8Array", () => {
      const result = numberToBytes(420);
      expect(result).toEqual(new Uint8Array([1, 164]));
    });

    it("should convert a bigint to a Uint8Array", () => {
      const result = numberToBytes(BigInt(420));
      expect(result).toEqual(new Uint8Array([1, 164]));
    });

    it("should handle zero correctly", () => {
      const result = numberToBytes(0);
      expect(result).toEqual(new Uint8Array([0]));
    });

    it("should handle large numbers correctly", () => {
      const largeNumber = BigInt("12345678901234567890");
      const result = numberToBytes(largeNumber);
      expect(result).toEqual(hexToBytes(numberToHex(largeNumber)));
    });

    it("should apply options correctly when converting numbers", () => {
      const opts = { size: 4 };
      const result = numberToBytes(420, opts);
      expect(result).toEqual(hexToBytes(numberToHex(420, opts)));
    });
  });

  describe("stringToBytes", () => {
    it("should convert a string to a Uint8Array of bytes", () => {
      const result = stringToBytes("Hello, world!");
      expect(result).toEqual(
        new Uint8Array([
          72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
        ]),
      );
    });

    it("should handle an empty string", () => {
      const result = stringToBytes("");
      expect(result).toEqual(new Uint8Array([]));
    });

    it("should pad the byte array to the specified size with zeros on the right", () => {
      const result = stringToBytes("Hi", { size: 5 });
      expect(result).toEqual(new Uint8Array([72, 105, 0, 0, 0]));
    });

    it("should throw an error if the byte array exceeds the specified size", () => {
      expect(() => stringToBytes("Hello", { size: 3 })).toThrow(
        "Size cannot exceed `3` bytes. Given size: `5` bytes.",
      );
    });

    it("should not pad if no size is provided", () => {
      const result = stringToBytes("Test");
      expect(result).toEqual(new Uint8Array([84, 101, 115, 116]));
    });

    it("should handle unicode characters correctly", () => {
      const result = stringToBytes("こんにちは");
      expect(result).toEqual(
        new Uint8Array([
          227, 129, 147, 227, 130, 147, 227, 129, 171, 227, 129, 161, 227, 129,
          175,
        ]),
      );
    });
  });
});
