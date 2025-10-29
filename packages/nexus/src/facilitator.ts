import type { VerifyResponse } from "x402/types";
import type {
  FacilitatorSettleResponse,
  FacilitatorSupportedResponse,
  FacilitatorVerifyResponse,
  RequestedPaymentPayload,
  RequestedPaymentRequirements,
} from "./schemas.js";
import { stringify } from "./utils.js";

export type WaitUntil = "simulated" | "submitted" | "confirmed";

export type ThirdwebX402FacilitatorConfig = {
  walletSecret: string;
  walletAddress: string;
  waitUntil?: WaitUntil;
  baseUrl?: string;
};

/**
 * facilitator for the x402 payment protocol.
 * @public
 */
export type ThirdwebX402Facilitator = {
  url: `${string}://${string}`;
  address: string;
  createAuthHeaders: () => Promise<{
    verify: Record<string, string>;
    settle: Record<string, string>;
    supported: Record<string, string>;
    list: Record<string, string>;
  }>;
  verify: (
    payload: RequestedPaymentPayload,
    paymentRequirements: RequestedPaymentRequirements,
  ) => Promise<FacilitatorVerifyResponse>;
  settle: (
    payload: RequestedPaymentPayload,
    paymentRequirements: RequestedPaymentRequirements,
    waitUntil?: WaitUntil,
  ) => Promise<FacilitatorSettleResponse>;
  supported: (filters?: {
    chainId: number;
    tokenAddress?: string;
  }) => Promise<FacilitatorSupportedResponse>;
};

const DEFAULT_BASE_URL = "https://nexus-api.thirdweb.com";

/**
 * Creates a facilitator for the x402 payment protocol.
 * You can use this with `settlePayment` or with any x402 middleware to enable settling transactions with your thirdweb server wallet.
 *
 * @param config - The configuration for the facilitator
 * @returns a x402 compatible FacilitatorConfig
 *
 * @example
 * ```ts
 * import { createFacilitator } from "@thirdweb-dev/nexus";
 * import { paymentMiddleware } from 'x402-hono'
 *
 * const facilitator = createFacilitator({
 *   walletSecret: <your-wallet-secret>,
 *   walletAddress: <your-wallet-address>,
 * });
 *
 * // add the facilitator to any x402 payment middleware
 * const middleware = paymentMiddleware(
 *   facilitator.address,
 *   {
 *     "/api/paywall": {
 *       price: "$0.01",
 *       network: "base-sepolia",
 *       config: {
 *         description: "Access to paid content",
 *       },
 *     },
 *   },
 *   facilitator,
 * );
 * ```
 * 
 * #### Configuration Options
 * 
 * ```ts
 * const thirdwebX402Facilitator = createFacilitator({
 *   walletSecret: <your-wallet-secret>,
 *   walletAddress: <your-wallet-address>,
 *   // Optional: Wait behavior for settlements
 *   // - "simulated": Only simulate the transaction (fastest)
 *   // - "submitted": Wait until transaction is submitted
 *   // - "confirmed": Wait for full on-chain confirmation (slowest, default)
 *   waitUntil: "confirmed",
 * });

 * ```
 *
 */
export function createFacilitator(
  config: ThirdwebX402FacilitatorConfig,
): ThirdwebX402Facilitator {
  if (!config.walletSecret) {
    throw new Error("Wallet secret is required for the x402 facilitator");
  }

  if (!config.walletAddress) {
    throw new Error("Wallet address is required for the x402 facilitator");
  }

  const BASE_URL = config.baseUrl ?? DEFAULT_BASE_URL;

  const AUTH_HEADERS = {
    verify: {
      authorization: `Bearer ${config.walletSecret}`,
    },
    settle: {
      authorization: `Bearer ${config.walletSecret}`,
    },
    supported: {
      authorization: `Bearer ${config.walletSecret}`,
    },
    list: {
      authorization: `Bearer ${config.walletSecret}`,
    },
  } as const;

  return {
    url: BASE_URL as `${string}://${string}`,
    address: config.walletAddress,
    createAuthHeaders: async () => AUTH_HEADERS,
    /**
     * Verifies a payment payload with the facilitator service
     *
     * @param payload - The payment payload to verify
     * @param paymentRequirements - The payment requirements to verify against
     * @returns A promise that resolves to the verification response
     */
    async verify(
      payload: RequestedPaymentPayload,
      paymentRequirements: RequestedPaymentRequirements,
    ): Promise<FacilitatorVerifyResponse> {
      let headers = { "Content-Type": "application/json" };

      headers = { ...headers, ...AUTH_HEADERS.verify };

      const res = await fetch(new URL("/verify", BASE_URL), {
        method: "POST",
        headers,
        body: stringify({
          x402Version: payload.x402Version,
          paymentPayload: payload,
          paymentRequirements: paymentRequirements,
        }),
      });

      if (res.status !== 200) {
        const text = `${res.statusText} ${await res.text()}`;
        throw new Error(`Failed to verify payment: ${res.status} ${text}`);
      }

      const data = await res.json();
      return data as VerifyResponse;
    },

    /**
     * Settles a payment with the facilitator service
     *
     * @param payload - The payment payload to settle
     * @param paymentRequirements - The payment requirements for the settlement
     * @returns A promise that resolves to the settlement response
     */
    async settle(
      payload: RequestedPaymentPayload,
      paymentRequirements: RequestedPaymentRequirements,
      waitUntil?: WaitUntil,
    ): Promise<FacilitatorSettleResponse> {
      let headers = { "Content-Type": "application/json" };
      headers = { ...headers, ...AUTH_HEADERS.settle };
      const waitUntilParam = waitUntil || config.waitUntil;

      const res = await fetch(new URL("/settle", BASE_URL), {
        method: "POST",
        headers,
        body: stringify({
          x402Version: payload.x402Version,
          paymentPayload: payload,
          paymentRequirements: paymentRequirements,
          ...(waitUntilParam ? { waitUntil: waitUntilParam } : {}),
        }),
      });

      if (res.status !== 200) {
        const text = `${res.statusText} ${await res.text()}`;
        throw new Error(`Failed to settle payment: ${res.status} ${text}`);
      }

      const data = await res.json();
      return data as FacilitatorSettleResponse;
    },

    /**
     * Gets the supported payment kinds from the facilitator service.
     *
     * @returns A promise that resolves to the supported payment kinds
     */
    async supported(filters?: {
      chainId: number;
      tokenAddress?: string;
    }): Promise<FacilitatorSupportedResponse> {
      const headers = {
        "Content-Type": "application/json",
        ...AUTH_HEADERS.supported,
      };
      const supportedUrl = new URL("/supported", BASE_URL);
      if (filters?.chainId) {
        supportedUrl.searchParams.set("chainId", filters.chainId.toString());
      }
      if (filters?.tokenAddress) {
        supportedUrl.searchParams.set("tokenAddress", filters.tokenAddress);
      }
      const res = await fetch(supportedUrl, { headers });

      if (res.status !== 200) {
        throw new Error(
          `Failed to get supported payment kinds: ${res.statusText}`,
        );
      }

      const data = await res.json();
      return data as FacilitatorSupportedResponse;
    },
  } as const satisfies ThirdwebX402Facilitator;
}
