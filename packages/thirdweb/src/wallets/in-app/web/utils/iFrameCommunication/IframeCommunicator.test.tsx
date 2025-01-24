import { beforeEach, describe, expect, it, vi } from "vitest";
import { IframeCommunicator } from "./IframeCommunicator.js";

describe("IframeCommunicator", () => {
  // biome-ignore lint/suspicious/noExplicitAny: mock
  let mockLocalStorage: any;
  let mockContainer: HTMLElement;
  let mockIframe: HTMLIFrameElement;

  beforeEach(() => {
    // Mock localStorage
    vi.restoreAllMocks();

    mockLocalStorage = {
      getAuthCookie: vi.fn().mockResolvedValue("mockAuthCookie"),
      getDeviceShare: vi.fn().mockResolvedValue("mockDeviceShare"),
      getWalletUserId: vi.fn().mockResolvedValue("mockWalletUserId"),
    };
    // Mock DOM elements
    mockContainer = document.createElement("div");
    mockIframe = document.createElement("iframe");
    vi.spyOn(document, "createElement").mockReturnValue(mockIframe);
    vi.spyOn(document, "getElementById").mockReturnValue(null);
  });

  it("should create an iframe with correct properties", () => {
    new IframeCommunicator({
      link: "https://example.com",
      baseUrl: "https://example.com",
      iframeId: "test-iframe",
      container: mockContainer,
      localStorage: mockLocalStorage,
      clientId: "test-client",
    });

    expect(document.createElement).toHaveBeenCalledWith("iframe");
    expect(mockIframe.id).toBe("test-iframe");
    expect(mockIframe.src).toBe("https://example.com/");
    expect(mockIframe.style.display).toBe("none");
  });

  it("should initialize with correct variables", async () => {
    const communicator = new IframeCommunicator({
      link: "https://example.com",
      baseUrl: "https://example.com",
      iframeId: "test-iframe",
      container: mockContainer,
      localStorage: mockLocalStorage,
      clientId: "test-client",
    });

    // biome-ignore lint/complexity/useLiteralKeys: accessing protected method
    const vars = await communicator["onIframeLoadedInitVariables"]();

    expect(vars).toEqual({
      authCookie: "mockAuthCookie",
      deviceShareStored: "mockDeviceShare",
      walletUserId: "mockWalletUserId",
      clientId: "test-client",
      partnerId: undefined,
      ecosystemId: undefined,
    });
  });

  it("should throw error when calling methods without iframe", async () => {
    const temp = global.document;
    // @ts-expect-error - Testing undefined document scenario
    global.document = undefined;

    const communicator = new IframeCommunicator({
      link: "https://example.com",
      baseUrl: "https://example.com",
      iframeId: "test-iframe",
      localStorage: mockLocalStorage,
      clientId: "test-client",
    });

    await expect(
      communicator.call({
        procedureName: "test",
        params: {},
      }),
    ).rejects.toThrow("Iframe not found");
    global.document = temp;
  });

  it("should cleanup on destroy", () => {
    const communicator = new IframeCommunicator({
      link: "https://example.com",
      baseUrl: "https://example.com",
      iframeId: "test-iframe",
      container: mockContainer,
      localStorage: mockLocalStorage,
      clientId: "test-client",
    });

    communicator.destroy();

    // biome-ignore lint/complexity/useLiteralKeys: accessing protected field
    expect(communicator["iframe"]).toBeDefined();
  });
});
