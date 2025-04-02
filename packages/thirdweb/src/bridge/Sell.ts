import type { Address as ox__Address } from "ox";
import { defineChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { getClientFetch } from "../utils/fetch.js";
import { UNIVERSAL_BRIDGE_URL } from "./constants.js";
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
 *   sellAmountWei: toWei("0.01"),
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
 *   intent: {
 *     originChainId: 1,
 *     originTokenAddress: NATIVE_TOKEN_ADDRESS,
 *     destinationChainId: 10,
 *     destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
 *     sellAmountWei: 1000000000000000000n
 *   }
 * }
 * ```
 *
 * The quote is an **estimate** for how much you would expect to receive for a specific sell. This quote is not guaranteed and you should use `Sell.prepare` to get a finalized quote with transaction data ready for execution.
 * So why use `quote`? The quote function is sometimes slightly faster than `prepare`, and can be used before the user connects their wallet.
 *
 * You can access this functions input and output types with `Sell.quote.Options` and `Sell.quote.Result`, respectively.
 *
 * @param options - The options for the quote.
 * @param options.originChainId - The chain ID of the origin token.
 * @param options.originTokenAddress - The address of the origin token.
 * @param options.destinationChainId - The chain ID of the destination token.
 * @param options.destinationTokenAddress - The address of the destination token.
 * @param options.sellAmountWei - The amount of the origin token to sell.
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
    sellAmountWei,
    client,
  } = options;

  const clientFetch = getClientFetch(client);
  const url = new URL(`${UNIVERSAL_BRIDGE_URL}/sell/quote`);
  url.searchParams.set("originChainId", originChainId.toString());
  url.searchParams.set("originTokenAddress", originTokenAddress);
  url.searchParams.set("destinationChainId", destinationChainId.toString());
  url.searchParams.set("destinationTokenAddress", destinationTokenAddress);
  url.searchParams.set("sellAmountWei", sellAmountWei.toString());

  const response = await clientFetch(url.toString());
  if (!response.ok) {
    const errorJson = await response.json();
    throw new Error(`${errorJson.code} | ${errorJson.message}`);
  }

  const { data }: { data: Quote } = await response.json();
  return {
    originAmount: BigInt(data.originAmount),
    destinationAmount: BigInt(data.destinationAmount),
    blockNumber: data.blockNumber ? BigInt(data.blockNumber) : undefined,
    timestamp: data.timestamp,
    estimatedExecutionTimeMs: data.estimatedExecutionTimeMs,
    intent: {
      originChainId,
      originTokenAddress,
      destinationChainId,
      destinationTokenAddress,
      sellAmountWei,
    },
  };
}

export declare namespace quote {
  type Options = {
    originChainId: number;
    originTokenAddress: ox__Address.Address;
    destinationChainId: number;
    destinationTokenAddress: ox__Address.Address;
    sellAmountWei: bigint;
    client: ThirdwebClient;
  };

  type Result = Quote & {
    intent: {
      originChainId: number;
      originTokenAddress: ox__Address.Address;
      destinationChainId: number;
      destinationTokenAddress: ox__Address.Address;
      sellAmountWei: bigint;
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
 *   sellAmountWei: toWei("0.01"),
 *   client: thirdwebClient,
 * });
 * ```
 *
 * This will return a quote that might look like:
 * ```typescript
 * {
 *   originAmount: 1000000000000000000n,
 *   destinationAmount:  9980000000000000000n,
 *   blockNumber: 22026509n,
 *   timestamp: 1741730936680,
 *   estimatedExecutionTimeMs: 1000
 *   transactions: [
 *     {
 *       id: "0x...",
 *       action: "approval",
 *       to: "0x...",
 *       data: "0x...",
 *       chainId: 10,
 *       type: "eip1559"
 *     },
 *     {
 *       id: "0x...",
 *       action: "sell",
 *       to: "0x...",
 *       value: 9980000000000000000n,
 *       data: "0x...",
 *       chainId: 10,
 *       type: "eip1559"
 *     }
 *   ],
 *   expiration: 1741730936680,
 *   intent: {
 *     originChainId: 1,
 *     originTokenAddress: NATIVE_TOKEN_ADDRESS,
 *     destinationChainId: 10,
 *     destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
 *     sellAmountWei: 1000000000000000000n
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
 * You can access this functions input and output types with `Sell.prepare.Options` and `Sell.prepare.Result`, respectively.
 *
 * @param options - The options for the quote.
 * @param options.originChainId - The chain ID of the origin token.
 * @param options.originTokenAddress - The address of the origin token.
 * @param options.destinationChainId - The chain ID of the destination token.
 * @param options.destinationTokenAddress - The address of the destination token.
 * @param options.sellAmountWei - The amount of the origin token to sell.
 * @param options.sender - The address of the sender.
 * @param options.receiver - The address of the recipient.
 * @param options.client - Your thirdweb client.
 *
 * @returns A promise that resolves to a non-finalized quote for the requested buy.
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
    sellAmountWei,
    sender,
    receiver,
    client,
  } = options;

  const clientFetch = getClientFetch(client);
  const url = new URL(`${UNIVERSAL_BRIDGE_URL}/sell/prepare`);
  url.searchParams.set("originChainId", originChainId.toString());
  url.searchParams.set("originTokenAddress", originTokenAddress);
  url.searchParams.set("destinationChainId", destinationChainId.toString());
  url.searchParams.set("destinationTokenAddress", destinationTokenAddress);
  url.searchParams.set("sellAmountWei", sellAmountWei.toString());
  url.searchParams.set("sender", sender);
  url.searchParams.set("receiver", receiver);

  const response = await clientFetch(url.toString());
  if (!response.ok) {
    const errorJson = await response.json();
    throw new Error(`${errorJson.code} | ${errorJson.message}`);
  }

  const { data }: { data: PreparedQuote } = await response.json();
  return {
    originAmount: BigInt(data.originAmount),
    destinationAmount: BigInt(data.destinationAmount),
    blockNumber: data.blockNumber ? BigInt(data.blockNumber) : undefined,
    timestamp: data.timestamp,
    estimatedExecutionTimeMs: data.estimatedExecutionTimeMs,
    transactions: data.transactions.map((transaction) => ({
      ...transaction,
      value: transaction.value ? BigInt(transaction.value) : undefined,
      client,
      chain: defineChain(transaction.chainId),
    })),
    expiration: data.expiration,
    intent: {
      originChainId,
      originTokenAddress,
      destinationChainId,
      destinationTokenAddress,
      sellAmountWei,
    },
  };
}

export declare namespace prepare {
  type Options = {
    originChainId: number;
    originTokenAddress: ox__Address.Address;
    destinationChainId: number;
    destinationTokenAddress: ox__Address.Address;
    sellAmountWei: bigint;
    sender: ox__Address.Address;
    receiver: ox__Address.Address;
    client: ThirdwebClient;
  };

  type Result = PreparedQuote & {
    intent: {
      originChainId: number;
      originTokenAddress: ox__Address.Address;
      destinationChainId: number;
      destinationTokenAddress: ox__Address.Address;
      sellAmountWei: bigint;
    };
  };
}
