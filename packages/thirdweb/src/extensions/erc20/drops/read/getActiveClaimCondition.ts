import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { ClaimCondition } from "../../../../utils/extensions/drops/types.js";
import { claimCondition } from "../../__generated__/DropSinglePhase/read/claimCondition.js";
import { getActiveClaimConditionId } from "../../__generated__/IDropERC20/read/getActiveClaimConditionId.js";
import { getClaimConditionById } from "../../__generated__/IDropERC20/read/getClaimConditionById.js";

/**
 * Retrieves the active claim condition.
 * @param options - The transaction options.
 * @returns A promise that resolves to the active claim condition.
 * @throws An error if the claim condition is unsupported.
 * @extension
 * @example
 * ```ts
 * import { getActiveClaimCondition } from "thirdweb/extensions/erc20";
 * const activeClaimCondition = await getActiveClaimCondition({ contract });
 * ```
 */
export async function getActiveClaimCondition(
  options: BaseTransactionOptions,
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
    ] = await claimCondition(options);
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
