import { describe, expect, it } from "vitest";
import { formatSeconds } from "./formatSeconds.js";

describe("formatSeconds", () => {
  it("formats seconds to hours and minutes when over 3600 seconds", () => {
    expect(formatSeconds(3601)).toBe("1 Hours 0 Minutes");
    expect(formatSeconds(7200)).toBe("2 Hours 0 Minutes");
    expect(formatSeconds(5400)).toBe("1 Hours 30 Minutes");
    expect(formatSeconds(12345)).toBe("3 Hours 25 Minutes");
  });

  it("formats seconds to minutes when between 61 and 3600 seconds", () => {
    expect(formatSeconds(61)).toBe("2 Minutes");
    expect(formatSeconds(120)).toBe("2 Minutes");
    expect(formatSeconds(3599)).toBe("60 Minutes");
    expect(formatSeconds(1800)).toBe("30 Minutes");
  });

  it('formats seconds to "Xs" when 60 seconds or less', () => {
    expect(formatSeconds(60)).toBe("60s");
    expect(formatSeconds(59)).toBe("59s");
    expect(formatSeconds(1)).toBe("1s");
    expect(formatSeconds(0)).toBe("0s");
  });

  it("handles decimal inputs by rounding down for hours/minutes and up for minutes only", () => {
    expect(formatSeconds(3661.5)).toBe("1 Hours 1 Minutes");
    expect(formatSeconds(119.9)).toBe("2 Minutes");
  });
});
