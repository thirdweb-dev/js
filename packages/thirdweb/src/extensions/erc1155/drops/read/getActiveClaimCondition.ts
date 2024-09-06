import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { ClaimCondition } from "../../../../utils/extensions/drops/types.js";
import {
  type GetActiveClaimConditionIdParams,
  getActiveClaimConditionId,
  isGetActiveClaimConditionIdSupported,
} from "../../__generated__/IDrop1155/read/getActiveClaimConditionId.js";
import {
  getClaimConditionById,
  isGetClaimConditionByIdSupported,
} from "../../__generated__/IDrop1155/read/getClaimConditionById.js";

export type GetActiveClaimConditionParams = GetActiveClaimConditionIdParams;
/**
 * Retrieves the active claim condition.
 * @param options - The transaction options.
 * @returns A promise that resolves to the active claim condition.
 * @throws An error if the claim condition is unsupported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getActiveClaimCondition } from "thirdweb/extensions/erc1155";
 * const activeClaimCondition = await getActiveClaimCondition({ contract, tokenId });
 * ```
 */
export async function getActiveClaimCondition(
  options: BaseTransactionOptions<GetActiveClaimConditionParams>,
): Promise<ClaimCondition> {
  try {
    const conditionId = await getActiveClaimConditionId(options);
    return getClaimConditionById({ ...options, conditionId });
  } catch {
    throw new Error("Claim condition not found");
  }
}

/**
 * Checks if the `getActiveClaimCondition` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getActiveClaimCondition` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isGetActiveClaimConditionSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = isGetActiveClaimConditionSupported(["0x..."]);
 * ```
 */
export function isGetActiveClaimConditionSupported(
  availableSelectors: string[],
) {
  // if multi phase is supported, return true
  return (
    isGetActiveClaimConditionIdSupported(availableSelectors) &&
    isGetClaimConditionByIdSupported(availableSelectors)
  );
}
