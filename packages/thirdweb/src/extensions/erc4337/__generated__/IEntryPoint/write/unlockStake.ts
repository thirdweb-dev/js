import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";

import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xbb9fe6bf" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `unlockStake` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `unlockStake` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isUnlockStakeSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isUnlockStakeSupported(["0x..."]);
 * ```
 */
export function isUnlockStakeSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
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
