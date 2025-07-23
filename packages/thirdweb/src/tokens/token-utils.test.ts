import { isHex } from "viem/utils";
import { describe, expect, it } from "vitest";

import { generateSalt, SaltFlag } from "./token-utils.js";

// Helper to validate the generated salt meets core guarantees
function assertValidSalt(out: string, expectedFlagHex: string) {
  // should be valid hex
  console.log("out", out);
  expect(isHex(out)).toBe(true);
  // 0x prefix + 64 hex chars → 32 bytes
  expect(out.length).toBe(66);
  // first byte must match the expected flag
  expect(out.slice(0, 4).toLowerCase()).toBe(expectedFlagHex.toLowerCase());
}

describe("generateSalt", () => {
  it("handles hex shorter than 32 bytes (padding)", () => {
    const shortHex = "0x123456"; // 3 bytes < 32 bytes
    const out = generateSalt(shortHex);
    assertValidSalt(out, "0x01"); // default flag is MIX_SENDER (0x01)
  });

  it("handles exactly 32-byte hex and overrides explicit flag with salt's flag", () => {
    const hex32 = `0x20${"aa".repeat(31)}`; // first byte 0x20, total 32 bytes
    const out = generateSalt(hex32, SaltFlag.BYPASS); // pass a different flag intentionally
    // even though we requested BYPASS (0x80), the salt's first byte (0x20) wins
    assertValidSalt(out, "0x20");
  });

  it("handles hex longer than 32 bytes (hashing)", () => {
    const longHex = `0x${"ff".repeat(80)}`; // 80 bytes > 32 bytes
    const out = generateSalt(longHex);
    assertValidSalt(out, "0x01"); // default flag retained
  });

  it("handles arbitrary non-hex string (hashed)", () => {
    const out = generateSalt("hello world");
    assertValidSalt(out, "0x01");
  });

  it("respects explicit flag parameter when provided", () => {
    const out = generateSalt("foobar", SaltFlag.BYPASS);
    assertValidSalt(out, "0x80");
  });
});
