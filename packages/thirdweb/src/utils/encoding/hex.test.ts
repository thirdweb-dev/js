import { describe, expect, it } from "vitest";
import { fromHex, numberToHex, padHex, toHex } from "./hex.js";

describe("hex.ts", () => {
  it("should convert number with no padding", () => {
    const result = numberToHex(1);
    expect(result).toBe("0x1");
  });

  it("should convert", () => {
    const result = numberToHex(100n, { signed: false, size: 32 });
    expect(result).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000064",
    );
  });

  /**
   * This test is put here as a docs for the method `numberToHex` because:
   *
   * `numberToHex` can still work with number-convertible strings - even tho it only accepts number or bigint
   * because there's is one line of code that's converting the param into bigint anyway
   * ```ts
   * const value = BigInt(value_);
   * ```
   *
   * As a side effect, the following 3 return the same result:
   * ```ts
   * readContract({
   *   contract,
   *   method: "function tokenURI(uint256 tokenId) returns (string)",
   *   params: [1n],
   * })
   *
   * readContract({
   *   contract,
   *   method: "function tokenURI(uint256 tokenId) returns (string)",
   *   // @ts-ignore
   *   params: [1],
   * })
   *
   * readContract({
   *   contract,
   *   method: "function tokenURI(uint256 tokenId) returns (string)",
   *   // @ts-ignore
   *   params: ["1"],
   * })
   * ```
   */
  it("should work with string !!!!", () => {
    // @ts-ignore Intentional
    const result = numberToHex("100", { signed: false, size: 32 });
    expect(result).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000064",
    );
  });
});

describe("toHex without parameters", () => {
  it("should convert number to hex", () => {
    expect(toHex(1)).toBe("0x1");
  });

  it("should convert bigint to hex", () => {
    expect(toHex(1n)).toBe("0x1");
  });

  it("should convert string to hex", () => {
    expect(toHex("1")).toBe("0x31");
  });

  it("should convert boolean to hex", () => {
    expect(toHex(true)).toBe("0x1");
    expect(toHex(false)).toBe("0x0");
  });

  it("should convert uint8 array to hex", () => {
    expect(toHex(new Uint8Array([42, 255, 0, 128, 64]))).toBe("0x2aff008040");
  });
});

describe("toHex WITH parameters", () => {
  it("should convert number to hex", () => {
    expect(toHex(1, { size: 32 })).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    );
  });

  it("should convert bigint to hex", () => {
    expect(toHex(1n, { size: 32 })).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    );
  });

  it("should convert string to hex", () => {
    expect(toHex("1", { size: 32 })).toBe(
      "0x3100000000000000000000000000000000000000000000000000000000000000",
    );
  });

  it("should convert boolean to hex", () => {
    expect(toHex(true, { size: 32 })).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    );
    expect(toHex(false, { size: 32 })).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    );
  });

  it("should convert uint8 array to hex", () => {
    expect(toHex(new Uint8Array([42, 255, 0, 128, 64]), { size: 32 })).toBe(
      "0x2aff008040000000000000000000000000000000000000000000000000000000",
    );
  });
});

describe("fromHex without parameter", () => {
  it("should convert hex to number", () => {
    expect(fromHex("0x1", { to: "number" })).toBe(1);
  });

  it("should convert hex to bigint", () => {
    expect(fromHex("0x1", { to: "bigint" })).toBe(1n);
  });

  it("should convert hex to string", () => {
    expect(fromHex("0x31", "string")).toBe("1");
  });

  it("should convert hex to boolean:true", () => {
    expect(fromHex("0x1", "boolean")).toBe(true);
  });

  it("should convert hex to boolean:false", () => {
    expect(fromHex("0x0", "boolean")).toBe(false);
  });

  it("should convert hex to uint8 array", () => {
    expect(fromHex("0x2aff008040", "bytes")).toStrictEqual(
      new Uint8Array([42, 255, 0, 128, 64]),
    );
  });
});

describe("fromHex WITH parameter", () => {
  it("should convert hex to number", () => {
    expect(
      fromHex(
        "0x0000000000000000000000000000000000000000000000000000000000000001",
        { size: 32, to: "number" },
      ),
    ).toBe(1);
  });

  it("should convert hex to bigint", () => {
    expect(
      fromHex(
        "0x0000000000000000000000000000000000000000000000000000000000000001",
        { size: 32, to: "bigint" },
      ),
    ).toBe(1n);
  });

  it("should convert hex to string", () => {
    expect(
      fromHex(
        "0x3100000000000000000000000000000000000000000000000000000000000000",
        { size: 32, to: "string" },
      ),
    ).toBe("1");
  });

  it("should convert hex to boolean:true", () => {
    expect(
      fromHex(
        "0x0000000000000000000000000000000000000000000000000000000000000001",
        { size: 32, to: "boolean" },
      ),
    ).toBe(true);
  });

  it("should convert hex to boolean:false", () => {
    expect(
      fromHex(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        { size: 32, to: "boolean" },
      ),
    ).toBe(false);
  });

  it("should convert hex to uint8 array", () => {
    expect(
      fromHex(
        "0x2aff008040000000000000000000000000000000000000000000000000000000",
        { size: 32, to: "bytes" },
      ).toString(),
    ).toStrictEqual(
      "42,255,0,128,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
    );
  });
});

describe("padHex", () => {
  it("should return the original value if size is undefined", () => {
    expect(padHex("0x0", { size: null })).toBe("0x0");
  });

  it("should produce correct result if padding direction is right", () => {
    expect(padHex("0x1", { dir: "right", size: 10 })).toBe(
      "0x10000000000000000000",
    );
  });

  it("should produce correct result if padding direction is Left", () => {
    expect(padHex("0x1", { dir: "left", size: 10 })).toBe(
      "0x00000000000000000001",
    );
  });
});
