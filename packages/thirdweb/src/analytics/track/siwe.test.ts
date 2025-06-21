import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { ThirdwebClient } from "../../client/client.js";
import { trackLogin } from "./siwe.js";

const server = setupServer(
  http.post("https://c.thirdweb.com/event", () => {
    return HttpResponse.json({});
  }),
);

describe("SIWE tracking", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const mockClient: ThirdwebClient = {
    clientId: "test-client-id",
    secretKey: undefined,
  };

  it("should track successful logins", async () => {
    let requestBody: unknown;
    server.use(
      http.post("https://c.thirdweb.com/event", async (handler) => {
        requestBody = await handler.request.json();
        return HttpResponse.json({});
      }),
    );

    await trackLogin({
      chainId: 1,
      client: mockClient,
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "metamask",
    });

    expect(requestBody).toEqual({
      action: "login:attempt",
      chainId: 1,
      clientId: "test-client-id",
      errorCode: undefined,
      source: "sdk",
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "metamask",
    });
  });

  it("should track login errors", async () => {
    let requestBody: unknown;
    server.use(
      http.post("https://c.thirdweb.com/event", async (handler) => {
        requestBody = await handler.request.json();
        return HttpResponse.json({});
      }),
    );

    await trackLogin({
      chainId: 1,
      client: mockClient,
      error: {
        code: "SIGNATURE_VERIFICATION_FAILED",
        message: "Signature verification failed",
      },
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "metamask",
    });

    expect(requestBody).toEqual({
      action: "login:attempt",
      chainId: 1,
      clientId: "test-client-id",
      errorCode:
        '{"code":"SIGNATURE_VERIFICATION_FAILED","message":"Signature verification failed"}',
      source: "sdk",
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "metamask",
    });
  });

  it("should send a POST request with correct headers", async () => {
    let requestHeaders: Headers | undefined;
    server.use(
      http.post("https://c.thirdweb.com/event", (handler) => {
        requestHeaders = handler.request.headers;
        return HttpResponse.json({});
      }),
    );

    await trackLogin({
      chainId: 1,
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
