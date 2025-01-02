import { bytesToHex, concat } from "viem/utils";
import { describe, expect, it } from "vitest";
import { namehash } from "./namehash.js";

describe("namehash", () => {
  it("should return a zero-filled hash for an empty name", () => {
    const result = namehash("");
    expect(result).toBe(bytesToHex(new Uint8Array(32).fill(0)));
  });

  it("should correctly concatenate intermediate hashes", () => {
    const labelBytes1 = new Uint8Array([1, 2, 3]);
    const labelBytes2 = new Uint8Array([4, 5, 6]);
    const concatenated = concat([labelBytes1, labelBytes2]);
    expect(concat([labelBytes1, labelBytes2])).toEqual(concatenated);
  });
});
