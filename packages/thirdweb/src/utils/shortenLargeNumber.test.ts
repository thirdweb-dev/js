import { describe, expect, it } from "vitest";
import { shortenLargeNumber } from "./shortenLargeNumber.js";

describe("shortenLargeNumber", () => {
  it("should not affect number below 10000", () => {
    expect(shortenLargeNumber(1000)).toBe("1000");
  });
  it("should shorten the number to `k`", () => {
    expect(shortenLargeNumber(10000)).toBe("10k");
  });
  it("should shorten the number to `M`", () => {
    expect(shortenLargeNumber(1_000_000)).toBe("1M");
  });
  it("should shorten the number to `B`", () => {
    expect(shortenLargeNumber(1_000_000_000)).toBe("1B");
  });

  it("should not affect number below 10000", () => {
    expect(shortenLargeNumber(1001)).toBe("1001");
  });
  it("should shorten the number to `k`", () => {
    expect(shortenLargeNumber(11100)).toBe("11.1k");
  });
  it("should shorten the number to `M`", () => {
    expect(shortenLargeNumber(1_100_000)).toBe("1.1M");
  });
  it("should shorten the number to `B`", () => {
    expect(shortenLargeNumber(1_100_000_001)).toBe("1.1B");
  });
});
