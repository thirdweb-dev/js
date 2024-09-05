import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { ClaimCondition } from "../../../../utils/extensions/drops/types.js";
import * as SinglePhase from "../../__generated__/DropSinglePhase/read/claimCondition.js";
import * as GetActiveId from "../../__generated__/IDrop/read/getActiveClaimConditionId.js";
import * as ById from "../../__generated__/IDrop/read/getClaimConditionById.js";

/**
 * Retrieves the active claim condition.
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
  const getActiveClaimConditionMultiPhase = async () => {
    const conditionId = await GetActiveId.getActiveClaimConditionId(options);
    return ById.getClaimConditionById({ ...options, conditionId });
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
    ] = await SinglePhase.claimCondition(options);
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

/**
 * Checks if the `getActiveClaimCondition` method is supported by the given contract.
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
  // if single phase is supported, return true
  if (SinglePhase.isClaimConditionSupported(availableSelectors)) {
    return true;
  }
  // otherwise check that both multi phase functions are supported
  return (
    GetActiveId.isGetActiveClaimConditionIdSupported(availableSelectors) &&
    ById.isGetClaimConditionByIdSupported(availableSelectors)
  );
}
