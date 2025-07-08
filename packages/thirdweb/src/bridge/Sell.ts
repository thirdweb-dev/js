import type { Address as ox__Address } from "ox";
import { defineChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import type { PurchaseData } from "../pay/types.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";
import { stringify } from "../utils/json.js";
import { ApiError } from "./types/Errors.js";
import type { PreparedQuote, Quote } from "./types/Quote.js";

/**
 * Retrieves a Universal Bridge quote for the provided sell intent. The quote will specify the expected `destinationAmount` that will be received in exchange for the specified `originAmount`, which is specified with the `sellAmountWei` option.
 *
 * @example
 * ```typescript
 * import { Bridge, NATIVE_TOKEN_ADDRESS } from "thirdweb";
 *
 * const quote = await Bridge.Sell.quote({
 *   originChainId: 1,
 *   originTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   destinationChainId: 10,
 *   destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   amount: toWei("0.01"),
 *   client: thirdwebClient,
 * });
 * ```
 *
 * This will return a quote that might look like:
 * ```typescript
 * {
 *   originAmount: 1000000000000000000n,
 *   destinationAmount: 9999979011973735n,
 *   blockNumber: 22026509n,
 *   timestamp: 1741730936680,
 *   estimatedExecutionTimeMs: 1000
 *   steps: [
 *     {
 *       originToken: {
 *         chainId: 1,
 *         address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *         symbol: "ETH",
 *         name: "Ethereum",
 *         decimals: 18,
 *         priceUsd: 2000,
 *         iconUri: "https://..."
 *       },
 *       destinationToken: {
 *         chainId: 10,
 *         address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *         symbol: "ETH",
 *         name: "Ethereum",
 *         decimals: 18,
 *         priceUsd: 2000,
 *         iconUri: "https://..."
 *       },
 *       originAmount: 1000000000000000000n,
 *       destinationAmount:  99999979011973735n,
 *       estimatedExecutionTimeMs: 1000
 *     }
 *   ],
 *   intent: {
 *     originChainId: 1,
 *     originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *     destinationChainId: 10,
 *     destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *     amount: 1000000000000000000n
 *   }
 * }
 * ```
 *
 * The quote is an **estimate** for how much you would expect to receive for a specific sell. This quote is not guaranteed and you should use `Sell.prepare` to get a finalized quote with transaction data ready for execution.
 * So why use `quote`? The quote function is sometimes slightly faster than `prepare`, and can be used before the user connects their wallet.
 *
 * You can access this functions input and output types with `Sell.quote.Options` and `Sell.quote.Result`, respectively.
 *
 * To limit quotes to routes that have a certain number of steps involved, use the `maxSteps` option.
 *
 * ```ts
 * const quote = await Bridge.Sell.quote({
 *   originChainId: 1,
 *   originTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   destinationChainId: 10,
 *   destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   amount: toWei("0.01"),
 *   maxSteps: 2, // Will only return a quote for routes with 2 or fewer steps
 *   client: thirdwebClient,
 * });
 * ```
 *
 * @param options - The options for the quote.
 * @param options.originChainId - The chain ID of the origin token.
 * @param options.originTokenAddress - The address of the origin token.
 * @param options.destinationChainId - The chain ID of the destination token.
 * @param options.destinationTokenAddress - The address of the destination token.
 * @param options.amount - The amount of the origin token to sell.
 * @param [options.maxSteps] - Limit the number of total steps in the route.
 * @param options.client - Your thirdweb client.
 *
 * @returns A promise that resolves to a non-finalized quote for the requested sell.
 *
 * @throws Will throw an error if there is an issue fetching the quote.
 * @bridge Sell
 * @beta
 */
export async function quote(options: quote.Options): Promise<quote.Result> {
  const {
    originChainId,
    originTokenAddress,
    destinationChainId,
    destinationTokenAddress,
    amount,
    client,
    maxSteps,
  } = options;

  const clientFetch = getClientFetch(client);
  const url = new URL(`${getThirdwebBaseUrl("bridge")}/v1/sell/quote`);
  url.searchParams.set("originChainId", originChainId.toString());
  url.searchParams.set("originTokenAddress", originTokenAddress);
  url.searchParams.set("destinationChainId", destinationChainId.toString());
  url.searchParams.set("destinationTokenAddress", destinationTokenAddress);
  url.searchParams.set("sellAmountWei", amount.toString());
  url.searchParams.set("amount", amount.toString());
  if (typeof maxSteps !== "undefined") {
    url.searchParams.set("maxSteps", maxSteps.toString());
  }

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

  const { data }: { data: Quote } = await response.json();
  return {
    blockNumber: data.blockNumber ? BigInt(data.blockNumber) : undefined,
    destinationAmount: BigInt(data.destinationAmount),
    estimatedExecutionTimeMs: data.estimatedExecutionTimeMs,
    intent: {
      amount,
      destinationChainId,
      destinationTokenAddress,
      originChainId,
      originTokenAddress,
    },
    originAmount: BigInt(data.originAmount),
    steps: data.steps,
    timestamp: data.timestamp,
  };
}

export declare namespace quote {
  type Options = {
    originChainId: number;
    originTokenAddress: ox__Address.Address;
    destinationChainId: number;
    destinationTokenAddress: ox__Address.Address;
    amount: bigint;
    client: ThirdwebClient;
    maxSteps?: number;
  };

  type Result = Quote & {
    intent: {
      originChainId: number;
      originTokenAddress: ox__Address.Address;
      destinationChainId: number;
      destinationTokenAddress: ox__Address.Address;
      amount: bigint;
    };
  };
}

/**
 * Prepares a **finalized** Universal Bridge quote for the provided sell request with transaction data. This function will return everything `quote` does, with the addition of a series of prepared transactions and the associated expiration timestamp.
 *
 * @example
 * ```typescript
 * import { Bridge, NATIVE_TOKEN_ADDRESS } from "thirdweb";
 *
 * const quote = await Bridge.Sell.prepare({
 *   originChainId: 1,
 *   originTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   destinationChainId: 10,
 *   destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   amount: toWei("0.01"),
 *   client: thirdwebClient,
 * });
 * ```
 *
 * This will return a quote that might look like:
 * ```typescript
 * {
 *   originAmount: 2000000000n,
 *   destinationAmount:  9980000000000000000n,
 *   blockNumber: 22026509n,
 *   timestamp: 1741730936680,
 *   estimatedExecutionTimeMs: 1000
 *   steps: [
 *     {
 *       originToken: {
 *         chainId: 1,
 *         address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
 *         symbol: "USDC",
 *         name: "USDC",
 *         decimals: 6,
 *         priceUsd: 1,
 *         iconUri: "https://..."
 *       },
 *       destinationToken: {
 *         chainId: 10,
 *         address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *         symbol: "ETH",
 *         name: "Ethereum",
 *         decimals: 18,
 *         priceUsd: 2000,
 *         iconUri: "https://..."
 *       },
 *       originAmount: 2000000000n,
 *       destinationAmount:  9980000000000000000n,
 *       estimatedExecutionTimeMs: 1000
 *     }
 *     transactions: [
 *       {
 *         id: "0x...",
 *         action: "approval",
 *         to: "0x...",
 *         data: "0x...",
 *         chainId: 10,
 *         type: "eip1559"
 *       },
 *       {
 *         id: "0x...",
 *         action: "sell",
 *         to: "0x...",
 *         data: "0x...",
 *         chainId: 10,
 *         type: "eip1559"
 *       }
 *     ],
 *   ],
 *   expiration: 1741730936680,
 *   intent: {
 *     originChainId: 1,
 *     originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
 *     destinationChainId: 10,
 *     destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *     amount: 2000000000n
 *   }
 * }
 * ```
 *
 * ## Sending the transactions
 * The `transactions` array is a series of transactions ready to be executed (with `sendTransaction`) must be executed one after the other in order to fulfill the complete route. There are a few things to keep in mind when executing these transactions:
 *  - Approvals will have the `approval` action specified. You can perform approvals with `sendAndConfirmTransaction`, then proceed to the next transaction.
 *  - All transactions are assumed to be executed by the `sender` address, regardless of which chain they are on. The final transaction will use the `receiver` as the recipient address.
 *  - If an `expiration` timestamp is provided, all transactions must be executed before that time to guarantee successful execution at the specified price.
 *
 * NOTE: To get the status of each non-approval transaction, use `Bridge.status` rather than checking for transaction inclusion. This function will ensure full bridge completion on the destination chain.
 *
 * You can access this functions input and output types with `Sell.prepare.Options` and `Sell.prepare.Result`, respectively.
 *
 * You can include arbitrary data to be included on any webhooks and status responses with the `purchaseData` option.
 *
 * ```ts
 * const quote = await Bridge.Sell.prepare({
 *   originChainId: 1,
 *   originTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   destinationChainId: 10,
 *   destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   amount: toWei("0.01"),
 *   purchaseData: {
 *     size: "large",
 *     shippingAddress: "123 Main St, New York, NY 10001",
 *   },
 *   client: thirdwebClient,
 * });
 * ```
 *
 * To limit quotes to routes that have a certain number of steps involved, use the `maxSteps` option.
 *
 * ```ts
 * const quote = await Bridge.Sell.prepare({
 *   originChainId: 1,
 *   originTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   destinationChainId: 10,
 *   destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   amount: toWei("0.01"),
 *   maxSteps: 2, // Will only return a quote for routes with 2 or fewer steps
 *   client: thirdwebClient,
 * });
 * ```
 *
 * @param options - The options for the quote.
 * @param options.originChainId - The chain ID of the origin token.
 * @param options.originTokenAddress - The address of the origin token.
 * @param options.destinationChainId - The chain ID of the destination token.
 * @param options.destinationTokenAddress - The address of the destination token.
 * @param options.amount - The amount of the origin token to sell.
 * @param options.sender - The address of the sender.
 * @param options.receiver - The address of the recipient.
 * @param options.purchaseData - Arbitrary data to be passed to the purchase function and included with any webhooks or status calls.
 * @param [options.maxSteps] - Limit the number of total steps in the route.
 * @param options.client - Your thirdweb client.
 *
 * @returns A promise that resolves to a finalized quote and transactions for the requested sell.
 *
 * @throws Will throw an error if there is an issue fetching the quote.
 * @bridge Sell
 * @beta
 */
export async function prepare(
  options: prepare.Options,
): Promise<prepare.Result> {
  const {
    originChainId,
    originTokenAddress,
    destinationChainId,
    destinationTokenAddress,
    amount,
    sender,
    receiver,
    client,
    purchaseData,
    maxSteps,
    paymentLinkId,
  } = options;

  const clientFetch = getClientFetch(client);
  const url = new URL(`${getThirdwebBaseUrl("bridge")}/v1/sell/prepare`);

  const response = await clientFetch(url.toString(), {
    body: stringify({
      amount: amount.toString(),
      destinationChainId: destinationChainId.toString(),
      destinationTokenAddress,
      maxSteps,
      originChainId: originChainId.toString(),
      originTokenAddress,
      paymentLinkId,
      purchaseData,
      receiver,
      sellAmountWei: amount.toString(),
      sender,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  if (!response.ok) {
    const errorJson = await response.json();
    throw new ApiError({
      code: errorJson.code || "UNKNOWN_ERROR",
      correlationId: errorJson.correlationId || undefined,
      message: errorJson.message || response.statusText,
      statusCode: response.status,
    });
  }

  const { data }: { data: PreparedQuote } = await response.json();
  return {
    blockNumber: data.blockNumber ? BigInt(data.blockNumber) : undefined,
    destinationAmount: BigInt(data.destinationAmount),
    estimatedExecutionTimeMs: data.estimatedExecutionTimeMs,
    expiration: data.expiration,
    intent: {
      amount,
      destinationChainId,
      destinationTokenAddress,
      originChainId,
      originTokenAddress,
      purchaseData,
      receiver,
      sender,
    },
    originAmount: BigInt(data.originAmount),
    steps: data.steps.map((step) => ({
      ...step,
      transactions: step.transactions.map((transaction) => ({
        ...transaction,
        chain: defineChain(transaction.chainId),
        client,
        value: transaction.value ? BigInt(transaction.value) : undefined,
      })),
    })),
    timestamp: data.timestamp,
  };
}

export declare namespace prepare {
  type Options = {
    originChainId: number;
    originTokenAddress: ox__Address.Address;
    destinationChainId: number;
    destinationTokenAddress: ox__Address.Address;
    amount: bigint;
    sender: ox__Address.Address;
    receiver: ox__Address.Address;
    client: ThirdwebClient;
    purchaseData?: PurchaseData;
    maxSteps?: number;
    /**
     * @hidden
     */
    paymentLinkId?: string;
  };

  type Result = PreparedQuote & {
    intent: {
      originChainId: number;
      originTokenAddress: ox__Address.Address;
      destinationChainId: number;
      destinationTokenAddress: ox__Address.Address;
      amount: bigint;
      sender: ox__Address.Address;
      receiver: ox__Address.Address;
      purchaseData?: PurchaseData;
    };
  };
}
