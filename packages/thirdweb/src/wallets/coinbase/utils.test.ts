import type { ProviderInterface } from "@coinbase/wallet-sdk";
import { describe, expect, it, vi } from "vitest";
import { showCoinbasePopup } from "./utils.js";

describe("showCoinbasePopup", () => {
  it("should call waitForPopupLoaded if communicator and waitForPopupLoaded exist", async () => {
    const mockWaitForPopupLoaded = vi.fn();
    const mockProvider: Partial<ProviderInterface> = {
      // @ts-ignore Test
      communicator: {
        waitForPopupLoaded: mockWaitForPopupLoaded,
      },
    };

    await showCoinbasePopup(mockProvider as ProviderInterface);

    expect(mockWaitForPopupLoaded).toHaveBeenCalledTimes(1);
  });

  it("should not throw an error if communicator or waitForPopupLoaded is missing", async () => {
    const mockProvider: Partial<ProviderInterface> = {}; // No communicator or waitForPopupLoaded

    await expect(
      showCoinbasePopup(mockProvider as ProviderInterface),
    ).resolves.not.toThrow();
  });
});
