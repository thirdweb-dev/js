// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import { createQROverlay } from "./qr-overlay.js";

const URI = "wc:1234@2?relay-protocol=irn&symKey=abcd";

/**
 * The overlay is identified by its own styling rather than by any attribute it
 * sets, so these tests describe observable behaviour rather than implementation.
 */
function overlayElements(): HTMLElement[] {
  return Array.from(document.body.children).filter(
    (el): el is HTMLElement =>
      el instanceof HTMLElement && el.style.zIndex === "9999",
  );
}

describe("createQROverlay", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("keeps the overlay clickable when the host page disables pointer events on body", () => {
    // Modal libraries commonly do this while a dialog is open.
    document.body.style.pointerEvents = "none";

    const overlay = createQROverlay(URI);

    const [root] = overlayElements();
    expect(root).toBeDefined();
    // Without an explicit value the overlay inherits `none` from body and
    // becomes unclickable despite being visible.
    expect(root?.style.pointerEvents).toBe("auto");

    overlay.destroy();
  });

  it("replaces an overlay left behind by a previous attempt instead of stacking", () => {
    createQROverlay(URI);
    createQROverlay(URI);

    expect(overlayElements()).toHaveLength(1);
  });
});
