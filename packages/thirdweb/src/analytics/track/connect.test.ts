import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { trackConnect } from "./connect.js";
import type { ThirdwebClient } from "../../client/client.js";

const server = setupServer(
  http.post("https://c.thirdweb.com/event", () => {
    return HttpResponse.json({});
  }),
);

describe("trackConnect", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should send a POST request with correct data", async () => {
    const mockClient: ThirdwebClient = {
      clientId: "test-client-id",
      secretKey: undefined,
    };

    let requestBody: any;
    server.use(
      http.post("https://c.thirdweb.com/event", async (handler) => {
        requestBody = await handler.request.json();
        return HttpResponse.json({});
      }),
    );

    await trackConnect({
      client: mockClient,
      walletType: "metamask",
      walletAddress: "0x1234567890123456789012345678901234567890",
    });

    expect(requestBody).toEqual({
      source: "connectWallet",
      action: "connect",
      walletType: "metamask",
      walletAddress: "0x1234567890123456789012345678901234567890",
    });
  });

  it("should send a POST request with correct headers", async () => {
    const mockClient: ThirdwebClient = {
      clientId: "test-client-id",
      secretKey: undefined,
    };

    let requestHeaders: any;
    server.use(
      http.post("https://c.thirdweb.com/event", (handler) => {
        requestHeaders = handler.request.headers;
        return HttpResponse.json({});
      }),
    );

    await trackConnect({
      client: mockClient,
      ecosystem: {
        id: "ecosystem.test-ecosystem-id",
        partnerId: "test-partner-id",
      },
      walletType: "metamask",
      walletAddress: "0x1234567890123456789012345678901234567890",
    });

    expect(requestHeaders.get("x-client-id")).toEqual("test-client-id");
    expect(requestHeaders.get("x-ecosystem-id")).toEqual(
      "ecosystem.test-ecosystem-id",
    );
    expect(requestHeaders.get("x-ecosystem-partner-id")).toEqual(
      "test-partner-id",
    );
  });
});
