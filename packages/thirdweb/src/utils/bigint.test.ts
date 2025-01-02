import { describe, expect, it } from "vitest";
import { max, min, replaceBigInts, toBigInt } from "./bigint.js";

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

describe("toBigInt", () => {
  it("should correctly convert a string representing an integer to bigint", () => {
    const value = "123";
    const result = toBigInt(value);
    expect(result).toBe(BigInt(value));
  });

  it("should correctly convert a number to bigint", () => {
    const value = 123;
    const result = toBigInt(value);
    expect(result).toBe(BigInt(value));
  });

  it("should return the same value for bigint input", () => {
    const value = BigInt(123);
    const result = toBigInt(value);
    expect(result).toBe(value);
  });

  it("should throw an error for non-integer string values", () => {
    const value = "123.45";
    expect(() => toBigInt(value)).toThrow(
      `Expected value to be an integer to convert to a bigint, got ${value} of type string`,
    );
  });

  it("should throw an error for non-integer number values", () => {
    const value = 123.45;
    expect(() => toBigInt(value)).toThrow(
      `Expected value to be an integer to convert to a bigint, got ${value} of type number`,
    );
  });

  it("should convert a Uint8Array to a BigInt", () => {
    const uint8Array = new Uint8Array([1, 2, 3, 4]);
    const result = toBigInt(uint8Array);
    expect(result).toBe(BigInt("0x01020304"));
  });

  it("should handle a Uint8Array with leading zeros", () => {
    const uint8Array = new Uint8Array([0, 0, 1, 2]);
    const result = toBigInt(uint8Array);
    expect(result).toBe(BigInt("0x00000102"));
  });

  it("should handle a large Uint8Array", () => {
    const uint8Array = new Uint8Array([255, 255, 255, 255]);
    const result = toBigInt(uint8Array);
    expect(result).toBe(BigInt("0xffffffff"));
  });

  describe("replaceBigInts", () => {
    it("should replace a single bigint value", () => {
      const input = BigInt(123);
      const result = replaceBigInts(input, (x) => x.toString());
      expect(result).toBe("123");
    });

    it("should handle arrays containing bigints", () => {
      const input = [BigInt(1), BigInt(2), BigInt(3)];
      const result = replaceBigInts(input, (x) => x.toString());
      expect(result).toEqual(["1", "2", "3"]);
    });

    it("should handle nested arrays with bigints", () => {
      const input = [BigInt(1), [BigInt(2), BigInt(3)]];
      const result = replaceBigInts(input, (x) => x.toString());
      expect(result).toEqual(["1", ["2", "3"]]);
    });

    it("should handle objects containing bigints", () => {
      const input = { a: BigInt(1), b: BigInt(2) };
      const result = replaceBigInts(input, (x) => x.toString());
      expect(result).toEqual({ a: "1", b: "2" });
    });

    it("should handle nested objects with bigints", () => {
      const input = { a: BigInt(1), b: { c: BigInt(2), d: BigInt(3) } };
      const result = replaceBigInts(input, (x) => x.toString());
      expect(result).toEqual({ a: "1", b: { c: "2", d: "3" } });
    });

    it("should handle mixed arrays and objects", () => {
      const input = {
        a: [BigInt(1), { b: BigInt(2), c: [BigInt(3)] }],
      };
      const result = replaceBigInts(input, (x) => x.toString());
      expect(result).toEqual({ a: ["1", { b: "2", c: ["3"] }] });
    });

    it("should handle empty arrays and objects", () => {
      expect(replaceBigInts([], (x) => x.toString())).toEqual([]);
      expect(replaceBigInts({}, (x) => x.toString())).toEqual({});
    });

    it("should leave other types untouched", () => {
      const input = {
        a: "string",
        b: 42,
        c: null,
        d: undefined,
        e: true,
        f: [1, "test"],
      };
      const result = replaceBigInts(input, (x) => x.toString());
      expect(result).toEqual(input);
    });

    it("should handle complex deeply nested structures", () => {
      const input = {
        a: BigInt(1),
        b: [BigInt(2), { c: [BigInt(3), { d: BigInt(4) }] }],
        e: { f: { g: BigInt(5) } },
      };
      const result = replaceBigInts(input, (x) => x.toString());
      expect(result).toEqual({
        a: "1",
        b: ["2", { c: ["3", { d: "4" }] }],
        e: { f: { g: "5" } },
      });
    });
  });
});
