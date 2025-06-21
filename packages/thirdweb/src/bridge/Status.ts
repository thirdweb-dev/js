import type { Hex as ox__Hex } from "ox";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";
import { ApiError } from "./types/Errors.js";
import type { Status } from "./types/Status.js";

/**
 * Retrieves a Universal Bridge quote for the provided sell intent. The quote will specify the expected `destinationAmount` that will be received in exchange for the specified `originAmount`, which is specified with the `sellAmountWei` option.
 *
 * The returned status will include both the origin and destination transactions and any finalized amounts for the route.
 *
 * @example
 * ```typescript
 * import { Bridge } from "thirdweb";
 *
 * const status = await Bridge.status({
 *   transactionHash: "0xe199ef82a0b6215221536e18ec512813c1aa10b4f5ed0d4dfdfcd703578da56d",
 *   chainId: 8453,
 *   client: thirdwebClient,
 * });
 * ```
 *
 * If the transaction is complete, a response might look like:
 * ```typescript
 * {
 *   status: 'COMPLETED',
 *   originAmount: 200000000000000n,
 *   destinationAmount: 188625148000000n,
 *   originChainId: 8453,
 *   destinationChainId: 2741,
 *   originTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
 *   destinationTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
 *   transactions: [
 *     {
 *       chainId: 8453,
 *       transactionHash: '0xe199ef82a0b6215221536e18ec512813c1aa10b4f5ed0d4dfdfcd703578da56d'
 *     },
 *     {
 *       chainId: 2741,
 *       transactionHash: '0xa70a82f42330f54be95a542e1fcfe6ed2dd9f07fb8c82ae67afb4342319f7433'
 *     }
 *   ],
 *   purchaseData: {
 *     foo: "bar"
 *   }
 * }
 * ```
 *
 * If the origin transaction hasn't been mined yet, a response might look like:
 * ```typescript
 * {
 *   status: "NOT_FOUND",
 * }
 * ```
 * This is to allow you to poll for the status without catching an error. Be sure your transaction hash and chain are correct though, as this could also represent a legitimate 404 if the transaction doesn't exist.
 *
 * If the transaction is still pending, a response might look like:
 * ```typescript
 * {
 *   status: "PENDING",
 *   originAmount: 1000000000000000000n,
 *   originChainId: 466,
 *   destinationChainId: 1,
 *   originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *   destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *   transactions: [
 *     {
 *       transactionHash: "0xe199ef82a0b6215221536e18ec512813c1aa10b4f5ed0d4dfdfcd703578da56d",
 *       chainId: 466,
 *     }
 *   ]
 * }
 * ```
 *
 * If the transaction failed, a response might look like:
 * ```typescript
 * {
 *   status: "FAILED",
 *   transactions: [
 *     {
 *       transactionHash: "0xe199ef82a0b6215221536e18ec512813c1aa10b4f5ed0d4dfdfcd703578da56d",
 *       chainId: 466,
 *     }
 *   ]
 * }
 * ```
 *
 * This status is for a **single origin transaction only**. If your route involves multiple transactions, you'll need to get the status for each of them individually.
 *
 * If sending multiple dependent sequential transactions, wait until `status` returns `COMPLETED` before sending the next transaction.
 *
 * You can access this function's input and output types with `status.Options` and `status.Result`, respectively.
 *
 * @param options - The options for the quote.
 * @param options.transactionHash - The hash of the origin transaction to get the bridge status for.
 * @param options.chainId - The chain ID of the origin token.
 * @param options.client - Your thirdweb client.
 *
 * @returns A promise that resolves to a status object for the transaction.
 *
 * @throws Will throw an error if there is an issue fetching the status.
 * @bridge
 * @beta
 */
export async function status(options: status.Options): Promise<status.Result> {
  const { transactionHash, client } = options;
  const chainId = "chainId" in options ? options.chainId : options.chain.id;

  const clientFetch = getClientFetch(client);
  const url = new URL(`${getThirdwebBaseUrl("bridge")}/v1/status`);
  url.searchParams.set("transactionHash", transactionHash);
  url.searchParams.set("chainId", chainId.toString());

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

  const { data }: { data: Status } = await response.json();
  if (data.status === "FAILED") {
    return {
      paymentId: data.paymentId,
      status: "FAILED",
      transactions: data.transactions,
    };
  }

  if (data.status === "PENDING") {
    return {
      destinationChainId: data.destinationChainId,
      destinationToken: data.destinationToken,
      destinationTokenAddress: data.destinationTokenAddress,
      originAmount: BigInt(data.originAmount),
      originChainId: data.originChainId,
      originToken: data.originToken,
      originTokenAddress: data.originTokenAddress,
      paymentId: data.paymentId,
      purchaseData: data.purchaseData,
      receiver: data.receiver,
      sender: data.sender,
      status: "PENDING",
      transactions: data.transactions,
    };
  }

  if (data.status === "NOT_FOUND") {
    return {
      paymentId: data.paymentId,
      status: "NOT_FOUND",
      transactions: [],
    };
  }

  return {
    destinationAmount: BigInt(data.destinationAmount),
    destinationChainId: data.destinationChainId,
    destinationToken: data.destinationToken,
    destinationTokenAddress: data.destinationTokenAddress,
    originAmount: BigInt(data.originAmount),
    originChainId: data.originChainId,
    originToken: data.originToken,
    originTokenAddress: data.originTokenAddress,
    paymentId: data.paymentId,
    purchaseData: data.purchaseData,
    receiver: data.receiver,
    sender: data.sender,
    status: "COMPLETED",
    transactions: data.transactions,
  };
}

export declare namespace status {
  type Options =
    | {
        transactionHash: ox__Hex.Hex;
        chainId: number;
        client: ThirdwebClient;
      }
    | {
        transactionHash: ox__Hex.Hex;
        chain: Chain;
        client: ThirdwebClient;
      };

  type Result = Status;
}
