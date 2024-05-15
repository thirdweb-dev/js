import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { ClaimCondition } from "../../../../utils/extensions/drops/types.js";
import { claimCondition } from "../../__generated__/DropSinglePhase1155/read/claimCondition.js";
import {
  type GetActiveClaimConditionIdParams,
  getActiveClaimConditionId,
} from "../../__generated__/IDrop1155/read/getActiveClaimConditionId.js";
import { getClaimConditionById } from "../../__generated__/IDrop1155/read/getClaimConditionById.js";

export type GetActiveClaimConditionParams = GetActiveClaimConditionIdParams;
/**
 * Retrieves the active claim condition.
 * @param options - The transaction options.
 * @returns A promise that resolves to the active claim condition.
 * @throws An error if the claim condition is unsupported.
 * @extension
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
      startTimestamp,
      maxClaimableSupply,
      supplyClaimed,
      quantityLimitPerWallet,
      merkleRoot,
      pricePerToken,
      currency,
      metadata,
    };
  };

  // The contract's phase type is unknown, so try both options and return whichever resolves, prioritizing multi-phase
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
