import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ThirdwebClient } from "../../../client/client.js";
import type {
  BridgePrepareRequest,
  UseBridgePrepareParams,
} from "./useBridgePrepare.js";

// Mock client
const mockClient = { clientId: "test" } as ThirdwebClient;

describe("useBridgePrepare", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have correct type structure for buy prepare request", () => {
    const buyRequest: BridgePrepareRequest = {
      type: "buy",
      client: mockClient,
      originChainId: 1,
      originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      destinationChainId: 137,
      destinationTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      amount: 1000000n,
      sender: "0x1234567890123456789012345678901234567890",
      receiver: "0x1234567890123456789012345678901234567890",
    };

    expect(buyRequest.type).toBe("buy");
    expect(buyRequest.amount).toBe(1000000n);
    expect(buyRequest.client).toBe(mockClient);
  });

  it("should have correct type structure for transfer prepare request", () => {
    const transferRequest: BridgePrepareRequest = {
      type: "transfer",
      client: mockClient,
      chainId: 1,
      tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      amount: 1000000n,
      sender: "0x1234567890123456789012345678901234567890",
      receiver: "0x1234567890123456789012345678901234567890",
    };

    expect(transferRequest.type).toBe("transfer");
    expect(transferRequest.amount).toBe(1000000n);
    expect(transferRequest.client).toBe(mockClient);
  });

  it("should have correct type structure for sell prepare request", () => {
    const sellRequest: BridgePrepareRequest = {
      type: "sell",
      client: mockClient,
      originChainId: 1,
      originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      destinationChainId: 137,
      destinationTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      amount: 1000000n,
      sender: "0x1234567890123456789012345678901234567890",
      receiver: "0x1234567890123456789012345678901234567890",
    };

    expect(sellRequest.type).toBe("sell");
    expect(sellRequest.amount).toBe(1000000n);
    expect(sellRequest.client).toBe(mockClient);
  });

  it("should have correct type structure for onramp prepare request", () => {
    const onrampRequest: BridgePrepareRequest = {
      type: "onramp",
      client: mockClient,
      onramp: "stripe",
      chainId: 137,
      tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      receiver: "0x1234567890123456789012345678901234567890",
      amount: 1000000n,
    };

    expect(onrampRequest.type).toBe("onramp");
    expect(onrampRequest.amount).toBe(1000000n);
    expect(onrampRequest.client).toBe(mockClient);
  });

  it("should handle UseBridgePrepareParams with enabled option", () => {
    const params: UseBridgePrepareParams = {
      type: "buy",
      client: mockClient,
      originChainId: 1,
      originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      destinationChainId: 137,
      destinationTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      amount: 1000000n,
      sender: "0x1234567890123456789012345678901234567890",
      receiver: "0x1234567890123456789012345678901234567890",
      enabled: false,
    };

    expect(params.enabled).toBe(false);
    expect(params.type).toBe("buy");
  });

  it("should have optional enabled parameter", () => {
    const paramsWithoutEnabled: UseBridgePrepareParams = {
      type: "transfer",
      client: mockClient,
      chainId: 1,
      tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      amount: 1000000n,
      sender: "0x1234567890123456789012345678901234567890",
      receiver: "0x1234567890123456789012345678901234567890",
    };

    expect(paramsWithoutEnabled.enabled).toBeUndefined(); // Should be optional
    expect(paramsWithoutEnabled.type).toBe("transfer");
  });

  it("should correctly discriminate between different prepare request types", () => {
    const buyRequest: BridgePrepareRequest = {
      type: "buy",
      client: mockClient,
      originChainId: 1,
      originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      destinationChainId: 137,
      destinationTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      amount: 1000000n,
      sender: "0x1234567890123456789012345678901234567890",
      receiver: "0x1234567890123456789012345678901234567890",
    };

    // Type narrowing should work
    if (buyRequest.type === "buy") {
      expect(buyRequest.sender).toBe(
        "0x1234567890123456789012345678901234567890",
      );
      expect(buyRequest.receiver).toBe(
        "0x1234567890123456789012345678901234567890",
      );
    }

    const onrampRequest: BridgePrepareRequest = {
      type: "onramp",
      client: mockClient,
      onramp: "stripe",
      chainId: 137,
      tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      receiver: "0x1234567890123456789012345678901234567890",
      amount: 1000000n,
    };

    // Type narrowing should work for onramp
    if (onrampRequest.type === "onramp") {
      expect(onrampRequest.receiver).toBe(
        "0x1234567890123456789012345678901234567890",
      );
      expect(onrampRequest.tokenAddress).toBe(
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      );
      expect(onrampRequest.onramp).toBe("stripe");
    }
  });
});
