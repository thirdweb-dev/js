import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AsyncStorage } from "../../../utils/storage/AsyncStorage.js";
import type { WindowAdapter } from "../adapters/WindowAdapter.js";
import {
  type PaymentMachineContext,
  type PaymentMethod,
  createPaymentMachine,
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

describe("PaymentMachine", () => {
  let machine: ReturnType<typeof createPaymentMachine>;
  let adapters: PaymentMachineContext["adapters"];

  beforeEach(() => {
    adapters = {
      window: mockWindowAdapter,
      storage: mockStorage,
    };
    machine = createPaymentMachine(adapters, "fund_wallet");
  });

  it("should initialize in resolveRequirements state", () => {
    expect(machine.initialState.value).toBe("resolveRequirements");
    expect(machine.initialState.context.mode).toBe("fund_wallet");
    expect(machine.initialState.context.adapters).toBe(adapters);
  });

  it("should transition through happy path with wallet payment method", () => {
    let state = machine.initialState;

    // Resolve requirements
    state = machine.transition(state, {
      type: "REQUIREMENTS_RESOLVED",
      destinationChainId: 1,
      destinationTokenAddress: "0xA0b86a33E6425c03e54c4b45DCb6d75b6B72E2AA",
      destinationAmount: "100",
    });

    expect(state.value).toBe("methodSelection");
    expect(state.context.destinationChainId).toBe(1);
    expect(state.context.destinationTokenAddress).toBe(
      "0xA0b86a33E6425c03e54c4b45DCb6d75b6B72E2AA",
    );
    expect(state.context.destinationAmount).toBe("100");

    // Select wallet payment method with source configuration
    const walletPaymentMethod: PaymentMethod = {
      type: "wallet",
      originChainId: 137,
      originTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    };

    state = machine.transition(state, {
      type: "PAYMENT_METHOD_SELECTED",
      paymentMethod: walletPaymentMethod,
    });

    expect(state.value).toBe("quote");
    expect(state.context.selectedPaymentMethod).toEqual(walletPaymentMethod);

    // Receive quote
    const mockRoute = { id: "route-1", steps: [] };
    state = machine.transition(state, {
      type: "QUOTE_RECEIVED",
      route: mockRoute,
    });

    expect(state.value).toBe("preview");
    expect(state.context.selectedRoute).toBe(mockRoute);

    // Confirm route
    state = machine.transition(state, {
      type: "ROUTE_CONFIRMED",
    });

    expect(state.value).toBe("prepare");

    // Prepare steps
    const mockSteps = [{ id: "step-1" }, { id: "step-2" }];
    state = machine.transition(state, {
      type: "STEPS_PREPARED",
      steps: mockSteps,
    });

    expect(state.value).toBe("execute");
    expect(state.context.preparedSteps).toBe(mockSteps);

    // Complete execution
    state = machine.transition(state, {
      type: "EXECUTION_COMPLETE",
    });

    expect(state.value).toBe("success");
  });

  it("should transition through happy path with fiat payment method", () => {
    let state = machine.initialState;

    // Resolve requirements
    state = machine.transition(state, {
      type: "REQUIREMENTS_RESOLVED",
      destinationChainId: 1,
      destinationTokenAddress: "0xA0b86a33E6425c03e54c4b45DCb6d75b6B72E2AA",
      destinationAmount: "100",
    });

    expect(state.value).toBe("methodSelection");

    // Select fiat payment method with currency
    const fiatPaymentMethod: PaymentMethod = {
      type: "fiat",
      currency: "USD",
    };

    state = machine.transition(state, {
      type: "PAYMENT_METHOD_SELECTED",
      paymentMethod: fiatPaymentMethod,
    });

    expect(state.value).toBe("quote");
    expect(state.context.selectedPaymentMethod).toEqual(fiatPaymentMethod);

    // Continue through the rest of the flow...
    const mockRoute = { id: "route-1", steps: [] };
    state = machine.transition(state, {
      type: "QUOTE_RECEIVED",
      route: mockRoute,
    });

    expect(state.value).toBe("preview");
  });

  it("should handle errors and allow retry", () => {
    let state = machine.initialState;

    const testError = new Error("Network error");
    state = machine.transition(state, {
      type: "ERROR_OCCURRED",
      error: testError,
    });

    expect(state.value).toBe("error");
    expect(state.context.currentError).toBe(testError);
    expect(state.context.retryState).toBe("resolveRequirements");

    // Retry should clear error and return to beginning
    state = machine.transition(state, {
      type: "RETRY",
    });

    expect(state.value).toBe("resolveRequirements");
    expect(state.context.currentError).toBeUndefined();
    expect(state.context.retryState).toBeUndefined();
  });

  it("should preserve context data through transitions", () => {
    let state = machine.initialState;

    // Resolve requirements
    state = machine.transition(state, {
      type: "REQUIREMENTS_RESOLVED",
      destinationChainId: 42,
      destinationTokenAddress: "0xtest",
      destinationAmount: "50",
    });

    // Select payment method
    const paymentMethod: PaymentMethod = {
      type: "wallet",
      originChainId: 137,
      originTokenAddress: "0xorigin",
    };

    state = machine.transition(state, {
      type: "PAYMENT_METHOD_SELECTED",
      paymentMethod,
    });

    // All context should be preserved
    expect(state.context.destinationChainId).toBe(42);
    expect(state.context.destinationTokenAddress).toBe("0xtest");
    expect(state.context.destinationAmount).toBe("50");
    expect(state.context.selectedPaymentMethod).toEqual(paymentMethod);
    expect(state.context.mode).toBe("fund_wallet");
    expect(state.context.adapters).toBe(adapters);
  });

  it("should handle state transitions correctly", () => {
    let state = machine.initialState;
    expect(state.value).toBe("resolveRequirements");

    // Only REQUIREMENTS_RESOLVED should be valid from initial state
    state = machine.transition(state, {
      type: "PAYMENT_METHOD_SELECTED",
      paymentMethod: { type: "fiat", currency: "USD" },
    });
    expect(state.value).toBe("resolveRequirements"); // Should stay in same state for invalid transition

    // Valid transition
    state = machine.transition(state, {
      type: "REQUIREMENTS_RESOLVED",
      destinationChainId: 1,
      destinationTokenAddress: "0xtest",
      destinationAmount: "100",
    });
    expect(state.value).toBe("methodSelection");
  });

  it("should reset to initial state", () => {
    let state = machine.initialState;

    // Go through some states
    state = machine.transition(state, {
      type: "REQUIREMENTS_RESOLVED",
      destinationChainId: 1,
      destinationTokenAddress: "0xtest",
      destinationAmount: "100",
    });

    state = machine.transition(state, {
      type: "PAYMENT_METHOD_SELECTED",
      paymentMethod: { type: "fiat", currency: "USD" },
    });

    expect(state.value).toBe("quote");

    // Trigger error
    state = machine.transition(state, {
      type: "ERROR_OCCURRED",
      error: new Error("Test error"),
    });

    expect(state.value).toBe("error");

    // Reset
    state = machine.transition(state, {
      type: "RESET",
    });

    expect(state.value).toBe("resolveRequirements");
    // Context should still have adapters and mode but other data should be cleared
    expect(state.context.adapters).toBe(adapters);
    expect(state.context.mode).toBe("fund_wallet");
  });

  it("should handle error states from all major states", () => {
    let state = machine.initialState;

    // Test error from resolveRequirements
    state = machine.transition(state, {
      type: "ERROR_OCCURRED",
      error: new Error("Requirements error"),
    });
    expect(state.value).toBe("error");
    expect(state.context.retryState).toBe("resolveRequirements");

    // Reset and test error from methodSelection
    state = machine.transition(state, { type: "RESET" });
    state = machine.transition(state, {
      type: "REQUIREMENTS_RESOLVED",
      destinationChainId: 1,
      destinationTokenAddress: "0xtest",
      destinationAmount: "100",
    });
    state = machine.transition(state, {
      type: "ERROR_OCCURRED",
      error: new Error("Method selection error"),
    });
    expect(state.value).toBe("error");
    expect(state.context.retryState).toBe("methodSelection");
  });
});
