import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { ThirdwebClient } from "../../client/client.js";
import { trackPayEvent } from "./pay.js";

const server = setupServer(
  http.post("https://c.thirdweb.com/event", () => {
    return HttpResponse.json({});
  }),
);

describe("trackPayEvent", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should send a POST request with correct data", async () => {
    const mockClient: ThirdwebClient = {
      clientId: "test-client-id",
      secretKey: undefined,
    };

    let requestBody: unknown;
    server.use(
      http.post("https://c.thirdweb.com/event", async (handler) => {
        requestBody = await handler.request.json();
        return HttpResponse.json({});
      }),
    );

    await trackPayEvent({
      client: mockClient,
      event: "test-event",
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "io.metamask",
      fromToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      fromAmount: "1000000",
      toToken: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      toAmount: "1000000",
      chainId: 1,
      dstChainId: 137,
    });

    expect(requestBody).toEqual({
      source: "pay",
      action: "test-event",
      clientId: "test-client-id",
      chainId: 1,
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "io.metamask",
      tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      amountWei: "1000000",
      dstTokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      dstChainId: 1,
    });
  });

  it("should send a POST request with correct headers", async () => {
    const mockClient: ThirdwebClient = {
      clientId: "test-client-id",
      secretKey: undefined,
    };

    let requestHeaders: Headers | undefined;
    server.use(
      http.post("https://c.thirdweb.com/event", (handler) => {
        requestHeaders = handler.request.headers;
        return HttpResponse.json({});
      }),
    );

    await trackPayEvent({
      client: mockClient,
      ecosystem: {
        id: "ecosystem.test-ecosystem-id",
        partnerId: "test-partner-id",
      },
      event: "test-event",
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "io.metamask",
      fromToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      fromAmount: "1000000",
      toToken: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      toAmount: "1000000",
      chainId: 1,
      dstChainId: 137,
    });

    expect(requestHeaders?.get("x-client-id")).toEqual("test-client-id");
    expect(requestHeaders?.get("x-ecosystem-id")).toEqual(
      "ecosystem.test-ecosystem-id",
    );
    expect(requestHeaders?.get("x-ecosystem-partner-id")).toEqual(
      "test-partner-id",
    );
  });
});
