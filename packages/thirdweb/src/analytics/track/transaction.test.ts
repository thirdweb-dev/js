import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { ThirdwebClient } from "../../client/client.js";
import { trackTransaction } from "./transaction.js";

const server = setupServer(
  http.post("https://c.thirdweb.com/event", () => {
    return HttpResponse.json({});
  }),
);

describe("transaction tracking", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const mockClient: ThirdwebClient = {
    clientId: "test-client-id",
    secretKey: undefined,
  };

  it("should track successful transactions", async () => {
    let requestBody: unknown;
    server.use(
      http.post("https://c.thirdweb.com/event", async (handler) => {
        requestBody = await handler.request.json();
        return HttpResponse.json({});
      }),
    );

    await trackTransaction({
      client: mockClient,
      transactionHash: "0xabcdef1234567890",
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "io.metamask",
      chainId: 1,
      contractAddress: "0x0987654321098765432109876543210987654321",
      functionName: "transfer",
      gasPrice: BigInt(20000000000),
    });

    expect(requestBody).toEqual({
      source: "sdk",
      action: "transaction:sent",
      clientId: "test-client-id",
      transactionHash: "0xabcdef1234567890",
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "io.metamask",
      chainId: 1,
      contractAddress: "0x0987654321098765432109876543210987654321",
      functionName: "transfer",
      gasPrice: "20000000000",
      errorCode: undefined,
    });
  });

  it("should track transaction errors", async () => {
    let requestBody: unknown;
    server.use(
      http.post("https://c.thirdweb.com/event", async (handler) => {
        requestBody = await handler.request.json();
        return HttpResponse.json({});
      }),
    );

    await trackTransaction({
      client: mockClient,
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "io.metamask",
      chainId: 1,
      error: {
        message: "Insufficient funds",
        code: "INSUFFICIENT_FUNDS",
      },
    });

    expect(requestBody).toEqual({
      source: "sdk",
      action: "transaction:sent",
      clientId: "test-client-id",
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "io.metamask",
      chainId: 1,
      errorCode: '{"message":"Insufficient funds","code":"INSUFFICIENT_FUNDS"}',
      transactionHash: undefined,
      contractAddress: undefined,
      functionName: undefined,
      gasPrice: undefined,
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

    await trackTransaction({
      client: mockClient,
      ecosystem: {
        id: "ecosystem.test-ecosystem-id",
        partnerId: "test-partner-id",
      },
      transactionHash: "0xabcdef1234567890",
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "io.metamask",
      chainId: 1,
      contractAddress: "0x0987654321098765432109876543210987654321",
      functionName: "transfer",
      gasPrice: BigInt(20000000000),
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
