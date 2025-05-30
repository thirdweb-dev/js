import { assign, createMachine } from "@xstate/fsm";
import type { AsyncStorage } from "../../../utils/storage/AsyncStorage.js";
import type { WindowAdapter } from "../adapters/WindowAdapter.js";

/**
 * Payment modes supported by BridgeEmbed
 */
export type PaymentMode = "fund_wallet" | "direct_payment" | "transaction";

/**
 * Payment method types with their required data
 */
export type PaymentMethod =
  | {
      type: "wallet";
      originChainId: number;
      originTokenAddress: string;
    }
  | {
      type: "fiat";
      currency: string;
    };

/**
 * Payment machine context - holds all flow state data
 */
export interface PaymentMachineContext {
  // Flow configuration
  mode: PaymentMode;

  // Target requirements (resolved in resolveRequirements state)
  destinationChainId?: number;
  destinationTokenAddress?: string;
  destinationAmount?: string;

  // User selections (set in methodSelection state)
  selectedPaymentMethod?: PaymentMethod;

  // Route data (set in quote state)
  selectedRoute?: unknown; // Will be typed as Route later

  // Prepared transaction data (set in prepare state)
  preparedSteps?: unknown[]; // Will be typed as RouteStep[] later

  // Error handling
  currentError?: Error;
  retryState?: string; // State to retry from

  // Dependency injection
  adapters: {
    window: WindowAdapter;
    storage: AsyncStorage;
  };
}

/**
 * Events that can be sent to the payment machine
 */
export type PaymentMachineEvent =
  | {
      type: "REQUIREMENTS_RESOLVED";
      destinationChainId: number;
      destinationTokenAddress: string;
      destinationAmount: string;
    }
  | { type: "PAYMENT_METHOD_SELECTED"; paymentMethod: PaymentMethod }
  | { type: "QUOTE_RECEIVED"; route: unknown }
  | { type: "ROUTE_CONFIRMED" }
  | { type: "STEPS_PREPARED"; steps: unknown[] }
  | { type: "EXECUTION_COMPLETE" }
  | { type: "ERROR_OCCURRED"; error: Error }
  | { type: "RETRY" }
  | { type: "RESET" };

/**
 * Factory function to create a new payment machine instance with injected adapters
 */
export function createPaymentMachine(
  adapters: PaymentMachineContext["adapters"],
  mode: PaymentMode = "fund_wallet",
) {
  const initialContext: PaymentMachineContext = {
    mode,
    adapters,
  };

  /**
   * Payment machine states with their allowed transitions
   */
  return createMachine<PaymentMachineContext, PaymentMachineEvent>({
    id: "paymentMachine",
    initial: "resolveRequirements",
    context: initialContext,
    states: {
      resolveRequirements: {
        on: {
          REQUIREMENTS_RESOLVED: {
            target: "methodSelection",
            actions: assign((context, event) => ({
              ...context,
              destinationChainId: (
                event as {
                  type: "REQUIREMENTS_RESOLVED";
                  destinationChainId: number;
                  destinationTokenAddress: string;
                  destinationAmount: string;
                }
              ).destinationChainId,
              destinationTokenAddress: (
                event as {
                  type: "REQUIREMENTS_RESOLVED";
                  destinationChainId: number;
                  destinationTokenAddress: string;
                  destinationAmount: string;
                }
              ).destinationTokenAddress,
              destinationAmount: (
                event as {
                  type: "REQUIREMENTS_RESOLVED";
                  destinationChainId: number;
                  destinationTokenAddress: string;
                  destinationAmount: string;
                }
              ).destinationAmount,
            })),
          },
          ERROR_OCCURRED: {
            target: "error",
            actions: assign((context, event) => ({
              ...context,
              currentError: (
                event as {
                  type: "ERROR_OCCURRED";
                  error: Error;
                }
              ).error,
              retryState: "resolveRequirements",
            })),
          },
        },
      },

      methodSelection: {
        on: {
          PAYMENT_METHOD_SELECTED: {
            target: "quote",
            actions: assign((context, event) => ({
              ...context,
              selectedPaymentMethod: (
                event as {
                  type: "PAYMENT_METHOD_SELECTED";
                  paymentMethod: PaymentMethod;
                }
              ).paymentMethod,
            })),
          },
          ERROR_OCCURRED: {
            target: "error",
            actions: assign((context, event) => ({
              ...context,
              currentError: (
                event as {
                  type: "ERROR_OCCURRED";
                  error: Error;
                }
              ).error,
              retryState: "methodSelection",
            })),
          },
        },
      },

      quote: {
        on: {
          QUOTE_RECEIVED: {
            target: "preview",
            actions: assign((context, event) => ({
              ...context,
              selectedRoute: (
                event as {
                  type: "QUOTE_RECEIVED";
                  route: unknown;
                }
              ).route,
            })),
          },
          ERROR_OCCURRED: {
            target: "error",
            actions: assign((context, event) => ({
              ...context,
              currentError: (
                event as {
                  type: "ERROR_OCCURRED";
                  error: Error;
                }
              ).error,
              retryState: "quote",
            })),
          },
        },
      },

      preview: {
        on: {
          ROUTE_CONFIRMED: "prepare",
          ERROR_OCCURRED: {
            target: "error",
            actions: assign((context, event) => ({
              ...context,
              currentError: (
                event as {
                  type: "ERROR_OCCURRED";
                  error: Error;
                }
              ).error,
              retryState: "preview",
            })),
          },
        },
      },

      prepare: {
        on: {
          STEPS_PREPARED: {
            target: "execute",
            actions: assign((context, event) => ({
              ...context,
              preparedSteps: (
                event as {
                  type: "STEPS_PREPARED";
                  steps: unknown[];
                }
              ).steps,
            })),
          },
          ERROR_OCCURRED: {
            target: "error",
            actions: assign((context, event) => ({
              ...context,
              currentError: (
                event as {
                  type: "ERROR_OCCURRED";
                  error: Error;
                }
              ).error,
              retryState: "prepare",
            })),
          },
        },
      },

      execute: {
        on: {
          EXECUTION_COMPLETE: "success",
          ERROR_OCCURRED: {
            target: "error",
            actions: assign((context, event) => ({
              ...context,
              currentError: (
                event as {
                  type: "ERROR_OCCURRED";
                  error: Error;
                }
              ).error,
              retryState: "execute",
            })),
          },
        },
      },

      success: {
        on: {
          RESET: "resolveRequirements",
        },
      },

      error: {
        on: {
          RETRY: {
            target: "resolveRequirements", // Default retry target
            actions: assign((context) => ({
              ...context,
              currentError: undefined,
              retryState: undefined,
            })),
          },
          RESET: "resolveRequirements",
        },
      },
    },
  });
}
