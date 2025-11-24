"use client";

import { useContext } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import {
  type UseFetchWithPaymentOptions,
  useFetchWithPaymentCore,
} from "../../../core/hooks/x402/useFetchWithPaymentCore.js";
import { SetRootElementContext } from "../../../core/providers/RootElementContext.js";
import type { BuyWidgetProps } from "../../ui/Bridge/BuyWidget.js";
import {
  type UseConnectModalOptions,
  useConnectModal,
} from "../../ui/ConnectWallet/useConnectModal.js";
import { PaymentErrorModal } from "../../ui/x402/PaymentErrorModal.js";
import { SignInRequiredModal } from "../../ui/x402/SignInRequiredModal.js";

export type { UseFetchWithPaymentOptions };

type UseFetchWithPaymentConfig = UseFetchWithPaymentOptions & {
  /**
   * Whether to show the UI for connection, funding or payment retries.
   * If false, no UI will be shown and errors will have to be handled manually.
   * @default true
   */
  uiEnabled?: boolean;
  /**
   * Theme for the payment error modal
   * @default "dark"
   */
  theme?: Theme | "light" | "dark";
  /**
   * Options to customize the BuyWidget that appears when the user needs to fund their wallet.
   * These options will be merged with default values.
   */
  fundWalletOptions?: Partial<
    Omit<
      BuyWidgetProps,
      "client" | "chain" | "tokenAddress" | "onSuccess" | "onCancel" | "theme"
    >
  >;
  /**
   * Options to customize the ConnectModal that appears when the user needs to sign in.
   * These options will be merged with the client, theme, and chain from the hook.
   */
  connectOptions?: Omit<UseConnectModalOptions, "client" | "theme">;
};

/**
 * A React hook that wraps the native fetch API to automatically handle 402 Payment Required responses
 * using the x402 payment protocol with the currently connected wallet.
 *
 * This hook enables you to make API calls that require payment without manually handling the payment flow.
 * Responses are automatically parsed as JSON by default (can be customized with `parseAs` option).
 *
 * When a 402 response is received, it will automatically:
 * 1. Parse the payment requirements
 * 2. Verify the payment amount is within the allowed maximum
 * 3. Create a payment header using the connected wallet
 * 4. Retry the request with the payment header
 *
 * If payment fails (e.g. insufficient funds), a modal will be shown to help the user resolve the issue.
 * If no wallet is connected, a sign-in modal will be shown to connect a wallet.
 *
 * @param client - The thirdweb client used to access RPC infrastructure
 * @param options - Optional configuration for payment handling
 * @param options.maxValue - The maximum allowed payment amount in base units
 * @param options.paymentRequirementsSelector - Custom function to select payment requirements from available options
 * @param options.parseAs - How to parse the response: "json" (default), "text", or "raw"
 * @param options.uiEnabled - Whether to show the UI for connection, funding or payment retries (defaults to true). Set to false to handle errors yourself
 * @param options.theme - Theme for the payment error modal (defaults to "dark")
 * @param options.fundWalletOptions - Customize the BuyWidget shown when user needs to fund their wallet
 * @param options.connectOptions - Customize the ConnectModal shown when user needs to sign in
 * @returns An object containing:
 * - `fetchWithPayment`: Function to make fetch requests with automatic payment handling (returns parsed data)
 * - `isPending`: Boolean indicating if a request is in progress
 * - `error`: Any error that occurred during the request
 * - `data`: The parsed response data (JSON by default, or based on `parseAs` option)
 * - Other mutation properties from React Query
 *
 * @example
 * ```tsx
 * import { useFetchWithPayment } from "thirdweb/react";
 * import { createThirdwebClient } from "thirdweb";
 *
 * const client = createThirdwebClient({ clientId: "your-client-id" });
 *
 * function MyComponent() {
 *   const { fetchWithPayment, isPending } = useFetchWithPayment(client);
 *
 *   const handleApiCall = async () => {
 *     // Response is automatically parsed as JSON
 *     const data = await fetchWithPayment('https://api.example.com/paid-endpoint');
 *     console.log(data);
 *   };
 *
 *   return (
 *     <button onClick={handleApiCall} disabled={isPending}>
 *       {isPending ? 'Loading...' : 'Make Paid API Call'}
 *     </button>
 *   );
 * }
 * ```
 *
 * ### Customize response parsing
 * ```tsx
 * const { fetchWithPayment } = useFetchWithPayment(client, {
 *   parseAs: "text", // Get response as text instead of JSON
 * });
 *
 * const textData = await fetchWithPayment('https://api.example.com/endpoint');
 * ```
 *
 * ### Customize payment options
 * ```tsx
 * const { fetchWithPayment } = useFetchWithPayment(client, {
 *   maxValue: 5000000n, // 5 USDC in base units
 *   theme: "light",
 *   paymentRequirementsSelector: (requirements) => {
 *     // Custom logic to select preferred payment method
 *     return requirements[0];
 *   }
 * });
 * ```
 *
 * ### Customize the fund wallet widget
 * ```tsx
 * const { fetchWithPayment } = useFetchWithPayment(client, {
 *   fundWalletOptions: {
 *     title: "Add Funds",
 *     description: "You need more tokens to complete this payment",
 *     buttonLabel: "Get Tokens",
 *   }
 * });
 * ```
 *
 * ### Customize the connect modal
 * ```tsx
 * const { fetchWithPayment } = useFetchWithPayment(client, {
 *   connectOptions: {
 *     wallets: [inAppWallet(), createWallet("io.metamask")],
 *     title: "Sign in to continue",
 *   }
 * });
 * ```
 *
 * ### Disable the UI and handle errors yourself
 * ```tsx
 * const { fetchWithPayment, error } = useFetchWithPayment(client, {
 *   uiEnabled: false,
 * });
 *
 * // Handle the error manually
 * if (error) {
 *   console.error("Payment failed:", error);
 * }
 * ```
 *
 * @x402
 */
