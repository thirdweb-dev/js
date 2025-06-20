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
      amount: 1000000n,
      client: mockClient,
      destinationChainId: 137,
      destinationTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      originChainId: 1,
      originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      receiver: "0x1234567890123456789012345678901234567890",
      sender: "0x1234567890123456789012345678901234567890",
      type: "buy",
    };

    expect(buyRequest.type).toBe("buy");
    expect(buyRequest.amount).toBe(1000000n);
    expect(buyRequest.client).toBe(mockClient);
  });

  it("should have correct type structure for transfer prepare request", () => {
    const transferRequest: BridgePrepareRequest = {
      amount: 1000000n,
      chainId: 1,
      client: mockClient,
      receiver: "0x1234567890123456789012345678901234567890",
      sender: "0x1234567890123456789012345678901234567890",
      tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      type: "transfer",
    };

    expect(transferRequest.type).toBe("transfer");
    expect(transferRequest.amount).toBe(1000000n);
    expect(transferRequest.client).toBe(mockClient);
  });

  it("should have correct type structure for sell prepare request", () => {
    const sellRequest: BridgePrepareRequest = {
      amount: 1000000n,
      client: mockClient,
      destinationChainId: 137,
      destinationTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      originChainId: 1,
      originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      receiver: "0x1234567890123456789012345678901234567890",
      sender: "0x1234567890123456789012345678901234567890",
      type: "sell",
    };

    expect(sellRequest.type).toBe("sell");
    expect(sellRequest.amount).toBe(1000000n);
    expect(sellRequest.client).toBe(mockClient);
  });

  it("should have correct type structure for onramp prepare request", () => {
    const onrampRequest: BridgePrepareRequest = {
      amount: 1000000n,
      chainId: 137,
      client: mockClient,
      onramp: "stripe",
      receiver: "0x1234567890123456789012345678901234567890",
      tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      type: "onramp",
    };

    expect(onrampRequest.type).toBe("onramp");
    expect(onrampRequest.amount).toBe(1000000n);
    expect(onrampRequest.client).toBe(mockClient);
  });

  it("should handle UseBridgePrepareParams with enabled option", () => {
    const params: UseBridgePrepareParams = {
      amount: 1000000n,
      client: mockClient,
      destinationChainId: 137,
      destinationTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      enabled: false,
      originChainId: 1,
      originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      receiver: "0x1234567890123456789012345678901234567890",
      sender: "0x1234567890123456789012345678901234567890",
      type: "buy",
    };

    expect(params.enabled).toBe(false);
    expect(params.type).toBe("buy");
  });

  it("should have optional enabled parameter", () => {
    const paramsWithoutEnabled: UseBridgePrepareParams = {
      amount: 1000000n,
      chainId: 1,
      client: mockClient,
      receiver: "0x1234567890123456789012345678901234567890",
      sender: "0x1234567890123456789012345678901234567890",
      tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      type: "transfer",
    };

    expect(paramsWithoutEnabled.enabled).toBeUndefined(); // Should be optional
    expect(paramsWithoutEnabled.type).toBe("transfer");
  });

  it("should correctly discriminate between different prepare request types", () => {
    const buyRequest: BridgePrepareRequest = {
      amount: 1000000n,
      client: mockClient,
      destinationChainId: 137,
      destinationTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      originChainId: 1,
      originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      receiver: "0x1234567890123456789012345678901234567890",
      sender: "0x1234567890123456789012345678901234567890",
      type: "buy",
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
      amount: 1000000n,
      chainId: 137,
      client: mockClient,
      onramp: "stripe",
      receiver: "0x1234567890123456789012345678901234567890",
      tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      type: "onramp",
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
