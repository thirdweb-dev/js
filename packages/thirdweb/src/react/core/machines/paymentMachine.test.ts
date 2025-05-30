/**
 * @vitest-environment happy-dom
 */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { TEST_IN_APP_WALLET_A } from "../../../../test/src/test-wallets.js";
import { defineChain } from "../../../chains/utils.js";
import type { AsyncStorage } from "../../../utils/storage/AsyncStorage.js";
import type { WindowAdapter } from "../adapters/WindowAdapter.js";
import type { BridgePrepareResult } from "../hooks/useBridgePrepare.js";
import {
  type PaymentMachineContext,
  type PaymentMethod,
  usePaymentMachine,
} from "./paymentMachine.js";

// Mock adapters
const mockWindowAdapter: WindowAdapter = {
  open: vi.fn().mockResolvedValue(undefined),
};

const mockStorage: AsyncStorage = {
  getItem: vi.fn().mockResolvedValue(null),
  setItem: vi.fn().mockResolvedValue(undefined),
  removeItem: vi.fn().mockResolvedValue(undefined),
};

const mockBuyQuote: BridgePrepareResult = {
  type: "buy",
  originAmount: 1000000000000000000n, // 1 ETH
  destinationAmount: 100000000n, // 100 USDC
  timestamp: Date.now(),
  estimatedExecutionTimeMs: 120000, // 2 minutes
  steps: [
    {
      originToken: {
        chainId: 1,
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
        priceUsd: 2500.0,
      },
      destinationToken: {
        chainId: 137,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        name: "USD Coin (PoS)",
        symbol: "USDC",
        decimals: 6,
        priceUsd: 1.0,
      },
      originAmount: 1000000000000000000n,
      destinationAmount: 100000000n,
      estimatedExecutionTimeMs: 120000,
      transactions: [
        {
          action: "approval" as const,
          id: "0x123" as const,
          to: "0x456" as const,
          data: "0x789" as const,
          chainId: 1,
          client: TEST_CLIENT,
          chain: defineChain(1),
        },
        {
          action: "buy" as const,
          id: "0xabc" as const,
          to: "0xdef" as const,
          data: "0x012" as const,
          value: 1000000000000000000n,
          chainId: 1,
          client: TEST_CLIENT,
          chain: defineChain(1),
        },
      ],
    },
  ],
  intent: {
    originChainId: 1,
    originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    destinationChainId: 137,
    destinationTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount: 100000000n,
    sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
    receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
  },
};

