import { describe, expect, it } from "vitest";
import { toHex } from "../encoding/hex.js";
import { parseAbiParams } from "./parse-abi-params.js";

describe("parseAbiParams", () => {
  describe("parseAbiParams", () => {
    it("should convert address and uint256 correctly", () => {
      const types = ["address", "uint256"];
      const values = ["0x1234567890abcdef1234567890abcdef12345678", "1200000"];
      const expected = [
        "0x1234567890abcdef1234567890abcdef12345678",
        BigInt(1200000),
      ];
      expect(parseAbiParams(types, values)).toEqual(expected);
    });

    it("should convert address and bool correctly", () => {
      const types = ["address", "bool"];
      const values = ["0x1234567890abcdef1234567890abcdef12345678", "true"];
      const expected = ["0x1234567890abcdef1234567890abcdef12345678", true];
      expect(parseAbiParams(types, values)).toEqual(expected);
    });

    it("should convert bytes32 correctly", () => {
      const types = ["bytes32"];
      const values = [
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      ];
      const expected = [
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      ];
      expect(parseAbiParams(types, values)).toEqual(expected);
    });

    it("should throw an error for invalid hex in bytes32", () => {
      const types = ["bytes32"];
      const values = ["invalidHex"];
      expect(() => parseAbiParams(types, values)).toThrowError(
        "invalidHex is not a valid hex string",
      );
    });

    it("should convert uint256 correctly", () => {
      const types = ["uint256"];
      const values = ["1200000"];
      const expected = [BigInt(1200000)];
      expect(parseAbiParams(types, values)).toEqual(expected);
    });

    it("should throw an error for invalid address", () => {
      const types = ["address"];
      const values = ["invalidAddress"];
      expect(() => parseAbiParams(types, values)).toThrowError(
        "invalidAddress is not a valid address",
      );
    });

    it("should throw an error for mismatched number of types and values", () => {
      const types = ["address", "uint256"];
      const values = ["0x1234567890abcdef1234567890abcdef12345678"];
      expect(() => parseAbiParams(types, values)).toThrowError(
        "Passed the wrong number of constructor arguments: 1, expected 2",
      );
    });

    it("should convert tuple correctly", () => {
      const types = ["tuple"];
      const values = [
        '["0x1234567890abcdef1234567890abcdef12345678", "1200000"]',
      ];
      const expected = [
        ["0x1234567890abcdef1234567890abcdef12345678", "1200000"],
      ];
      expect(parseAbiParams(types, values)).toEqual(expected);
    });

    it("should convert array of addresses correctly", () => {
      const types = ["address[]"];
      const values = [
        '["0x1234567890abcdef1234567890abcdef12345678", "0xabcdef1234567890abcdef1234567890abcdef12"]',
      ];
      const expected = [
        [
          "0x1234567890abcdef1234567890abcdef12345678",
          "0xabcdef1234567890abcdef1234567890abcdef12",
        ],
      ];
      expect(parseAbiParams(types, values)).toEqual(expected);
    });

    it('should convert boolean correctly for "true"', () => {
      const types = ["bool"];
      const values = ["true"];
      const expected = [true];
      expect(parseAbiParams(types, values)).toEqual(expected);
    });

    it('should convert boolean correctly for "false"', () => {
      const types = ["bool"];
      const values = ["false"];
      const expected = [false];
      expect(parseAbiParams(types, values)).toEqual(expected);
    });

    it("should convert boolean correctly for boolean true", () => {
      const types = ["bool"];
      const values = [true];
      const expected = [true];
      expect(parseAbiParams(types, values)).toEqual(expected);
    });

    it("should convert boolean correctly for boolean false", () => {
      const types = ["bool"];
      const values = [false];
      const expected = [false];
      expect(parseAbiParams(types, values)).toEqual(expected);
    });

    it("should throw an error for invalid boolean value", () => {
      const types = ["bool"];
      const values = ["notBoolean"];
      expect(() => parseAbiParams(types, values)).toThrowError(
        "Invalid boolean value. Expecting either 'true' or 'false'",
      );
    });

    it("should just return the value if already json-parsed", () => {
      const types = ["tuple"];
      const values = [{ cat: "orange" }];
      expect(parseAbiParams(types, values)).toEqual(values);
    });

    it("should throw error if not a hex string", () => {
      const values = ["orange cat"];
      expect(() => parseAbiParams(["bytes64"], values)).toThrowError(
        "orange cat is not a valid hex string",
      );

      expect(() => parseAbiParams(["bytes32"], values)).toThrowError(
        "orange cat is not a valid hex string",
      );
    });

    it("should throw error if cannot convert to BigInt", () => {
      expect(() => parseAbiParams(["uint256"], [true])).toThrowError(
        "Cannot convert type boolean to BigInt",
      );

      expect(() => parseAbiParams(["uint256"], ["cat"])).toThrowError(
        "Cannot convert cat to a BigInt",
      );
    });

    it("should return value unaltered if already a hex", () => {
      const value = toHex("cat");
      const result = parseAbiParams(["bytes64"], [value]);
      expect(result).toStrictEqual([value]);
    });

    it("should return a string for type string", () => {
      const value = "this is a string";
      const result = parseAbiParams(["string"], [value]);
      expect(result).toStrictEqual(["this is a string"]);
    });

    it("should return the value itself if it falls through to the end", () => {
      const value = { whatever: true };
      const result = parseAbiParams(["non-existent-type"], [value]);
      expect(result).toStrictEqual([{ whatever: true }]);
    });
  });
});
