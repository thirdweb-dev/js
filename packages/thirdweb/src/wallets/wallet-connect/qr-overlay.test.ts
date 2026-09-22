// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQROverlay } from "./qr-overlay.js";

const URI = "wc:1234@2?relay-protocol=irn&symKey=abcd";

function overlayElements(): HTMLElement[] {
  return Array.from(document.body.children).filter(
    (el): el is HTMLElement =>
      el instanceof HTMLElement && el.style.zIndex === "9999",
  );
}

function pressEscape() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
}

describe("createQROverlay", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.style.pointerEvents = "";
  });

  it("stays interactive when pointer events are disabled on body", () => {
    document.body.style.pointerEvents = "none";

    const overlay = createQROverlay(URI);

    expect(overlayElements()[0]?.style.pointerEvents).toBe("auto");
    overlay.destroy();
  });

  it("replaces the previous overlay instead of stacking", () => {
    createQROverlay(URI);
    const overlay = createQROverlay(URI);

    expect(overlayElements()).toHaveLength(1);
    overlay.destroy();
  });

  it("detaches the replaced overlay's listeners", () => {
    const firstCancel = vi.fn();
    const secondCancel = vi.fn();
    createQROverlay(URI, { onCancel: firstCancel });
    createQROverlay(URI, { onCancel: secondCancel });

    pressEscape();

    expect(firstCancel).not.toHaveBeenCalled();
    expect(secondCancel).toHaveBeenCalledTimes(1);
  });

  it("does not remove a newer overlay when an older one is destroyed", () => {
    const first = createQROverlay(URI);
    createQROverlay(URI);

    first.destroy();

    expect(overlayElements()).toHaveLength(1);
  });
});
