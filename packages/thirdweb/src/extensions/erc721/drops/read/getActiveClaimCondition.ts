import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { ClaimCondition } from "../../../../utils/extensions/drops/types.js";
import * as GetActiveId from "../../__generated__/IDrop/read/getActiveClaimConditionId.js";
import * as ById from "../../__generated__/IDrop/read/getClaimConditionById.js";

/**
 * Retrieves the active claim condition.
 * This method is only available on the `DropERC721` contract.
 *
 * @param options - The transaction options.
 * @returns A promise that resolves to the active claim condition.
 * @throws An error if the claim condition is unsupported.
 * @extension ERC721
 * @example
 * ```ts
 * import { getActiveClaimCondition } from "thirdweb/extensions/erc721";
 * const activeClaimCondition = await getActiveClaimCondition({ contract });
 * ```
 */
export async function getActiveClaimCondition(
  options: BaseTransactionOptions,
): Promise<ClaimCondition> {
  try {
    const conditionId = await GetActiveId.getActiveClaimConditionId(options);
    return ById.getClaimConditionById({ ...options, conditionId });
  } catch {
    throw new Error("Claim condition not found");
  }
}

/**
 * Checks if the `getActiveClaimCondition` method is supported by the given contract.
 * This method is only available on the `DropERC721` contract.
 *
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getActiveClaimCondition` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isGetActiveClaimConditionSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isGetActiveClaimConditionSupported(["0x..."]);
 * ```
 */
export function isGetActiveClaimConditionSupported(
  availableSelectors: string[],
) {
  // check that both multi phase functions are supported
  return (
    GetActiveId.isGetActiveClaimConditionIdSupported(availableSelectors) &&
    ById.isGetClaimConditionByIdSupported(availableSelectors)
  );
}
