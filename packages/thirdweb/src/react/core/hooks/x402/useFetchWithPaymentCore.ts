"use client";

import { useMutation } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { wrapFetchWithPayment } from "../../../../x402/fetchWithPayment.js";
import type { RequestedPaymentRequirements } from "../../../../x402/schemas.js";
import type { PaymentRequiredResult } from "../../../../x402/types.js";
import { useActiveWallet } from "../wallets/useActiveWallet.js";

export type UseFetchWithPaymentOptions = {
  maxValue?: bigint;
  paymentRequirementsSelector?: (
    paymentRequirements: RequestedPaymentRequirements[],
  ) => RequestedPaymentRequirements | undefined;
  parseAs?: "json" | "text" | "raw";
};

type ShowErrorModalCallback = (data: {
  errorData: PaymentRequiredResult["responseBody"];
  onRetry: () => void;
  onCancel: () => void;
}) => void;

type ShowConnectModalCallback = (data: {
  onConnect: (wallet: Wallet) => void;
  onCancel: () => void;
}) => void;

/**
 * Core hook for fetch with payment functionality.
 * This is the platform-agnostic implementation used by both web and native versions.
 * @internal
 */
export function useFetchWithPaymentCore(
  client: ThirdwebClient,
  options?: UseFetchWithPaymentOptions,
  showErrorModal?: ShowErrorModalCallback,
  showConnectModal?: ShowConnectModalCallback,
) {
  const wallet = useActiveWallet();

  const mutation = useMutation({
    mutationFn: async ({
      input,
      init,
    }: {
      input: RequestInfo;
      init?: RequestInit;
    }) => {
      // Recursive function that handles fetch + 402 error + retry
      const executeFetch = async (currentWallet = wallet): Promise<unknown> => {
        if (!currentWallet) {
          // If a connect modal handler is provided, show the connect modal
          if (showConnectModal) {
            return new Promise<unknown>((resolve, reject) => {
              showConnectModal({
                onConnect: async (newWallet) => {
                  // After connection, retry the fetch with the newly connected wallet
                  try {
                    const result = await executeFetch(newWallet);
                    resolve(result);
                  } catch (error) {
                    reject(error);
                  }
                },
                onCancel: () => {
                  reject(new Error("Wallet connection cancelled by user"));
                },
              });
            });
          }

          // If no connect modal handler, throw an error
          throw new Error(
            "No wallet connected. Please connect your wallet to make paid API calls.",
          );
        }

        const wrappedFetch = wrapFetchWithPayment(
          globalThis.fetch,
          client,
          currentWallet,
          options,
        );

        const response = await wrappedFetch(input, init);

        // Check if we got a 402 response (payment error)
        if (response.status === 402) {
          try {
            const errorBody =
              (await response.json()) as PaymentRequiredResult["responseBody"];

            // If a modal handler is provided, show the modal and handle retry/cancel
            if (showErrorModal) {
              return new Promise<unknown>((resolve, reject) => {
                showErrorModal({
                  errorData: errorBody,
                  onRetry: async () => {
                    // Retry the entire fetch+error handling logic recursively
                    try {
                      const result = await executeFetch();
                      resolve(result);
                    } catch (error) {
                      reject(error);
                    }
                  },
                  onCancel: () => {
                    reject(new Error("Payment cancelled by user"));
                  },
                });
              });
            }

            // If no modal handler, throw the error with details
            throw new Error(
              errorBody.errorMessage || `Payment failed: ${errorBody.error}`,
            );
          } catch (_parseError) {
            // If we can't parse the error body, throw a generic error
            throw new Error("Payment failed with status 402");
          }
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Payment failed with status ${response.status} ${response.statusText} - ${errorText || "Unknown error"}`,
          );
        }

        const parseAs = options?.parseAs ?? "json";
        return parseResponse(response, parseAs);
      };

      // Start the fetch process
      return executeFetch();
    },
  });

  return {
    fetchWithPayment: async (input: RequestInfo, init?: RequestInit) => {
      return mutation.mutateAsync({ input, init });
    },
    ...mutation,
  };
}

function parseResponse(response: Response, parseAs: "json" | "text" | "raw") {
  if (parseAs === "json") {
    return response.json();
  } else if (parseAs === "text") {
    return response.text();
  } else if (parseAs === "raw") {
    return response;
  } else {
    throw new Error(`Invalid parseAs option: ${parseAs}`);
  }
}
