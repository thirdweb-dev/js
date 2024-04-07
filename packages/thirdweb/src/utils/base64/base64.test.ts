import { describe, expect, it } from "vitest";
import { isBase64JSON, parseBase64String } from "./base64.js";

describe("isBase64JSON", () => {
  it("should return true for valid base64 string", () => {
    const input = "data:application/json;base64,SGVsbG8gd29ybGQ=";
    const result = isBase64JSON(input);
    expect(result).toBe(true);
  });

  it("should return false for invalid base64 string", () => {
    const input = "Hello world";
    const result = isBase64JSON(input);
    expect(result).toBe(false);
  });

  it("should return false for non-base64 string", () => {
    const input = "data:image/png;base64,SGVsbG8gd29ybGQ=";
    const result = isBase64JSON(input);
    expect(result).toBe(false);
  });
});

describe("parseBase64String", () => {
  it("should parse base64 string and return the decoded value", () => {
    const input = "data:application/json;base64,SGVsbG8gd29ybGQ=";
    const result = parseBase64String(input);
    expect(result).toBe("Hello world");
  });

  // Add more test cases for different scenarios
});
