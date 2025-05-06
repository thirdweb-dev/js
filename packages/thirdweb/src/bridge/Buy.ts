import type { Address as ox__Address } from "ox";
import { defineChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { getClientFetch } from "../utils/fetch.js";
import { stringify } from "../utils/json.js";
import { UNIVERSAL_BRIDGE_URL } from "./constants.js";
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
 * @beta
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
  const url = new URL(`${UNIVERSAL_BRIDGE_URL}/buy/quote`);
  url.searchParams.set("originChainId", originChainId.toString());
  url.searchParams.set("originTokenAddress", originTokenAddress);
  url.searchParams.set("destinationChainId", destinationChainId.toString());
  url.searchParams.set("destinationTokenAddress", destinationTokenAddress);
  url.searchParams.set("buyAmountWei", amount.toString());
  if (maxSteps) {
    url.searchParams.set("maxSteps", maxSteps.toString());
  }

  const response = await clientFetch(url.toString());
  if (!response.ok) {
    const errorJson = await response.json();
    throw new Error(
      `${errorJson.code} | ${errorJson.message} - ${errorJson.correlationId}`,
    );
  }

  const { data }: { data: Quote } = await response.json();
  return {
    originAmount: BigInt(data.originAmount),
    destinationAmount: BigInt(data.destinationAmount),
    blockNumber: data.blockNumber ? BigInt(data.blockNumber) : undefined,
    timestamp: data.timestamp,
    estimatedExecutionTimeMs: data.estimatedExecutionTimeMs,
    steps: data.steps,
    intent: {
      originChainId,
      originTokenAddress,
      destinationChainId,
      destinationTokenAddress,
      buyAmountWei: amount,
      amount,
    },
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
 *       originAmount: 10000026098875381n,
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
 *     originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *     destinationChainId: 10,
 *     destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *     amount: 1000000000000000000n
 *   }
 * }
 * ```
 *
 * ## Sending the transactions
 * The `transactions` array is a series of [ox](https://oxlib.sh) EIP-1559 transactions that must be executed one after the other in order to fulfill the complete route. There are a few things to keep in mind when executing these transactions:
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
 * @param options.purchaseData - Arbitrary data to be passed to the purchase function and included with any webhooks or status calls.
 * @param [options.maxSteps] - Limit the number of total steps in the route.
 * @param options.client - Your thirdweb client.
 *
 * @returns A promise that resolves to a finalized quote and transactions for the requested buy.
 *
 * @throws Will throw an error if there is an issue fetching the quote.
 * @bridge Buy
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
    sender,
    receiver,
    client,
    amount,
    purchaseData,
    maxSteps,
  } = options;

  const clientFetch = getClientFetch(client);
  const url = new URL(`${UNIVERSAL_BRIDGE_URL}/buy/prepare`);

  const response = await clientFetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: stringify({
      buyAmountWei: amount.toString(),
      originChainId: originChainId.toString(),
      originTokenAddress,
      destinationChainId: destinationChainId.toString(),
      destinationTokenAddress,
      sender,
      receiver,
      purchaseData,
      maxSteps,
    }),
  });
  if (!response.ok) {
    const errorJson = await response.json();
    throw new Error(
      `${errorJson.code} | ${errorJson.message} - ${errorJson.correlationId}`,
    );
  }

  const { data }: { data: PreparedQuote } = await response.json();
  return {
    originAmount: BigInt(data.originAmount),
    destinationAmount: BigInt(data.destinationAmount),
    blockNumber: data.blockNumber ? BigInt(data.blockNumber) : undefined,
    timestamp: data.timestamp,
    estimatedExecutionTimeMs: data.estimatedExecutionTimeMs,
    steps: data.steps.map((step) => ({
      ...step,
      transactions: step.transactions.map((transaction) => ({
        ...transaction,
        value: transaction.value ? BigInt(transaction.value) : undefined,
        client,
        chain: defineChain(transaction.chainId),
      })),
    })),
    intent: {
      originChainId,
      originTokenAddress,
      destinationChainId,
      destinationTokenAddress,
      amount,
    },
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
    purchaseData?: unknown;
    maxSteps?: number;
  };

  type Result = PreparedQuote & {
    intent: {
      originChainId: number;
      originTokenAddress: ox__Address.Address;
      destinationChainId: number;
      destinationTokenAddress: ox__Address.Address;
      amount: bigint;
      purchaseData?: unknown;
    };
  };
}
