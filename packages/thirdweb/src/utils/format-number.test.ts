import { describe, expect, it } from "vitest";
import { formatNumber } from "./formatNumber.js";

describe("formatNumber", () => {
  it("should return the correct number when passing a float", () => {
    expect(formatNumber(10.12345, 1)).toEqual(10.1);
  });

  it("should return the correct number when passing an integer", () => {
    expect(formatNumber(10, 1)).toEqual(10);
  });
});
