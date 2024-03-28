import { describe, it, expect } from "vitest";
import { cachedTextDecoder } from "./text-decoder.js";

describe("cachedTextDecoder", () => {
  it("should return a cached instance of TextDecoder", () => {
    const decoder1 = cachedTextDecoder();
    const decoder2 = cachedTextDecoder();
    expect(decoder1).toBe(decoder2);
  });
});
