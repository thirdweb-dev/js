import { describe, expect, it } from "vitest";
import { numberToHex } from "./hex.js";

describe("hex.ts", () => {
  it("should convert", () => {
    const result = numberToHex(100n, { size: 32, signed: false });
    expect(result).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000064",
    );
  });
});
