import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";

import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xbb9fe6bf" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `unlockStake` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `unlockStake` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isUnlockStakeSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isUnlockStakeSupported(contract);
 * ```
 */
export async function isUnlockStakeSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Prepares a transaction to call the "unlockStake" function on the contract.
 * @param options - The options for the "unlockStake" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { unlockStake } from "thirdweb/extensions/erc4337";
 *
 * const transaction = unlockStake();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function unlockStake(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}
