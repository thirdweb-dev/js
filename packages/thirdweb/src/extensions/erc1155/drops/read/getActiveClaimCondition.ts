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
import {
  claimCondition,
  isClaimConditionSupported,
} from "../../__generated__/IDropSinglePhase1155/read/claimCondition.js";

export type GetActiveClaimConditionParams = GetActiveClaimConditionIdParams;
/**
 * Retrieves the active claim condition.
 * This method is only available on the `DropERC1155` contract.
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
  const getActiveClaimConditionMultiPhase = async () => {
    const conditionId = await getActiveClaimConditionId(options);
    return getClaimConditionById({ ...options, conditionId });
  };

  const getActiveClaimConditionSinglePhase = async () => {
    const [
      startTimestamp,
      maxClaimableSupply,
      supplyClaimed,
      quantityLimitPerWallet,
      merkleRoot,
      pricePerToken,
      currency,
      metadata,
    ] = await claimCondition({ ...options, tokenId: options.tokenId });
    return {
      currency,
      maxClaimableSupply,
      merkleRoot,
      metadata,
      pricePerToken,
      quantityLimitPerWallet,
      startTimestamp,
      supplyClaimed,
    };
  };
  const results = await Promise.allSettled([
    getActiveClaimConditionMultiPhase(),
    getActiveClaimConditionSinglePhase(),
  ]);

  const condition = results.find((result) => result.status === "fulfilled");
  if (condition?.status === "fulfilled") {
    return condition.value;
  }
  throw new Error("Claim condition not found");
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
  return (
    // check multi-phase
    (isGetActiveClaimConditionIdSupported(availableSelectors) &&
      isGetClaimConditionByIdSupported(availableSelectors)) ||
    isClaimConditionSupported(availableSelectors) // check single phase
  );
}
