import type { AccessList, Hex } from "viem";
import type { Abi, AbiFunction, Address } from "abitype";
import type { ThirdwebClient } from "../client/client.js";
import type { PromisedValue } from "../utils/promise/resolve-promised-value.js";
import type { ThirdwebContract } from "../contract/contract.js";
import type { Chain } from "../chains/types.js";

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

type Additional<
  abi extends Abi = [],
  abiFn extends AbiFunction = AbiFunction,
> = {
  abi: () => Promise<abiFn>;
  contract: ThirdwebContract<abi>;
};

export type PreparedTransaction<
  abi extends Abi = [],
  abiFn extends AbiFunction = AbiFunction,
> = Readonly<PrepareTransactionOptions> & {
  __abi?: () => Promise<abiFn>;
  __contract?: ThirdwebContract<abi>;
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
 * import { ethereum } from "thirdweb/chains";
 * const transaction = prepareTransaction({
 *  to: "0x1234567890123456789012345678901234567890",
 *  chain: ethereum,
 *  client: thirdwebClient,
 *  value: parseEther("1.0"),
 * });
 * ```
 */
export function prepareTransaction<
  const abi extends Abi = [],
  const abiFn extends AbiFunction = AbiFunction,
>(options: PrepareTransactionOptions, info?: Additional<abi, abiFn>) {
  return {
    ...options,
    __abi: info?.abi,
    __contract: info?.contract,
  } as PreparedTransaction<abi, abiFn>;
}
