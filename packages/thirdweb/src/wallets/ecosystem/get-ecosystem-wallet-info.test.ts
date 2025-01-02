import { describe, expect, it, vi } from "vitest";
import { getEcosystemWalletInfo } from "./get-ecosystem-wallet-info.js";

const mocks = vi.hoisted(() => ({
  getThirdwebBaseUrl: vi.fn(),
}));

vi.mock("../../utils/domains", () => ({
  getThirdwebBaseUrl: mocks.getThirdwebBaseUrl,
}));

describe("getEcosystemWalletInfo", () => {
  it("should fetch wallet metadata successfully", async () => {
    const walletId = "ecosystem.123";
    const mockResponse = {
      name: "Test Wallet",
      imageUrl: "http://example.com/image.png",
      homepage: "http://example.com",
    };
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch = fetchMock;
    mocks.getThirdwebBaseUrl.mockReturnValue("http://baseurl.com");

    const result = await getEcosystemWalletInfo(walletId);

    expect(fetchMock).toHaveBeenCalled();
    expect(result).toEqual({
      id: walletId,
      name: "Test Wallet",
      image_id: "http://example.com/image.png",
      homepage: "http://example.com",
      rdns: null,
      app: {
        browser: null,
        ios: null,
        android: null,
        mac: null,
        windows: null,
        linux: null,
        opera: null,
        chrome: null,
        firefox: null,
        safari: null,
        edge: null,
      },
      mobile: {
        native: null,
        universal: null,
      },
      desktop: {
        native: null,
        universal: null,
      },
    });
  });
});
