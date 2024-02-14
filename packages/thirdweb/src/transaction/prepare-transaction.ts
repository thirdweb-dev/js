import type { AccessList, Hex } from "viem";
import type { AbiFunction, Address } from "abitype";
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

type Additional<abiFn extends AbiFunction = AbiFunction> = {
  abi: () => Promise<abiFn>;
};

export type PreparedTransaction<abiFn extends AbiFunction = AbiFunction> =
  Readonly<PrepareTransactionOptions> & {
    __abi?: () => Promise<abiFn>;
  };

/**
 * Prepares a transaction with the given options.
 * @param options - The options for preparing the transaction.
 * @param info - Additional information about the ABI function.
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
export function prepareTransaction<
  const abiFn extends AbiFunction = AbiFunction,
>(options: PrepareTransactionOptions, info?: Additional<abiFn>) {
  return { ...options, __abi: info?.abi } as PreparedTransaction<abiFn>;
}
