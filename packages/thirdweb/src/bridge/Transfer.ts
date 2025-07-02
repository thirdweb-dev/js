import type { Address as ox__Address } from "ox";
import { defineChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import type { PurchaseData } from "../pay/types.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";
import { stringify } from "../utils/json.js";
import { ApiError } from "./types/Errors.js";
import type { PreparedQuote } from "./types/Quote.js";

/**
 * Prepares a **finalized** Universal Bridge quote for the provided transfer request with transaction data.
 *
 * @example
 * ```typescript
 * import { Bridge, NATIVE_TOKEN_ADDRESS } from "thirdweb";
 *
 * const quote = await Bridge.Transfer.prepare({
 *   chainId: 1,
 *   tokenAddress: NATIVE_TOKEN_ADDRESS,
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
 *   originAmount: 10000026098875381n,
 *   destinationAmount: 10000000000000000n,
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
 *         chainId: 1,
 *         address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *         symbol: "ETH",
 *         name: "Ethereum",
 *         decimals: 18,
 *         priceUsd: 2000,
 *         iconUri: "https://..."
 *       },
 *       originAmount: 10000026098875381n,
 *       destinationAmount: 10000000000000000n,
 *       estimatedExecutionTimeMs: 1000
 *       transactions: [
 *         {
 *           action: "approval",
 *           id: "0x",
 *           to: "0x...",
 *           data: "0x...",
 *           chainId: 1,
 *           type: "eip1559"
 *         },
 *         {
 *           action: "transfer",
 *           to: "0x...",
 *           value: 10000026098875381n,
 *           data: "0x...",
 *           chainId: 1,
 *           type: "eip1559"
 *         }
 *       ]
 *     }
 *   ],
 *   expiration: 1741730936680,
 *   intent: {
 *     chainId: 1,
 *     tokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *     amount: 10000000000000000n,
 *     sender: "0x...",
 *     receiver: "0x..."
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
 * NOTE: To get the status of each non-approval transaction, use `Bridge.status` rather than checking for transaction inclusion. This function will ensure full completion of the transfer.
 *
 * You can access this functions input and output types with `Transfer.prepare.Options` and `Transfer.prepare.Result`, respectively.
 *
 * You can include arbitrary data to be included on any webhooks and status responses with the `purchaseData` option.
 *
 * ```ts
 * const quote = await Bridge.Transfer.prepare({
 *   chainId: 1,
 *   tokenAddress: NATIVE_TOKEN_ADDRESS,
 *   amount: toWei("0.01"),
 *   sender: "0x...",
 *   receiver: "0x...",
 *   purchaseData: {
 *     reference: "payment-123",
 *     metadata: {
 *       note: "Transfer to Alice"
 *     }
 *   },
 *   client: thirdwebClient,
 * });
 * ```
 *
 * ## Fees
 * There may be fees associated with the transfer. These fees are paid by the `feePayer` address, which defaults to the `sender` address. You can specify a different address with the `feePayer` option. If you do not specify an option or explicitly specify `sender`, the fees will be added to the input amount. If you specify the `receiver` as the fee payer the fees will be subtracted from the destination amount.
 *
 * For example, if you were to request a transfer with `feePayer` set to `receiver`:
 * ```typescript
 * const quote = await Bridge.Transfer.prepare({
 *   chainId: 1,
 *   tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
 *   amount: 100_000_000n, // 100 USDC
 *   sender: "0x...",
 *   receiver: "0x...",
 *   feePayer: "receiver",
 *   client: thirdwebClient,
 * });
 * ```
 *
 * The returned quote might look like:
 * ```typescript
 * {
 *   originAmount: 100_000_000n, // 100 USDC
 *   destinationAmount: 99_970_000n, // 99.97 USDC
 *   ...
 * }
 * ```
 *
 * If you were to request a transfer with `feePayer` set to `sender`:
 * ```typescript
 * const quote = await Bridge.Transfer.prepare({
 *   chainId: 1,
 *   tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
 *   amount: 100_000_000n, // 100 USDC
 *   sender: "0x...",
 *   receiver: "0x...",
 *   feePayer: "sender",
 *   client: thirdwebClient,
 * });
 * ```
 *
 * The returned quote might look like:
 * ```typescript
 * {
 *   originAmount: 100_030_000n, // 100.03 USDC
 *   destinationAmount: 100_000_000n, // 100 USDC
 *   ...
 * }
 * ```
 *
 * @param options - The options for the quote.
 * @param options.chainId - The chain ID of the token.
 * @param options.tokenAddress - The address of the token.
 * @param options.amount - The amount of the token to transfer.
 * @param options.sender - The address of the sender.
 * @param options.receiver - The address of the recipient.
 * @param options.purchaseData - Arbitrary data to be passed to the transfer function and included with any webhooks or status calls.
 * @param options.client - Your thirdweb client.
 * @param [options.feePayer] - The address that will pay the fees for the transfer. If not specified, the sender will be used. Values can be "sender" or "receiver".
 *
 * @returns A promise that resolves to a finalized quote and transactions for the requested transfer.
 *
 * @throws Will throw an error if there is an issue fetching the quote.
 * @bridge Transfer
 * @beta
 */
export async function prepare(
  options: prepare.Options,
): Promise<prepare.Result> {
  const {
    chainId,
    tokenAddress,
    sender,
    receiver,
    client,
    amount,
    purchaseData,
    feePayer,
    paymentLinkId,
  } = options;

  const clientFetch = getClientFetch(client);
  const url = new URL(`${getThirdwebBaseUrl("bridge")}/v1/transfer/prepare`);

  const response = await clientFetch(url.toString(), {
    body: stringify({
      amount: amount.toString(), // legacy
      chainId: chainId.toString(),
      feePayer,
      paymentLinkId,
      purchaseData,
      receiver,
      sender,
      tokenAddress,
      transferAmountWei: amount.toString(),
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
      chainId,
      feePayer,
      receiver,
      sender,
      tokenAddress,
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
    chainId: number;
    tokenAddress: ox__Address.Address;
    sender: ox__Address.Address;
    receiver: ox__Address.Address;
    amount: bigint;
    client: ThirdwebClient;
    purchaseData?: PurchaseData;
    feePayer?: "sender" | "receiver";
    /**
     * @hidden
     */
    paymentLinkId?: string;
  };

  type Result = PreparedQuote & {
    intent: {
      chainId: number;
      tokenAddress: ox__Address.Address;
      amount: bigint;
      sender: ox__Address.Address;
      receiver: ox__Address.Address;
      purchaseData?: PurchaseData;
      feePayer?: "sender" | "receiver";
    };
  };
}
