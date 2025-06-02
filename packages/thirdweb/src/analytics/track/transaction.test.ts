import { http, HttpResponse } from "msw";
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
      client: mockClient,
      error: mockError,
      walletAddress: "0x1234567890123456789012345678901234567890",
      chainId: 1,
      contractAddress: "0xcontract",
      transactionValue: 1000000000000000000n,
    });

    expect(requestBody).toEqual({
      source: "sdk",
      action: "transaction:insufficient_funds",
      clientId: "test-client-id",
      chainId: 1,
      walletAddress: "0x1234567890123456789012345678901234567890",
      contractAddress: "0xcontract",
      transactionValue: "1000000000000000000",
      requiredAmount: undefined,
      userBalance: undefined,
      errorMessage: "Insufficient funds for gas * price + value",
      errorCode: undefined,
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
        client: mockClient,
        error: mockError,
        walletAddress: "0x1234567890123456789012345678901234567890",
        chainId: 137,
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
      client: mockClient,
      error: mockError,
      walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      chainId: 42,
      contractAddress: "0x0987654321098765432109876543210987654321",
    });

    expect(requestBody).toEqual({
      source: "sdk",
      action: "transaction:insufficient_funds",
      clientId: "test-client-id",
      chainId: 42,
      walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      contractAddress: "0x0987654321098765432109876543210987654321",
      transactionValue: undefined,
      requiredAmount: undefined,
      userBalance: undefined,
      errorMessage: "insufficient funds for gas",
      errorCode: undefined,
    });
  });
});
