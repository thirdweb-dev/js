import type { Hex as ox__Hex } from "ox";
import type { ThirdwebClient } from "../client/client.js";
import type { PurchaseData } from "../pay/types.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";
import { ApiError } from "./types/Errors.js";

/**
 * Retrieves the status of an Onramp session created via {@link Bridge.Onramp.prepare}. The
 * status will include any on-chain transactions that have occurred as a result of the onramp
 * as well as any arbitrary `purchaseData` that was supplied when the onramp was
 * prepared.
 *
 * @example
 * ```typescript
 * import { Bridge } from "thirdweb";
 *
 * const onrampStatus = await Bridge.Onramp.status({
 *   id: "022218cc-96af-4291-b90c-dadcb47571ec",
 *   client: thirdwebClient,
 * });
 *
 * // Possible results:
 * // {
 * //   status: "CREATED",
 * //   transactions: [],
 * //   purchaseData: {
 * //     orderId: "abc-123",
 * //   },
 * // }
 * //
 * // or
 * // {
 * //   status: "PENDING",
 * //   transactions: [],
 * //   purchaseData: {
 * //     orderId: "abc-123",
 * //   },
 * // }
 * //
 * // or
 * // {
 * //   status: "COMPLETED",
 * //   transactions: [
 * //     {
 * //       chainId: 1,
 * //       transactionHash:
 * //         "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
 * //     },
 * //   ],
 * //   purchaseData: {
 * //     orderId: "abc-123",
 * //   },
 * // }
 * ```
 *
 * @param options - The options for fetching the onramp status.
 * @param options.id - The UUID returned from {@link Bridge.Onramp.prepare}.
 * @param options.client - Your thirdweb client instance.
 *
 * @returns A promise that resolves to the status of the onramp session.
 *
 * @throws Will throw an error if there is an issue fetching the status.
 * @bridge Onramp
 * @beta
 */
export async function status(options: status.Options): Promise<status.Result> {
  const { id, client } = options;

  const clientFetch = getClientFetch(client);
  const url = new URL(`${getThirdwebBaseUrl("bridge")}/v1/onramp/status`);
  url.searchParams.set("id", id);

  const response = await clientFetch(url.toString());
  if (!response.ok) {
    const errorJson = await response.json();
    throw new ApiError({
      code: errorJson.code || "UNKNOWN_ERROR",
      correlationId: errorJson.correlationId || undefined,
      message: errorJson.message || response.statusText,
      statusCode: response.status,
    });
  }

  const { data }: { data: status.Result } = await response.json();
  return data;
}

export declare namespace status {
  /**
   * Input parameters for {@link Bridge.Onramp.status}.
   */
  export type Options = {
    /**
     * The Onramp session ID returned by {@link Bridge.Onramp.prepare}.
     */
    id: string;
    /** Your {@link ThirdwebClient} instance. */
    client: ThirdwebClient;
  };

  /**
   * The result returned from {@link Bridge.Onramp.status}.
   */
  export type Result =
    | {
        status: "COMPLETED";
        transactions: Array<{
          chainId: number;
          transactionHash: ox__Hex.Hex;
        }>;
        purchaseData?: PurchaseData;
      }
    | {
        status: "PENDING";
        transactions: Array<{
          chainId: number;
          transactionHash: ox__Hex.Hex;
        }>;
        purchaseData?: PurchaseData;
      }
    | {
        status: "CREATED";
        transactions: Array<{
          chainId: number;
          transactionHash: ox__Hex.Hex;
        }>;
        purchaseData?: PurchaseData;
      }
    | {
        status: "FAILED";
        transactions: Array<{
          chainId: number;
          transactionHash: ox__Hex.Hex;
        }>;
        purchaseData?: PurchaseData;
      };
}
