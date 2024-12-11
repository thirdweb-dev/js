import { describe, expect, it } from "vitest";
import { numberToHex } from "./hex.js";

describe("hex.ts", () => {
  it("should convert number with no padding", () => {
    const result = numberToHex(1);
    expect(result).toBe("0x1");
  });

  it("should convert", () => {
    const result = numberToHex(100n, { size: 32, signed: false });
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
    const result = numberToHex("100", { size: 32, signed: false });
    expect(result).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000064",
    );
  });
});
