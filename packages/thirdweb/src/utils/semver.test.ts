import { describe, expect, it } from "vitest";
import { isIncrementalVersion, toSemver } from "./semver.js";

describe("toSemver", () => {
  it("should parse a valid semantic version", () => {
    const result = toSemver("1.2.3");
    expect(result).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      versionString: "1.2.3",
    });
  });

  it("should handle versions with leading/trailing spaces", () => {
    const result = toSemver("  1.0.0  ");
    expect(result).toEqual({
      major: 1,
      minor: 0,
      patch: 0,
      versionString: "1.0.0",
    });
  });

  it("should throw an error for versions exceeding max length", () => {
    const longVersion = "1".repeat(257); // 257 characters
    expect(() => toSemver(longVersion)).toThrow(
      "version is longer than 256 characters",
    );
  });

  it("should throw an error for invalid semantic version formats", () => {
    const invalidVersions = ["testd", "1....2", "test.1.0"];
    for (const version of invalidVersions) {
      expect(() => toSemver(version)).toThrowError(
        `${version} is not a valid semantic version. Should be in the format of major.minor.patch. Ex: 0.4.1`,
      );
    }
  });
});

describe("isIncrementalVersion", () => {
  it("should return true for valid incremental versions", () => {
    expect(isIncrementalVersion("1.0.0", "2.0.0")).toBe(true); // Major increment
    expect(isIncrementalVersion("1.0.0", "1.1.0")).toBe(true); // Minor increment
    expect(isIncrementalVersion("1.1.0", "1.1.1")).toBe(true); // Patch increment
  });

  it("should return false for non-incremental versions", () => {
    expect(isIncrementalVersion("2.0.0", "1.0.0")).toBe(false); // Major decrement
    expect(isIncrementalVersion("1.1.0", "1.0.0")).toBe(false); // Minor decrement
    expect(isIncrementalVersion("1.1.1", "1.1.0")).toBe(false); // Patch decrement
    expect(isIncrementalVersion("1.1.1", "1.1.1")).toBe(false); // Same version
  });

  it("should handle whitespace around version strings", () => {
    expect(isIncrementalVersion("  1.0.0", "2.0.0  ")).toBe(true);
  });

  it("should throw errors for invalid version inputs", () => {
    expect(() => isIncrementalVersion("invalid", "1.0.0")).toThrow();
    expect(() => isIncrementalVersion("1.0.0", "invalid")).toThrow();
    expect(() => isIncrementalVersion("invalid", "invalid")).toThrow();
  });

  it("should correctly handle complex version comparisons", () => {
    expect(isIncrementalVersion("1.0.0", "1.1.0")).toBe(true);
    expect(isIncrementalVersion("1.1.0", "1.1.1")).toBe(true);
    expect(isIncrementalVersion("1.1.1", "2.0.0")).toBe(true);
    expect(isIncrementalVersion("1.1.1", "0.9.9")).toBe(false);
  });
});