describe("PaymentMachine", () => {
  let adapters: PaymentMachineContext["adapters"];

  beforeEach(() => {
    adapters = {
      window: mockWindowAdapter,
      storage: mockStorage,
    };
  });

  it("should initialize in resolveRequirements state", () => {
    const { result } = renderHook(() =>
      usePaymentMachine(adapters, "fund_wallet"),
    );
    const [state] = result.current;

    expect(state.value).toBe("resolveRequirements");
    expect(state.context.mode).toBe("fund_wallet");
    expect(state.context.adapters).toBe(adapters);
  });

  it("should transition through happy path with wallet payment method", () => {
    const { result } = renderHook(() =>
      usePaymentMachine(adapters, "fund_wallet"),
    );

    // Resolve requirements
    act(() => {
      const [, send] = result.current;
      send({
        type: "REQUIREMENTS_RESOLVED",
        destinationChainId: 1,
        destinationTokenAddress: "0xA0b86a33E6425c03e54c4b45DCb6d75b6B72E2AA",
        destinationAmount: "100",
        receiverAddress: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      });
    });

    let [state] = result.current;
    expect(state.value).toBe("methodSelection");
    expect(state.context.destinationChainId).toBe(1);
    expect(state.context.destinationTokenAddress).toBe(
      "0xA0b86a33E6425c03e54c4b45DCb6d75b6B72E2AA",
    );
    expect(state.context.destinationAmount).toBe("100");
    expect(state.context.receiverAddress).toBe(
      "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
    );

    // Select wallet payment method
    const walletPaymentMethod: PaymentMethod = {
      type: "wallet",
      originToken: {
        chainId: 137,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        decimals: 18,
        symbol: "USDC",
        name: "USD Coin",
        priceUsd: 1.0,
      },
      payerWallet: TEST_IN_APP_WALLET_A,
      balance: 1000000000000000000n,
    };

    act(() => {
      const [, send] = result.current;
      send({
        type: "PAYMENT_METHOD_SELECTED",
        paymentMethod: walletPaymentMethod,
      });
    });

    [state] = result.current;
    expect(state.value).toBe("quote");
    expect(state.context.selectedPaymentMethod).toEqual(walletPaymentMethod);

    // Receive quote
    act(() => {
      const [, send] = result.current;
      send({
        type: "QUOTE_RECEIVED",
        preparedQuote: mockBuyQuote,
      });
    });

    [state] = result.current;
    expect(state.value).toBe("preview");
    expect(state.context.preparedQuote).toBe(mockBuyQuote);

    // Confirm route
    act(() => {
      const [, send] = result.current;
      send({
        type: "ROUTE_CONFIRMED",
      });
    });

    [state] = result.current;
    expect(state.value).toBe("execute");
    expect(state.context.selectedPaymentMethod).toBe(walletPaymentMethod);

    // Complete execution
    act(() => {
      const [, send] = result.current;
      send({
        type: "EXECUTION_COMPLETE",
        completedStatuses: [
          {
            type: "buy",
            status: "COMPLETED",
            paymentId: "test-payment-id",
            originAmount: 1000000000000000000n,
            destinationAmount: 100000000n,
            originChainId: 1,
            destinationChainId: 137,
            originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            destinationTokenAddress:
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            originToken: {
              chainId: 1,
              address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              symbol: "USDC",
              name: "USD Coin",
              decimals: 6,
              priceUsd: 1,
            },
            destinationToken: {
              chainId: 137,
              address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              symbol: "USDC",
              name: "USD Coin",
              decimals: 6,
              priceUsd: 1,
            },
            sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
            receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
            transactions: [
              {
                chainId: 1,
                transactionHash: "0xtest123",
              },
            ],
          },
        ],
      });
    });

    [state] = result.current;
    expect(state.value).toBe("success");
    expect(state.context.completedStatuses).toBeDefined();
    expect(state.context.completedStatuses).toHaveLength(1);
    expect(state.context.completedStatuses?.[0]?.status).toBe("COMPLETED");
  });

  it("should handle errors and allow retry", () => {
    const { result } = renderHook(() =>
      usePaymentMachine(adapters, "fund_wallet"),
    );

    const testError = new Error("Network error");
    act(() => {
      const [, send] = result.current;
      send({
        type: "ERROR_OCCURRED",
        error: testError,
      });
    });

    let [state] = result.current;
    expect(state.value).toBe("error");
    expect(state.context.currentError).toBe(testError);
    expect(state.context.retryState).toBe("resolveRequirements");

    // Retry should clear error and return to beginning
    act(() => {
      const [, send] = result.current;
      send({
        type: "RETRY",
      });
    });

    [state] = result.current;
    expect(state.value).toBe("resolveRequirements");
    expect(state.context.currentError).toBeUndefined();
    expect(state.context.retryState).toBeUndefined();
  });

  it("should preserve context data through transitions", () => {
    const { result } = renderHook(() =>
      usePaymentMachine(adapters, "fund_wallet"),
    );

    // Resolve requirements
    act(() => {
      const [, send] = result.current;
      send({
        type: "REQUIREMENTS_RESOLVED",
        destinationChainId: 42,
        destinationTokenAddress: "0xtest",
        destinationAmount: "50",
        receiverAddress: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      });
    });

    // Select payment method
    const paymentMethod: PaymentMethod = {
      type: "wallet",
      payerWallet: TEST_IN_APP_WALLET_A,
      originToken: {
        chainId: 137,
        address: "0xorigin",
        decimals: 18,
        symbol: "USDC",
        name: "USD Coin",
        priceUsd: 1.0,
      },
      balance: 1000000000000000000n,
    };

    act(() => {
      const [, send] = result.current;
      send({
        type: "PAYMENT_METHOD_SELECTED",
        paymentMethod,
      });
    });

    const [state] = result.current;
    // All context should be preserved
    expect(state.context.destinationChainId).toBe(42);
    expect(state.context.destinationTokenAddress).toBe("0xtest");
    expect(state.context.destinationAmount).toBe("50");
    expect(state.context.selectedPaymentMethod).toEqual(paymentMethod);
    expect(state.context.mode).toBe("fund_wallet");
    expect(state.context.adapters).toBe(adapters);
  });

  it("should handle state transitions correctly", () => {
    const { result } = renderHook(() =>
      usePaymentMachine(adapters, "fund_wallet"),
    );

    const [initialState] = result.current;
    expect(initialState.value).toBe("resolveRequirements");

    // Only REQUIREMENTS_RESOLVED should be valid from initial state
    act(() => {
      const [, send] = result.current;
      send({
        type: "PAYMENT_METHOD_SELECTED",
        paymentMethod: {
          type: "fiat",
          currency: "USD",
          payerWallet: TEST_IN_APP_WALLET_A,
          onramp: "stripe",
        },
      });
    });

    let [state] = result.current;
    expect(state.value).toBe("resolveRequirements"); // Should stay in same state for invalid transition

    // Valid transition
    act(() => {
      const [, send] = result.current;
      send({
        type: "REQUIREMENTS_RESOLVED",
        destinationChainId: 1,
        destinationTokenAddress: "0xtest",
        destinationAmount: "100",
        receiverAddress: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      });
    });

    [state] = result.current;
    expect(state.value).toBe("methodSelection");
  });

  it("should reset to initial state", () => {
    const { result } = renderHook(() =>
      usePaymentMachine(adapters, "fund_wallet"),
    );

    // Go through some states
    act(() => {
      const [, send] = result.current;
      send({
        type: "REQUIREMENTS_RESOLVED",
        destinationChainId: 1,
        destinationTokenAddress: "0xtest",
        destinationAmount: "100",
        receiverAddress: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      });
    });

    act(() => {
      const [, send] = result.current;
      send({
        type: "PAYMENT_METHOD_SELECTED",
        paymentMethod: {
          type: "fiat",
          currency: "USD",
          payerWallet: TEST_IN_APP_WALLET_A,
          onramp: "stripe",
        },
      });
    });

    let [state] = result.current;
    expect(state.value).toBe("quote");

    // Trigger error
    act(() => {
      const [, send] = result.current;
      send({
        type: "ERROR_OCCURRED",
        error: new Error("Test error"),
      });
    });

    [state] = result.current;
    expect(state.value).toBe("error");

    // Reset
    act(() => {
      const [, send] = result.current;
      send({
        type: "RESET",
      });
    });

    [state] = result.current;
    expect(state.value).toBe("resolveRequirements");
    // Context should still have adapters and mode but other data should be cleared
    expect(state.context.adapters).toBe(adapters);
    expect(state.context.mode).toBe("fund_wallet");
  });

  it("should handle error states from all major states", () => {
    const { result } = renderHook(() =>
      usePaymentMachine(adapters, "fund_wallet"),
    );

    // Test error from resolveRequirements
    act(() => {
      const [, send] = result.current;
      send({
        type: "ERROR_OCCURRED",
        error: new Error("Requirements error"),
      });
    });

    let [state] = result.current;
    expect(state.value).toBe("error");
    expect(state.context.retryState).toBe("resolveRequirements");

    // Reset and test error from methodSelection
    act(() => {
      const [, send] = result.current;
      send({ type: "RESET" });
    });

    act(() => {
      const [, send] = result.current;
      send({
        type: "REQUIREMENTS_RESOLVED",
        destinationChainId: 1,
        destinationTokenAddress: "0xtest",
        destinationAmount: "100",
        receiverAddress: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      });
    });

    act(() => {
      const [, send] = result.current;
      send({
        type: "ERROR_OCCURRED",
        error: new Error("Method selection error"),
      });
    });

    [state] = result.current;
    expect(state.value).toBe("error");
    expect(state.context.retryState).toBe("methodSelection");
  });
});