export function useFetchWithPayment(
  client: ThirdwebClient,
  options?: UseFetchWithPaymentConfig,
) {
  const setRootEl = useContext(SetRootElementContext);
  const { connect } = useConnectModal();
  const theme = options?.theme || "dark";
  const showModal = options?.uiEnabled !== false; // Default to true

  const showErrorModal = showModal
    ? (data: {
        errorData: Parameters<typeof PaymentErrorModal>[0]["errorData"];
        onRetry: () => void;
        onCancel: () => void;
      }) => {
        setRootEl(
          <PaymentErrorModal
            client={client}
            errorData={data.errorData}
            onCancel={() => {
              setRootEl(null);
              data.onCancel();
            }}
            onRetry={() => {
              setRootEl(null);
              data.onRetry();
            }}
            theme={theme}
            fundWalletOptions={options?.fundWalletOptions}
            paymentRequirementsSelector={options?.paymentRequirementsSelector}
          />,
        );
      }
    : undefined;

  const showConnectModal = showModal
    ? (data: { onConnect: (wallet: Wallet) => void; onCancel: () => void }) => {
        // First, show the SignInRequiredModal
        setRootEl(
          <SignInRequiredModal
            theme={theme}
            onSignIn={async () => {
              // Close the SignInRequiredModal
              setRootEl(null);

              // Open the ConnectModal
              try {
                const connectedWallet = await connect({
                  client,
                  theme,
                  ...options?.connectOptions,
                });

                // On successful connection, trigger onConnect callback with the wallet
                data.onConnect(connectedWallet);
              } catch (_error) {
                // User cancelled the connection
                data.onCancel();
              }
            }}
            onCancel={() => {
              setRootEl(null);
              data.onCancel();
            }}
          />,
        );
      }
    : undefined;

  return useFetchWithPaymentCore(
    client,
    options,
    showErrorModal,
    showConnectModal,
  );
}
