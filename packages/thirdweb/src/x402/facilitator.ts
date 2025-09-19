import type { FacilitatorConfig } from "x402/types";
import type { ThirdwebClient } from "../client/client.js";

export type ThirdwebX402FacilitatorConfig = {
  client: ThirdwebClient;
  serverWalletAddress: string;
  vaultAccessToken?: string;
  baseUrl?: string;
};

const DEFAULT_BASE_URL = "https://api.thirdweb.com/v1/payments/x402";

/**
 * Creates a facilitator for the x402 payment protocol.
 * Use this with any x402 middleware to enable settling transactions with your thirdweb server wallet.
 *
 * @param config - The configuration for the facilitator
 * @returns a x402 compatible FacilitatorConfig
 *
 * @example
 * ```ts
 * import { facilitator } from "thirdweb/x402";
 * import { createThirdwebClient } from "thirdweb";
 *
 * const client = createThirdwebClient({
 *   secretKey: "your-secret-key",
 * });
 * const thirdwebX402Facilitator = facilitator({
 *   client: client,
 *   serverWalletAddress: "0x1234567890123456789012345678901234567890",
 * });
 *
 * // add the facilitator to any x402 payment middleware
 * const middleware = paymentMiddleware(
 *   "0x1234567890123456789012345678901234567890",
 *   {
 *     "/api/paywall": {
 *       price: "$0.01",
 *       network: "base-sepolia",
 *       config: {
 *         description: "Access to paid content",
 *       },
 *     },
 *   },
 *   thirdwebX402Facilitator,
 * );
 * ```
 *
 * @bridge x402
 */
export function facilitator(
  config: ThirdwebX402FacilitatorConfig,
): FacilitatorConfig {
  const secretKey = config.client.secretKey;
  if (!secretKey) {
    throw new Error("Client secret key is required for the x402 facilitator");
  }
  const serverWalletAddress = config.serverWalletAddress;
  if (!serverWalletAddress) {
    throw new Error(
      "Server wallet address is required for the x402 facilitator",
    );
  }
  return {
    url: (config.baseUrl ?? DEFAULT_BASE_URL) as `${string}://${string}`,
    createAuthHeaders: async () => {
      return {
        verify: {
          "x-secret-key": secretKey,
        },
        settle: {
          "x-secret-key": secretKey,
          "x-settlement-wallet-address": serverWalletAddress,
          ...(config.vaultAccessToken
            ? { "x-vault-access-token": config.vaultAccessToken }
            : {}),
        },
        supported: {
          "x-secret-key": secretKey,
        },
        list: {
          "x-secret-key": secretKey,
        },
      };
    },
  };
}
