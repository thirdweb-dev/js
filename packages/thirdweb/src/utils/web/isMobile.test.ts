// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { isMobile } from "./isMobile.js";

const DESKTOP_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36";

function setUserAgent(userAgent: string) {
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(userAgent);
}

function setViewportWidth(width: number) {
  vi.spyOn(window, "innerWidth", "get").mockReturnValue(width);
}

describe("isMobile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false for a desktop browser with a narrow viewport", () => {
    setUserAgent(DESKTOP_UA);
    setViewportWidth(500);

    expect(isMobile()).toBe(false);
  });

  it("returns true for iOS", () => {
    setUserAgent(IPHONE_UA);

    expect(isMobile()).toBe(true);
  });

  it("returns true for Android", () => {
    setUserAgent(ANDROID_UA);

    expect(isMobile()).toBe(true);
  });
});
