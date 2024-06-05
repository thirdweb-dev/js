import { describe, expect, it } from "vitest";
import { shortenString } from "./addresses.js";

const testAddress = "0x0000000000000000000000000000000000000000";

describe("react: addresses test", () => {
  it("should shorten string <extraShort === true>", () => {
    expect(shortenString(testAddress, true)).toBe("0x00...000");
  });

  it("should shorten string <extraShort === false>", () => {
    expect(shortenString(testAddress, false)).toBe("0x0000...0000");
  });
});
