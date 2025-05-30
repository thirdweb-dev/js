import type { PaymentMethod } from "../machines/paymentMachine.js";

/**
 * Hook that returns available payment methods for BridgeEmbed
 *
 * @returns Array of available payment method types
 *
 * @example
 * ```tsx
 * const { data: paymentMethods, isLoading, error } = usePaymentMethods();
 * ```
 */
export function usePaymentMethods() {
  // Mock implementation - returns static list of available payment methods
  // In the future, this could be dynamic based on:
  // - User's region/jurisdiction
  // - Available integrations
  // - Feature flags
  const availableMethodTypes: Array<PaymentMethod["type"]> = ["wallet", "fiat"];

  return {
    data: availableMethodTypes,
    isLoading: false,
    error: null,
    isError: false,
    isSuccess: true,
  };
}
