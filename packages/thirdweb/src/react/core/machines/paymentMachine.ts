import { useCallback, useState } from "react";
import type { Token } from "../../../bridge/types/Token.js";
import type { Address } from "../../../utils/address.js";
import type { AsyncStorage } from "../../../utils/storage/AsyncStorage.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { WindowAdapter } from "../adapters/WindowAdapter.js";
import type {
  BridgePrepareRequest,
  BridgePrepareResult,
} from "../hooks/useBridgePrepare.js";
import type { CompletedStatusResult } from "../hooks/useStepExecutor.js";

/**
 * Payment modes supported by BridgeEmbed
 */
type PaymentMode = "fund_wallet" | "direct_payment" | "transaction";

/**
 * Payment method types with their required data
 */
export type PaymentMethod =
  | {
      type: "wallet";
      payerWallet: Wallet;
      originToken: Token;
      balance: bigint;
    }
  | {
      type: "fiat";
      payerWallet: Wallet;
      currency: string;
      onramp: "stripe" | "coinbase" | "transak";
    };

/**
 * Payment machine context - holds all flow state data
 */
export interface PaymentMachineContext {
  // Flow configuration
  mode: PaymentMode;

  // Target requirements (resolved in init state)
  destinationAmount?: string;
  destinationToken?: Token;
  receiverAddress?: Address;

  // User selections (set in methodSelection state)
  selectedPaymentMethod?: PaymentMethod;

  // Prepared quote data (set in quote state)
  quote?: BridgePrepareResult;
  request?: BridgePrepareRequest;

  // Execution results (set in execute state on completion)
  completedStatuses?: CompletedStatusResult[];

  // Error handling
  currentError?: Error;
  retryState?: PaymentMachineState; // State to retry from

  // Dependency injection
  adapters: {
    window: WindowAdapter;
    storage: AsyncStorage;
  };
}

/**
 * Events that can be sent to the payment machine
 */
type PaymentMachineEvent =
  | {
      type: "DESTINATION_CONFIRMED";
      destinationToken: Token;
      destinationAmount: string;
      receiverAddress: Address;
    }
  | { type: "PAYMENT_METHOD_SELECTED"; paymentMethod: PaymentMethod }
  | {
      type: "QUOTE_RECEIVED";
      quote: BridgePrepareResult;
      request: BridgePrepareRequest;
    }
  | { type: "ROUTE_CONFIRMED" }
  | { type: "EXECUTION_COMPLETE"; completedStatuses: CompletedStatusResult[] }
  | { type: "ERROR_OCCURRED"; error: Error }
  | { type: "CONTINUE_TO_TRANSACTION" }
  | { type: "RETRY" }
  | { type: "RESET" }
  | { type: "BACK" };

type PaymentMachineState =
  | "init"
  | "methodSelection"
  | "quote"
  | "preview"
  | "execute"
  | "success"
  | "post-buy-transaction"
  | "error";

/**
 * Hook to create and use the payment machine
 */
export function usePaymentMachine(
  adapters: PaymentMachineContext["adapters"],
  mode: PaymentMode = "fund_wallet",
) {
  const [currentState, setCurrentState] = useState<PaymentMachineState>("init");
  const [context, setContext] = useState<PaymentMachineContext>({
    adapters,
    mode,
  });

  const send = useCallback(
    (event: PaymentMachineEvent) => {
      setCurrentState((state) => {
        setContext((ctx) => {
          switch (state) {
            case "init":
              if (event.type === "DESTINATION_CONFIRMED") {
                return {
                  ...ctx,
                  destinationAmount: event.destinationAmount,
                  destinationToken: event.destinationToken,
                  receiverAddress: event.receiverAddress,
                };
              } else if (event.type === "ERROR_OCCURRED") {
                return {
                  ...ctx,
                  currentError: event.error,
                  retryState: "init",
                };
              }
              break;

            case "methodSelection":
              if (event.type === "PAYMENT_METHOD_SELECTED") {
                return {
                  ...ctx,
                  quote: undefined, // reset quote when method changes
                  selectedPaymentMethod: event.paymentMethod,
                };
              } else if (event.type === "ERROR_OCCURRED") {
                return {
                  ...ctx,
                  currentError: event.error,
                  retryState: "methodSelection",
                };
              }
              break;

            case "quote":
              if (event.type === "QUOTE_RECEIVED") {
                return {
                  ...ctx,
                  quote: event.quote,
                  request: event.request,
                };
              } else if (event.type === "ERROR_OCCURRED") {
                return {
                  ...ctx,
                  currentError: event.error,
                  retryState: "quote",
                };
              }
              break;

            case "preview":
              if (event.type === "ERROR_OCCURRED") {
                return {
                  ...ctx,
                  currentError: event.error,
                  retryState: "preview",
                };
              }
              break;

            case "execute":
              if (event.type === "EXECUTION_COMPLETE") {
                return {
                  ...ctx,
                  completedStatuses: event.completedStatuses,
                };
              } else if (event.type === "ERROR_OCCURRED") {
                return {
                  ...ctx,
                  currentError: event.error,
                  retryState: "execute",
                };
              }
              break;

            case "error":
              if (event.type === "RETRY" || event.type === "RESET") {
                return {
                  ...ctx,
                  currentError: undefined,
                  retryState: undefined,
                };
              }
              break;

            case "success":
              if (event.type === "RESET") {
                return {
                  adapters: ctx.adapters,
                  mode: ctx.mode,
                };
              }
              break;

            case "post-buy-transaction":
              if (event.type === "RESET") {
                return {
                  adapters: ctx.adapters,
                  mode: ctx.mode,
                };
              }
              break;
          }
          return ctx;
        });

        // State transitions
        switch (state) {
          case "init":
            if (event.type === "DESTINATION_CONFIRMED")
              return "methodSelection";
            if (event.type === "ERROR_OCCURRED") return "error";
            break;

          case "methodSelection":
            if (event.type === "PAYMENT_METHOD_SELECTED") return "quote";
            if (event.type === "BACK") return "init";
            if (event.type === "ERROR_OCCURRED") return "error";
            break;

          case "quote":
            if (event.type === "QUOTE_RECEIVED") return "preview";
            if (event.type === "BACK") return "methodSelection";
            if (event.type === "ERROR_OCCURRED") return "error";
            break;

          case "preview":
            if (event.type === "ROUTE_CONFIRMED") return "execute";
            if (event.type === "BACK") return "methodSelection";
            if (event.type === "ERROR_OCCURRED") return "error";
            break;

          case "execute":
            if (event.type === "EXECUTION_COMPLETE") return "success";
            if (event.type === "BACK") return "preview";
            if (event.type === "ERROR_OCCURRED") return "error";
            break;

          case "success":
            if (event.type === "CONTINUE_TO_TRANSACTION")
              return "post-buy-transaction";
            if (event.type === "RESET") return "init";
            break;

          case "post-buy-transaction":
            if (event.type === "RESET") return "init";
            break;

          case "error":
            if (event.type === "RETRY") {
              return context.retryState ?? "init";
            }
            if (event.type === "RESET") {
              return "init";
            }
            break;
        }

        return state;
      });
    },
    [context.retryState],
  );

  return [
    {
      context,
      value: currentState,
    },
    send,
  ] as const;
}
