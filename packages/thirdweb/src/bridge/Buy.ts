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
 * Retrieves a Universal Bridge quote for the provided buy intent. The quote will specify the necessary `originAmount` to receive the desired `destinationAmount`, which is specified with the `buyAmountWei` option.
 *
 * @example
 * ```typescript
 * import { Bridge, NATIVE_TOKEN_ADDRESS } from "thirdweb";
 *
 * const quote = await Bridge.Buy.quote({
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
 *   originAmount: 10000026098875381n,
 *   destinationAmount: 1000000000000000000n,
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
 *         priceUsd: 0.0025,
 *         iconUri: "https://..."
 *       },
 *       destinationToken: {
 *         chainId: 10,
 *         address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *         symbol: "ETH",
 *         name: "Ethereum",
 *         decimals: 18,
 *         priceUsd: 0.0025,
 *         iconUri: "https://..."
 *       },
 *       originAmount: 10000026098875381n,
 *       destinationAmount: 1000000000000000000n,
 *       estimatedExecutionTimeMs: 1000
 *     }
 *   ],
 *   intent: {
 *     originChainId: 1,
 *     originTokenAddress: NATIVE_TOKEN_ADDRESS,
 *     destinationChainId: 10,
 *     destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
 *     amount: 1000000000000000000n
 *   }
 * }
 * ```
 *
 * The quote is an **estimate** for how much you would expect to pay for a specific buy. This quote is not guaranteed and you should use `Buy.prepare` to get a finalized quote with transaction data ready for execution.
 * So why use `quote`? The quote function is sometimes slightly faster than `prepare`, and can be used before the user connects their wallet.
 *
 * You can access this functions input and output types with `Buy.quote.Options` and `Buy.quote.Result`, respectively.
 *
 * To limit quotes to routes that have a certain number of steps involved, use the `maxSteps` option.
 *
 * ```ts
 * const quote = await Bridge.Buy.quote({
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
 * @param options.amount - The amount of the destination token to receive.
 * @param [options.maxSteps] - Limit the number of total steps in the route.
 * @param options.client - Your thirdweb client.
 *
 * @returns A promise that resolves to a non-finalized quote for the requested buy.
 *
 * @throws Will throw an error if there is an issue fetching the quote.
 * @bridge Buy
 */
export async function quote(options: quote.Options): Promise<quote.Result> {
  const {
    originChainId,
    originTokenAddress,
    destinationChainId,
    destinationTokenAddress,
    client,
    maxSteps,
  } = options;
  const amount =
    "buyAmountWei" in options ? options.buyAmountWei : options.amount;

  const clientFetch = getClientFetch(client);
  const url = new URL(`${getThirdwebBaseUrl("bridge")}/v1/buy/quote`);
  url.searchParams.set("originChainId", originChainId.toString());
  url.searchParams.set("originTokenAddress", originTokenAddress);
  url.searchParams.set("destinationChainId", destinationChainId.toString());
  url.searchParams.set("destinationTokenAddress", destinationTokenAddress);
  url.searchParams.set("buyAmountWei", amount.toString());
  url.searchParams.set("amount", amount.toString());
  if (maxSteps) {
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
      buyAmountWei: amount,
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
    client: ThirdwebClient;
    maxSteps?: number;
  } & (
    | {
        buyAmountWei: bigint;
      }
    | {
        amount: bigint;
      }
  );

  type Result = Quote & {
    intent: {
      originChainId: number;
      originTokenAddress: ox__Address.Address;
      destinationChainId: number;
      destinationTokenAddress: ox__Address.Address;
      buyAmountWei: bigint;
      amount: bigint;
    };
  };
}

/**
 * Prepares a **finalized** Universal Bridge quote for the provided buy request with transaction data. This function will return everything `quote` does, with the addition of a series of prepared transactions and the associated expiration timestamp.
 *
 * @example
 * ```typescript
 * import { Bridge, NATIVE_TOKEN_ADDRESS } from "thirdweb";
 *
 * const quote = await Bridge.Buy.prepare({
 *   originChainId: 1,
 *   originTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   destinationChainId: 10,
 *   destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   amount: toWei("0.01"),
 *   sender: "0x...",
 *   receiver: "0x...",
 *   client: thirdwebClient,
 * });
 * ```
 *
 * This will return a quote that might look like:
 * ```typescript
 * {
 *   originAmount: 2000030000n,
 *   destinationAmount: 1000000000000000000n,
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
 *       originAmount: 2000030000n,
 *       destinationAmount: 1000000000000000000n,
 *       estimatedExecutionTimeMs: 1000
 *       transactions: [
 *         {
 *           action: "approval",
 *           id: "0x",
 *           to: "0x...",
 *           data: "0x...",
 *           chainId: 10,
 *           type: "eip1559"
 *         },
 *         {
 *           action: "buy",
 *           to: "0x...",
 *           value: 10000026098875381n,
 *           data: "0x...",
 *           chainId: 10,
 *           type: "eip1559"
 *         }
 *       ]
 *     }
 *   ],
 *   expiration: 1741730936680,
 *   intent: {
 *     originChainId: 1,
 *     originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
 *     destinationChainId: 10,
 *     destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *     amount: 1000000000000000000n
 *   }
 * }
 * ```
 *
 * ## Sending the transactions
 * The `transactions` array is a series of transactions ready to be executed (with `sendTransaction`) one after the other in order to fulfill the complete route. There are a few things to keep in mind when executing these transactions:
 *  - Approvals will have the `approval` action specified. You can perform approvals with `sendAndConfirmTransaction`, then proceed to the next transaction.
 *  - All transactions are assumed to be executed by the `sender` address, regardless of which chain they are on. The final transaction will use the `receiver` as the recipient address.
 *  - If an `expiration` timestamp is provided, all transactions must be executed before that time to guarantee successful execution at the specified price.
 *
 * NOTE: To get the status of each non-approval transaction, use `Bridge.status` rather than checking for transaction inclusion. This function will ensure full bridge completion on the destination chain.
 *
 * You can access this functions input and output types with `Buy.prepare.Options` and `Buy.prepare.Result`, respectively.
 *
 * You can include arbitrary data to be included on any webhooks and status responses with the `purchaseData` option.
 *
 * ```ts
 * const quote = await Bridge.Buy.prepare({
 *   originChainId: 1,
 *   originTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   destinationChainId: 10,
 *   destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   amount: toWei("0.01"),
 *   sender: "0x...",
 *   receiver: "0x...",
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
 * const quote = await Bridge.Buy.prepare({
 *   originChainId: 1,
 *   originTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   destinationChainId: 10,
 *   destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   amount: toWei("0.01"),
 *   sender: "0x...",
 *   receiver: "0x...",
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
 * @param options.amount - The amount of the destination token to receive.
 * @param options.sender - The address of the sender.
 * @param options.receiver - The address of the recipient.
 * @param [options.purchaseData] - Arbitrary data to be passed to the purchase function and included with any webhooks or status calls.
 * @param [options.maxSteps] - Limit the number of total steps in the route.
 * @param options.client - Your thirdweb client.
 *
 * @returns A promise that resolves to a finalized quote and transactions for the requested buy.
 *
 * @throws Will throw an error if there is an issue fetching the quote.
 * @bridge Buy
 */
export async function prepare(
  options: prepare.Options,
): Promise<prepare.Result> {
  const {
    originChainId,
    originTokenAddress,
    destinationChainId,
    destinationTokenAddress,
    sender,
    receiver,
    client,
    amount,
    purchaseData,
    maxSteps,
    paymentLinkId,
  } = options;

  const clientFetch = getClientFetch(client);
  const url = new URL(`${getThirdwebBaseUrl("bridge")}/v1/buy/prepare`);

  const response = await clientFetch(url.toString(), {
    body: stringify({
      amount: amount.toString(), // legacy
      buyAmountWei: amount.toString(),
      destinationChainId: destinationChainId.toString(),
      destinationTokenAddress,
      maxSteps,
      originChainId: originChainId.toString(),
      originTokenAddress,
      paymentLinkId,
      purchaseData,
      receiver,
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
    intent: {
      amount,
      destinationChainId,
      destinationTokenAddress,
      originChainId,
      originTokenAddress,
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
    sender: ox__Address.Address;
    receiver: ox__Address.Address;
    amount: bigint;
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
