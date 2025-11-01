import type { VerifyResponse } from "x402/types";
import type { ThirdwebClient } from "../client/client.js";
import { stringify } from "../utils/json.js";
import { withCache } from "../utils/promise/withCache.js";
import {
  type FacilitatorSettleResponse,
  type FacilitatorSupportedResponse,
  type FacilitatorVerifyResponse,
  networkToCaip2ChainId,
  type RequestedPaymentPayload,
  type RequestedPaymentRequirements,
} from "./schemas.js";
import type { PaymentArgs, PaymentRequiredResult } from "./types.js";

export type WaitUntil = "simulated" | "submitted" | "confirmed";

export type ThirdwebX402FacilitatorConfig = {
  client: ThirdwebClient;
  serverWalletAddress: string;
  waitUntil?: WaitUntil;
  vaultAccessToken?: string;
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
  accepts: (
    args: Omit<PaymentArgs, "facilitator">,
  ) => Promise<PaymentRequiredResult>;
};

const DEFAULT_BASE_URL = "https://api.thirdweb.com/v1/payments/x402";

/**
 * Creates a facilitator for the x402 payment protocol.
 * You can use this with `settlePayment` or with any x402 middleware to enable settling transactions with your thirdweb server wallet.
 *
 * @param config - The configuration for the facilitator
 * @returns a x402 compatible FacilitatorConfig
 *
 * @example
 * ```ts
 * import { facilitator } from "thirdweb/x402";
 * import { createThirdwebClient } from "thirdweb";
 * import { paymentMiddleware } from 'x402-hono'
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
 * #### Configuration Options
 * 
 * ```ts
 * const thirdwebX402Facilitator = facilitator({
 *   client: client,
 *   serverWalletAddress: "0x1234567890123456789012345678901234567890",
 *   // Optional: Wait behavior for settlements
 *   // - "simulated": Only simulate the transaction (fastest)
 *   // - "submitted": Wait until transaction is submitted
 *   // - "confirmed": Wait for full on-chain confirmation (slowest, default)
 *   waitUntil: "confirmed",
 * });

 * ```
 *
 * @bridge x402
 */
export function facilitator(
  config: ThirdwebX402FacilitatorConfig,
): ThirdwebX402Facilitator {
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
  const facilitator = {
    url: (config.baseUrl ?? DEFAULT_BASE_URL) as `${string}://${string}`,
    address: serverWalletAddress,
    createAuthHeaders: async () => {
      return {
        verify: {
          "x-secret-key": secretKey,
        },
        settle: {
          "x-secret-key": secretKey,
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
      const url = config.baseUrl ?? DEFAULT_BASE_URL;

      let headers = { "Content-Type": "application/json" };
      const authHeaders = await facilitator.createAuthHeaders();
      headers = { ...headers, ...authHeaders.verify };

      const res = await fetch(`${url}/verify`, {
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
      const url = config.baseUrl ?? DEFAULT_BASE_URL;

      let headers = { "Content-Type": "application/json" };
      const authHeaders = await facilitator.createAuthHeaders();
      headers = { ...headers, ...authHeaders.settle };
      const waitUntilParam = waitUntil || config.waitUntil;

      const res = await fetch(`${url}/settle`, {
        method: "POST",
        headers,
        body: JSON.stringify({
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
      const url = config.baseUrl ?? DEFAULT_BASE_URL;
      return withCache(
        async () => {
          let headers = { "Content-Type": "application/json" };
          const authHeaders = await facilitator.createAuthHeaders();
          headers = { ...headers, ...authHeaders.supported };
          const supportedUrl = new URL(`${url}/supported`);
          if (filters?.chainId) {
            supportedUrl.searchParams.set(
              "chainId",
              filters.chainId.toString(),
            );
          }
          if (filters?.tokenAddress) {
            supportedUrl.searchParams.set("tokenAddress", filters.tokenAddress);
          }
          const res = await fetch(supportedUrl.toString(), { headers });

          if (res.status !== 200) {
            throw new Error(
              `Failed to get supported payment kinds: ${res.statusText}`,
            );
          }

          const data = await res.json();
          return data as FacilitatorSupportedResponse;
        },
        {
          cacheKey: `supported-payment-kinds-${url}-${filters?.chainId}-${filters?.tokenAddress}2`,
          cacheTime: 1000 * 60 * 60 * 1, // 1 hour
        },
      );
    },

    async accepts(
      args: Omit<PaymentArgs, "facilitator">,
    ): Promise<PaymentRequiredResult> {
      const url = config.baseUrl ?? DEFAULT_BASE_URL;
      let headers = { "Content-Type": "application/json" };
      const authHeaders = await facilitator.createAuthHeaders();
      headers = { ...headers, ...authHeaders.verify }; // same as verify
      const caip2ChainId = networkToCaip2ChainId(args.network);
      const res = await fetch(`${url}/accepts`, {
        method: "POST",
        headers,
        body: stringify({
          resourceUrl: args.resourceUrl,
          method: args.method,
          network: caip2ChainId,
          price: args.price,
          routeConfig: args.routeConfig,
          serverWalletAddress: facilitator.address,
          recipientAddress: args.payTo,
        }),
      });
      if (res.status !== 402) {
        throw new Error(
          `Failed to construct payment requirements: ${res.statusText} - ${await res.text()}`,
        );
      }
      return {
        status: res.status as 402,
        responseBody:
          (await res.json()) as PaymentRequiredResult["responseBody"],
        responseHeaders: {
          "Content-Type": "application/json",
        },
      };
    },
  };

  return facilitator;
}
