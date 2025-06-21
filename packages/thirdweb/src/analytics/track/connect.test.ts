import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { ThirdwebClient } from "../../client/client.js";
import { trackConnect } from "./connect.js";

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

    let requestBody: unknown;
    server.use(
      http.post("https://c.thirdweb.com/event", async (handler) => {
        requestBody = await handler.request.json();
        return HttpResponse.json({});
      }),
    );

    await trackConnect({
      client: mockClient,
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "metamask",
    });

    expect(requestBody).toEqual({
      action: "connect",
      source: "connectWallet",
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "metamask",
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

    await trackConnect({
      client: mockClient,
      ecosystem: {
        id: "ecosystem.test-ecosystem-id",
        partnerId: "test-partner-id",
      },
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "metamask",
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
