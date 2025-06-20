/**
 * @vitest-environment happy-dom
 */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { TEST_IN_APP_WALLET_A } from "../../../../test/src/test-wallets.js";
import type { Token } from "../../../bridge/types/Token.js";
import { defineChain } from "../../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
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
  removeItem: vi.fn().mockResolvedValue(undefined),
  setItem: vi.fn().mockResolvedValue(undefined),
};

// Test token objects
const testUSDCToken: Token = {
  address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  chainId: 137,
  decimals: 6,
  name: "USD Coin (PoS)",
  priceUsd: 1.0,
  symbol: "USDC",
};

const testETHToken: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  chainId: 1,
  decimals: 18,
  name: "Ethereum",
  priceUsd: 2500.0,
  symbol: "ETH",
};

const testTokenForPayment: Token = {
  address: "0xA0b86a33E6425c03e54c4b45DCb6d75b6B72E2AA",
  chainId: 1,
  decimals: 18,
  name: "Test Token",
  priceUsd: 1.0,
  symbol: "TT",
};

const mockBuyQuote: BridgePrepareResult = {
  destinationAmount: 100000000n,
  estimatedExecutionTimeMs: 120000, // 1 ETH
  intent: {
    amount: 100000000n,
    destinationChainId: 137,
    destinationTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    originChainId: 1,
    originTokenAddress: NATIVE_TOKEN_ADDRESS,
    receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
    sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
  }, // 100 USDC
  originAmount: 1000000000000000000n,
  steps: [
    {
      destinationAmount: 100000000n,
      destinationToken: testUSDCToken,
      estimatedExecutionTimeMs: 120000,
      originAmount: 1000000000000000000n,
      originToken: testETHToken,
      transactions: [
        {
          action: "approval" as const,
          chain: defineChain(1),
          chainId: 1,
          client: TEST_CLIENT,
          data: "0x789" as const,
          id: "0x123" as const,
          to: "0x456" as const,
        },
        {
          action: "buy" as const,
          chain: defineChain(1),
          chainId: 1,
          client: TEST_CLIENT,
          data: "0x012" as const,
          id: "0xabc" as const,
          to: "0xdef" as const,
          value: 1000000000000000000n,
        },
      ],
    },
  ], // 2 minutes
  timestamp: Date.now(),
  type: "buy",
};

