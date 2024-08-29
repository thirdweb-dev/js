import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { ClaimCondition } from "../../../../utils/extensions/drops/types.js";
import * as Single from "../../__generated__/DropSinglePhase/read/claimCondition.js";
import * as MultiActiveId from "../../__generated__/IDropERC20/read/getActiveClaimConditionId.js";
import * as MultiById from "../../__generated__/IDropERC20/read/getClaimConditionById.js";

/**
 * Retrieves the active claim condition.
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
  const getActiveClaimConditionMultiPhase = async () => {
    const conditionId = await MultiActiveId.getActiveClaimConditionId(options);
    return MultiById.getClaimConditionById({ ...options, conditionId });
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
    ] = await Single.claimCondition(options);
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

export function isGetActiveClaimConditionSupported(
  availableSelectors: string[],
) {
  // either needs to have the single-phase claim condition or the multi-phase claim condition
  return [
    // either the single-phase claim condition is supported
    Single.isClaimConditionSupported(availableSelectors),
    // or the multi-phase claim condition is supported (both methods are required)
    [
      MultiActiveId.isGetActiveClaimConditionIdSupported(availableSelectors),
      MultiById.isGetClaimConditionByIdSupported(availableSelectors),
    ].every(Boolean),
  ].some(Boolean);
}
