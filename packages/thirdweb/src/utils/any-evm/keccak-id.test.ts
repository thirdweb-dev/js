import { describe, expect, it } from "vitest";
import { keccakId } from "./keccak-id.js";

describe("keccakId", () => {
  it("should return the keccak256 hash of the input", () => {
    const input = "Hello, World!";
    const result = keccakId(input);
    expect(result).toMatchInlineSnapshot(
      `"0xacaf3289d7b601cbd114fb36c4d29c85bbfd5e133f14cb355c3fd8d99367964f"`,
    );
  });
});
