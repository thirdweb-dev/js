import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

/**
 * Represents the parameters for the `deposit` function
 */
export type DepositParams = {
  assets: bigint;
  receiver: string;
};

/**
 * Mints the corresponding number of Vault shares for the assets provided.
 * @param options - The transaction options including the receiver and the number of assets to deposit.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```ts
 * import { deposit } from "thirdweb/extensions/erc4626";
 * const tx = await deposit({
 *  contract,
 *  receiver: "0x...",
 *  amount: 100n,
 * });
 * ```
 */
export function deposit(options: BaseTransactionOptions<DepositParams>) {
  return prepareContractCall({
    ...options,
    method: $run$(() => prepareMethod("function deposit(uint256, address)")),
    params: [options.assets, options.receiver],
  });
}
