import { describe, expect, it } from "vitest";
import { getBuyTokenAmountFontSize } from "./utils.js";

describe("getBuyTokenAmountFontSize", () => {
  it("returns 26px for strings longer than 10 characters", () => {
    expect(getBuyTokenAmountFontSize("12345678901")).toBe("26px");
    expect(getBuyTokenAmountFontSize("1234567890123")).toBe("26px");
  });

  it("returns 34px for strings longer than 6 characters but not more than 10", () => {
    expect(getBuyTokenAmountFontSize("1234567")).toBe("34px");
    expect(getBuyTokenAmountFontSize("1234567890")).toBe("34px");
  });

  it("returns 50px for strings 6 characters or shorter", () => {
    expect(getBuyTokenAmountFontSize("123456")).toBe("50px");
    expect(getBuyTokenAmountFontSize("12345")).toBe("50px");
    expect(getBuyTokenAmountFontSize("")).toBe("50px");
  });
});
