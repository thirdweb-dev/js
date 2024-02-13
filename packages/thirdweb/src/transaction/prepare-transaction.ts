import type { AccessList, Hex } from "viem";
import type { Address } from "abitype";
import type { Chain } from "../chain/index.js";
import type { ThirdwebClient } from "../client/client.js";
import type { PromisedValue } from "../utils/promise/resolve-promised-value.js";

export type PrepareTransactionOptions = {
  accessList?: PromisedValue<AccessList | undefined>;
  to?: PromisedValue<Address | undefined>;
  data?: PromisedValue<Hex | undefined>;
  value?: PromisedValue<bigint | undefined>;
  gas?: PromisedValue<bigint | undefined>;
  gasPrice?: PromisedValue<bigint | undefined>;
  maxFeePerGas?: PromisedValue<bigint | undefined>;
  maxPriorityFeePerGas?: PromisedValue<bigint | undefined>;
  maxFeePerBlobGas?: PromisedValue<bigint | undefined>;
  nonce?: PromisedValue<number | undefined>;
  // tw specific
  chain: Chain;
  client: ThirdwebClient;
};

export type PreparedTransaction = Readonly<PrepareTransactionOptions>;

/**
 * Prepares a transaction with the given options.
 * @param options - The options for preparing the transaction.
 * @returns The prepared transaction.
 * @transaction
 * @example
 * ```ts
 * import { prepareTransaction, parseEther } from "thirdweb";
 * const transaction = prepareTransaction({
 *  to: "0x1234567890123456789012345678901234567890",
 *  chain: 1,
 *  client: thirdwebClient,
 *  value: parseEther("1.0"),
 * });
 * ```
 */
export function prepareTransaction(options: PrepareTransactionOptions) {
  return { ...options } as PreparedTransaction;
}
