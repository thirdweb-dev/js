import { describe, expect, it } from "vitest";
import { isValidENSName } from "./isValidENSName.js";

describe("isValidENSName", () => {
  it("should return true for a valid ENS name", () => {
    expect(isValidENSName("thirdweb.eth")).toBe(true);
    expect(isValidENSName("deployer.thirdweb.eth")).toBe(true);
    expect(isValidENSName("x.eth")).toBe(true);
    expect(isValidENSName("foo.bar.com")).toBe(true);
    expect(isValidENSName("foo.com")).toBe(true);
    expect(isValidENSName("somename.xyz")).toBe(true);
    expect(isValidENSName("_foo.bar")).toBe(true);
    expect(isValidENSName("-foo.bar.com")).toBe(true);
  });

  it("should return false for an invalid ENS name", () => {
    // No TLD
    expect(isValidENSName("")).toBe(false);
    expect(isValidENSName("foo")).toBe(false);

    // parts with length < 2
    expect(isValidENSName(".eth")).toBe(false);
    expect(isValidENSName("foo..com")).toBe(false);
    expect(isValidENSName("thirdweb.eth.")).toBe(false);

    // numeric TLD
    expect(isValidENSName("foo.123")).toBe(false);

    // whitespace in parts
    expect(isValidENSName("foo .com")).toBe(false);
    expect(isValidENSName("foo. com")).toBe(false);

    // full-width characters
    expect(isValidENSName("ｆｏｏ.bar.com")).toBe(false);

    // wildcard characters
    expect(isValidENSName("foo*bar.com")).toBe(false);
  });
});
