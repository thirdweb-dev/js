"use client";

import type { ThirdwebClient } from "../../../../client/client.js";
import {
  type UseFetchWithPaymentOptions,
  useFetchWithPaymentCore,
} from "../../../core/hooks/x402/useFetchWithPaymentCore.js";

export type { UseFetchWithPaymentOptions };

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
 * Note: This is the React Native version which does not include modal UI.
 * Payment errors will be thrown and should be handled by your application.
 *
 * @param client - The thirdweb client used to access RPC infrastructure
 * @param options - Optional configuration for payment handling
 * @param options.maxValue - The maximum allowed payment amount in base units
 * @param options.paymentRequirementsSelector - Custom function to select payment requirements from available options
 * @param options.parseAs - How to parse the response: "json" (default), "text", or "raw"
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
 *   const { fetchWithPayment, isPending, error } = useFetchWithPayment(client);
 *
 *   const handleApiCall = async () => {
 *     try {
 *       // Response is automatically parsed as JSON
 *       const data = await fetchWithPayment('https://api.example.com/paid-endpoint');
 *       console.log(data);
 *     } catch (err) {
 *       // Handle payment errors manually in React Native
 *       console.error("Payment failed:", err);
 *     }
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
 *   paymentRequirementsSelector: (requirements) => {
 *     // Custom logic to select preferred payment method
 *     return requirements[0];
 *   }
 * });
 * ```
 *
 * @x402
 */
export function useFetchWithPayment(
  client: ThirdwebClient,
  options?: UseFetchWithPaymentOptions,
) {
  // Native version doesn't show modal, errors bubble up naturally
  return useFetchWithPaymentCore(client, options);
}
