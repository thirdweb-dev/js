import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { ClaimCondition } from "../../../../utils/extensions/drops/types.js";
import * as MultiActiveId from "../../__generated__/IDropERC20/read/getActiveClaimConditionId.js";
import * as MultiById from "../../__generated__/IDropERC20/read/getClaimConditionById.js";

/**
 * Retrieves the active claim condition.
 * This method is only available on the `DropERC20` contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the active claim condition.
 * @throws An error if the claim condition is unsupported.
 * @extension ERC20
 * @example
 * ```ts
 * import { getActiveClaimCondition } from "thirdweb/extensions/erc20";
 * const activeClaimCondition = await getActiveClaimCondition({ contract });
 * ```
 */
export async function getActiveClaimCondition(
  options: BaseTransactionOptions,
): Promise<ClaimCondition> {
  try {
    const conditionId = await MultiActiveId.getActiveClaimConditionId(options);
    return MultiById.getClaimConditionById({ ...options, conditionId });
  } catch {
    throw new Error("Claim condition not found");
  }
}

/**
 * Checks if the `getActiveClaimCondition` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getActiveClaimCondition` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isGetActiveClaimConditionSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = isGetActiveClaimConditionSupported(["0x..."]);
 * ```
 */
export function isGetActiveClaimConditionSupported(
  availableSelectors: string[],
) {
  return (
    MultiActiveId.isGetActiveClaimConditionIdSupported(availableSelectors) &&
    MultiById.isGetClaimConditionByIdSupported(availableSelectors)
  );
}
