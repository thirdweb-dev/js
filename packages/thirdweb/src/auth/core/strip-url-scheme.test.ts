import { describe, expect, test } from "vitest";
import { stripUrlScheme } from "./strip-url-scheme.js";

describe("stripUrlScheme", () => {
  test("should strip https scheme", () => {
    expect(stripUrlScheme("https://example.com")).toBe("example.com");
  });

  test("should strip http scheme", () => {
    expect(stripUrlScheme("http://example.com")).toBe("example.com");
  });

  test("should leave bare domains unchanged", () => {
    expect(stripUrlScheme("example.com")).toBe("example.com");
  });

  test("should strip trailing slash", () => {
    expect(stripUrlScheme("https://example.com/")).toBe("example.com");
  });

  test("should strip trailing path", () => {
    expect(stripUrlScheme("https://example.com/path/to/resource")).toBe(
      "example.com",
    );
  });

  test("should preserve port", () => {
    expect(stripUrlScheme("https://localhost:3000")).toBe("localhost:3000");
  });

  test("should strip trailing slash from bare domain", () => {
    expect(stripUrlScheme("example.com/")).toBe("example.com");
  });
});
