import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { ThirdwebClient } from "../../client/client.js";
import {
  trackInsufficientFundsError,
  trackTransaction,
} from "./transaction.js";

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
      chainId: 1,
      client: mockClient,
      contractAddress: "0x0987654321098765432109876543210987654321",
      functionName: "transfer",
      gasPrice: BigInt(20000000000),
      transactionHash: "0xabcdef1234567890",
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "io.metamask",
    });

    expect(requestBody).toEqual({
      action: "transaction:sent",
      chainId: 1,
      clientId: "test-client-id",
      contractAddress: "0x0987654321098765432109876543210987654321",
      errorCode: undefined,
      functionName: "transfer",
      gasPrice: "20000000000",
      source: "sdk",
      transactionHash: "0xabcdef1234567890",
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "io.metamask",
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
      chainId: 1,
      client: mockClient,
      error: {
        code: "INSUFFICIENT_FUNDS",
        message: "Insufficient funds",
      },
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "io.metamask",
    });

    expect(requestBody).toEqual({
      action: "transaction:sent",
      chainId: 1,
      clientId: "test-client-id",
      errorCode: '{"code":"INSUFFICIENT_FUNDS","message":"Insufficient funds"}',
      source: "sdk",
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "io.metamask",
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
      chainId: 1,
      client: mockClient,
      contractAddress: "0x0987654321098765432109876543210987654321",
      ecosystem: {
        id: "ecosystem.test-ecosystem-id",
        partnerId: "test-partner-id",
      },
      functionName: "transfer",
      gasPrice: BigInt(20000000000),
      transactionHash: "0xabcdef1234567890",
      walletAddress: "0x1234567890123456789012345678901234567890",
      walletType: "io.metamask",
    });

    expect(requestHeaders?.get("x-client-id")).toEqual("test-client-id");
    expect(requestHeaders?.get("x-ecosystem-id")).toEqual(
      "ecosystem.test-ecosystem-id",
    );
    expect(requestHeaders?.get("x-ecosystem-partner-id")).toEqual(
      "test-partner-id",
    );
  });

  it("should track insufficient funds error with correct data", async () => {
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

    const mockError = new Error("Insufficient funds for gas * price + value");

    await trackInsufficientFundsError({
      chainId: 1,
      client: mockClient,
      contractAddress: "0xcontract",
      error: mockError,
      transactionValue: 1000000000000000000n,
      walletAddress: "0x1234567890123456789012345678901234567890",
    });

    expect(requestBody).toEqual({
      action: "transaction:insufficient_funds",
      chainId: 1,
      clientId: "test-client-id",
      contractAddress: "0xcontract",
      errorCode: undefined,
      errorMessage: "Insufficient funds for gas * price + value",
      requiredAmount: undefined,
      source: "sdk",
      transactionValue: "1000000000000000000",
      userBalance: undefined,
      walletAddress: "0x1234567890123456789012345678901234567890",
    });
  });

  it("should not throw an error if insufficient funds tracking request fails", async () => {
    const mockClient: ThirdwebClient = {
      clientId: "test-client-id",
      secretKey: undefined,
    };

    server.use(
      http.post("https://c.thirdweb.com/event", () => {
        return HttpResponse.error();
      }),
    );

    const mockError = new Error("insufficient funds");

    expect(() =>
      trackInsufficientFundsError({
        chainId: 137,
        client: mockClient,
        error: mockError,
        walletAddress: "0x1234567890123456789012345678901234567890",
      }),
    ).not.toThrowError();

    // Wait for the asynchronous POST request to complete
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it("should track insufficient funds error during transaction preparation", async () => {
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

    const mockError = new Error("insufficient funds for gas");

    await trackInsufficientFundsError({
      chainId: 42,
      client: mockClient,
      contractAddress: "0x0987654321098765432109876543210987654321",
      error: mockError,
      walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    });

    expect(requestBody).toEqual({
      action: "transaction:insufficient_funds",
      chainId: 42,
      clientId: "test-client-id",
      contractAddress: "0x0987654321098765432109876543210987654321",
      errorCode: undefined,
      errorMessage: "insufficient funds for gas",
      requiredAmount: undefined,
      source: "sdk",
      transactionValue: undefined,
      userBalance: undefined,
      walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    });
  });
});
