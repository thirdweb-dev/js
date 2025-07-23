import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x372500ab" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `claimRewards` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `claimRewards` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isClaimRewardsSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isClaimRewardsSupported(["0x..."]);
 * ```
 */
export function isClaimRewardsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Prepares a transaction to call the "claimRewards" function on the contract.
 * @param options - The options for the "claimRewards" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { claimRewards } from "thirdweb/extensions/erc721";
 *
 * const transaction = claimRewards();
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function claimRewards(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}
