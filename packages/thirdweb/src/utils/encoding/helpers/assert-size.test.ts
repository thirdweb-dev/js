import { describe, expect, it } from "vitest";
import { assertSize } from "./assert-size.js";

describe("assertSize", () => {
  it("should not throw an error for hex strings within the specified size", () => {
    expect(() => assertSize("0x1a4", { size: 2 })).not.toThrow();
    expect(() => assertSize("0x1234", { size: 2 })).not.toThrow();
  });

  it("should throw an error for hex strings exceeding the specified size", () => {
    expect(() => assertSize("0x123456", { size: 2 })).toThrow(
      "Size overflow: 3 > 2",
    );
    expect(() => assertSize("0xabcdef", { size: 2 })).toThrow(
      "Size overflow: 3 > 2",
    );
  });

  it("should not throw an error for Uint8Array within the specified size", () => {
    expect(() =>
      assertSize(new Uint8Array([1, 2, 3]), { size: 3 }),
    ).not.toThrow();
    expect(() => assertSize(new Uint8Array([]), { size: 0 })).not.toThrow();
  });

  it("should throw an error for Uint8Array exceeding the specified size", () => {
    expect(() => assertSize(new Uint8Array([1, 2, 3, 4]), { size: 3 })).toThrow(
      "Size overflow: 4 > 3",
    );
  });

  it("should not throw an error for empty hex strings", () => {
    expect(() => assertSize("0x", { size: 0 })).not.toThrow();
  });

  it("should handle boundary conditions correctly", () => {
    expect(() => assertSize("0x12", { size: 1 })).not.toThrow();
    expect(() => assertSize("0x12", { size: 0 })).toThrow(
      "Size overflow: 1 > 0",
    );
  });

  it("should not throw an error for hex strings exactly at the specified size", () => {
    expect(() => assertSize("0x12", { size: 1 })).not.toThrow();
    expect(() => assertSize("0x1234", { size: 2 })).not.toThrow();
  });
});
