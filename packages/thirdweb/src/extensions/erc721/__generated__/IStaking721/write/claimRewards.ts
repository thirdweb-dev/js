import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";

import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x372500ab" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `claimRewards` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `claimRewards` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isClaimRewardsSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = await isClaimRewardsSupported(contract);
 * ```
 */
export async function isClaimRewardsSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
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
 * import { claimRewards } from "thirdweb/extensions/erc721";
 *
 * const transaction = claimRewards();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claimRewards(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}