describe("PaymentMachine", () => {
  let adapters: PaymentMachineContext["adapters"];

  beforeEach(() => {
    adapters = {
      storage: mockStorage,
      window: mockWindowAdapter,
    };
  });

  it("should initialize in init state", () => {
    const { result } = renderHook(() =>
      usePaymentMachine(adapters, "fund_wallet"),
    );
    const [state] = result.current;

    expect(state.value).toBe("init");
    expect(state.context.mode).toBe("fund_wallet");
    expect(state.context.adapters).toBe(adapters);
  });

  it("should handle errors and allow retry", () => {
    const { result } = renderHook(() =>
      usePaymentMachine(adapters, "fund_wallet"),
    );

    const testError = new Error("Network error");
    act(() => {
      const [, send] = result.current;
      send({
        error: testError,
        type: "ERROR_OCCURRED",
      });
    });

    let [state] = result.current;
    expect(state.value).toBe("error");
    expect(state.context.currentError).toBe(testError);
    expect(state.context.retryState).toBe("init");

    // Retry should clear error and return to beginning
    act(() => {
      const [, send] = result.current;
      send({
        type: "RETRY",
      });
    });

    [state] = result.current;
    expect(state.value).toBe("init");
    expect(state.context.currentError).toBeUndefined();
    expect(state.context.retryState).toBeUndefined();
  });

  it("should preserve context data through transitions", () => {
    const { result } = renderHook(() =>
      usePaymentMachine(adapters, "fund_wallet"),
    );

    const testToken: Token = {
      address: "0xtest",
      chainId: 42,
      decimals: 18,
      name: "Test Token",
      priceUsd: 1.0,
      symbol: "TEST",
    };

    // Confirm destination
    act(() => {
      const [, send] = result.current;
      send({
        destinationAmount: "50",
        destinationToken: testToken,
        receiverAddress: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
        type: "DESTINATION_CONFIRMED",
      });
    });

    // Select payment method
    const paymentMethod: PaymentMethod = {
      balance: 1000000000000000000n,
      originToken: testUSDCToken,
      payerWallet: TEST_IN_APP_WALLET_A,
      type: "wallet",
    };

    act(() => {
      const [, send] = result.current;
      send({
        paymentMethod,
        type: "PAYMENT_METHOD_SELECTED",
      });
    });

    const [state] = result.current;
    // All context should be preserved
    expect(state.context.destinationToken).toEqual(testToken);
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
    expect(initialState.value).toBe("init");

    // Only DESTINATION_CONFIRMED should be valid from initial state
    act(() => {
      const [, send] = result.current;
      send({
        paymentMethod: {
          currency: "USD",
          onramp: "stripe",
          payerWallet: TEST_IN_APP_WALLET_A,
          type: "fiat",
        },
        type: "PAYMENT_METHOD_SELECTED",
      });
    });

    let [state] = result.current;
    expect(state.value).toBe("init"); // Should stay in same state for invalid transition

    // Valid transition
    act(() => {
      const [, send] = result.current;
      send({
        destinationAmount: "100",
        destinationToken: testTokenForPayment,
        receiverAddress: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
        type: "DESTINATION_CONFIRMED",
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
        destinationAmount: "100",
        destinationToken: testTokenForPayment,
        receiverAddress: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
        type: "DESTINATION_CONFIRMED",
      });
    });

    act(() => {
      const [, send] = result.current;
      send({
        paymentMethod: {
          currency: "USD",
          onramp: "stripe",
          payerWallet: TEST_IN_APP_WALLET_A,
          type: "fiat",
        },
        type: "PAYMENT_METHOD_SELECTED",
      });
    });

    let [state] = result.current;
    expect(state.value).toBe("quote");

    // Trigger error
    act(() => {
      const [, send] = result.current;
      send({
        error: new Error("Test error"),
        type: "ERROR_OCCURRED",
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
    expect(state.value).toBe("init");
    // Context should still have adapters and mode but other data should be cleared
    expect(state.context.adapters).toBe(adapters);
    expect(state.context.mode).toBe("fund_wallet");
  });

  it("should handle error states from all major states", () => {
    const { result } = renderHook(() =>
      usePaymentMachine(adapters, "fund_wallet"),
    );

    // Test error from init
    act(() => {
      const [, send] = result.current;
      send({
        error: new Error("Init error"),
        type: "ERROR_OCCURRED",
      });
    });

    let [state] = result.current;
    expect(state.value).toBe("error");
    expect(state.context.retryState).toBe("init");

    // Reset and test error from methodSelection
    act(() => {
      const [, send] = result.current;
      send({ type: "RESET" });
    });

    act(() => {
      const [, send] = result.current;
      send({
        destinationAmount: "100",
        destinationToken: testTokenForPayment,
        receiverAddress: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
        type: "DESTINATION_CONFIRMED",
      });
    });

    act(() => {
      const [, send] = result.current;
      send({
        error: new Error("Method selection error"),
        type: "ERROR_OCCURRED",
      });
    });

    [state] = result.current;
    expect(state.value).toBe("error");
    expect(state.context.retryState).toBe("methodSelection");
  });

  it("should handle back navigation", () => {
    const { result } = renderHook(() =>
      usePaymentMachine(adapters, "fund_wallet"),
    );

    // Go to methodSelection
    act(() => {
      const [, send] = result.current;
      send({
        destinationAmount: "100",
        destinationToken: testTokenForPayment,
        receiverAddress: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
        type: "DESTINATION_CONFIRMED",
      });
    });

    // Go to quote
    act(() => {
      const [, send] = result.current;
      send({
        paymentMethod: {
          currency: "USD",
          onramp: "stripe",
          payerWallet: TEST_IN_APP_WALLET_A,
          type: "fiat",
        },
        type: "PAYMENT_METHOD_SELECTED",
      });
    });

    let [state] = result.current;
    expect(state.value).toBe("quote");

    // Navigate back to methodSelection
    act(() => {
      const [, send] = result.current;
      send({
        type: "BACK",
      });
    });

    [state] = result.current;
    expect(state.value).toBe("methodSelection");

    // Navigate back to init
    act(() => {
      const [, send] = result.current;
      send({
        type: "BACK",
      });
    });

    [state] = result.current;
    expect(state.value).toBe("init");
  });

  it("should handle post-buy-transaction state flow", () => {
    const { result } = renderHook(() =>
      usePaymentMachine(adapters, "fund_wallet"),
    );

    // Go through the complete happy path to reach success state
    act(() => {
      const [, send] = result.current;
      send({
        destinationAmount: "100",
        destinationToken: testTokenForPayment,
        receiverAddress: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
        type: "DESTINATION_CONFIRMED",
      });
    });

    act(() => {
      const [, send] = result.current;
      send({
        paymentMethod: {
          balance: 1000000000000000000n,
          originToken: testUSDCToken,
          payerWallet: TEST_IN_APP_WALLET_A,
          type: "wallet",
        },
        type: "PAYMENT_METHOD_SELECTED",
      });
    });

    act(() => {
      const [, send] = result.current;
      send({
        preparedQuote: mockBuyQuote,
        type: "QUOTE_RECEIVED",
      });
    });

    act(() => {
      const [, send] = result.current;
      send({
        type: "ROUTE_CONFIRMED",
      });
    });

    act(() => {
      const [, send] = result.current;
      send({
        completedStatuses: [
          {
            destinationAmount: 100000000n,
            destinationChainId: 137,
            destinationToken: testUSDCToken,
            destinationTokenAddress:
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            originAmount: 1000000000000000000n,
            originChainId: 1,
            originToken: testETHToken,
            originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            paymentId: "test-payment-id",
            receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
            sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
            status: "COMPLETED",
            transactions: [
              {
                chainId: 1,
                transactionHash: "0xtest123",
              },
            ],
            type: "buy",
          },
        ],
        type: "EXECUTION_COMPLETE",
      });
    });

    let [state] = result.current;
    expect(state.value).toBe("success");

    // Continue to post-buy transaction
    act(() => {
      const [, send] = result.current;
      send({
        type: "CONTINUE_TO_TRANSACTION",
      });
    });

    [state] = result.current;
    expect(state.value).toBe("post-buy-transaction");

    // Reset from post-buy-transaction should go back to init
    act(() => {
      const [, send] = result.current;
      send({
        type: "RESET",
      });
    });

    [state] = result.current;
    expect(state.value).toBe("init");
    // Context should be reset to initial state with only adapters and mode
    expect(state.context.adapters).toBe(adapters);
    expect(state.context.mode).toBe("fund_wallet");
    expect(state.context.destinationToken).toBeUndefined();
    expect(state.context.selectedPaymentMethod).toBeUndefined();
    expect(state.context.preparedQuote).toBeUndefined();
    expect(state.context.completedStatuses).toBeUndefined();
  });
});
