import { describe, expect, it } from "vitest";
import { cachedTextEncoder } from "./text-encoder.js";

describe("cachedTextEncoder", () => {
  it("should return a cached instance of TextEncoder", () => {
    const decoder1 = cachedTextEncoder();
    const decoder2 = cachedTextEncoder();
    expect(decoder1).toBe(decoder2);
  });
});
