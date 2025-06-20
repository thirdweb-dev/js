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
      homepage: "http://example.com",
      imageUrl: "http://example.com/image.png",
      name: "Test Wallet",
    };
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch = fetchMock;
    mocks.getThirdwebBaseUrl.mockReturnValue("http://baseurl.com");

    const result = await getEcosystemWalletInfo(walletId);

    expect(fetchMock).toHaveBeenCalled();
    expect(result).toEqual({
      app: {
        android: null,
        browser: null,
        chrome: null,
        edge: null,
        firefox: null,
        ios: null,
        linux: null,
        mac: null,
        opera: null,
        safari: null,
        windows: null,
      },
      desktop: {
        native: null,
        universal: null,
      },
      homepage: "http://example.com",
      id: walletId,
      image_id: "http://example.com/image.png",
      mobile: {
        native: null,
        universal: null,
      },
      name: "Test Wallet",
      rdns: null,
    });
  });
});
