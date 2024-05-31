import { describe, expect, it } from "vitest";
import { wideModalScreenThreshold } from "../ui/ConnectWallet/constants.js";
import { canFitWideModal } from "./canFitWideModal.js";

describe("canFitWideModal", () => {
  it("should return true if window width is >= wideModalScreenThreshold", () => {
    // Mock the window object and set innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: wideModalScreenThreshold,
    });
    expect(canFitWideModal()).toBe(true);
    window.innerWidth = wideModalScreenThreshold + 1;
    expect(canFitWideModal()).toBe(true);
  });

  it("returns false if window width is < wideModalScreenThreshold", () => {
    // Mock the window object and set innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: wideModalScreenThreshold - 1,
    });
    expect(canFitWideModal()).toBe(false);
  });

  it("returns false if window is undefined", () => {
    // Mock the window object to be undefined
    const originalWindow = global.window;
    // @ts-ignore - Not sure if this is the best way to mock the undefined `window` object
    global.window = undefined;
    expect(canFitWideModal()).toBe(false);
    global.window = originalWindow;
  });
});
