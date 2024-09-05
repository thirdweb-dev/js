import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { ClaimCondition } from "../../../../utils/extensions/drops/types.js";
import * as SinglePhase from "../../__generated__/DropSinglePhase/read/claimCondition.js";
import * as MultiPhase from "../../__generated__/IDropERC20/read/claimCondition.js";
import * as MultiById from "../../__generated__/IDropERC20/read/getClaimConditionById.js";

/**
 * Retrieves all claim conditions.
 * @param options - The transaction options.
 * @returns A promise that resolves to all claim conditions.
 * @throws An error if the claim conditions are unsupported by the contract.
 * @extension ERC20
 * @example
 * ```ts
 * import { getClaimConditions } from "thirdweb/extensions/erc20";
 * const conditions = await getClaimConditions({ contract });
 * ```
 */
export async function getClaimConditions(
  options: BaseTransactionOptions,
): Promise<ClaimCondition[]> {
  const [multi, single] = await Promise.allSettled([
    (async () => {
      const [startId, count] = await MultiPhase.claimCondition(options);

      const conditionPromises: Array<
        ReturnType<typeof MultiById.getClaimConditionById>
      > = [];
      for (let i = startId; i < count; i++) {
        conditionPromises.push(
          MultiById.getClaimConditionById({
            ...options,
            conditionId: i,
          }),
        );
      }
      return Promise.all(conditionPromises);
    })(),
    SinglePhase.claimCondition(options).then(
      ([
        startTimestamp,
        maxClaimableSupply,
        supplyClaimed,
        quantityLimitPerWallet,
        merkleRoot,
        pricePerToken,
        currency,
        metadata,
      ]) => ({
        startTimestamp,
        maxClaimableSupply,
        supplyClaimed,
        quantityLimitPerWallet,
        merkleRoot,
        pricePerToken,
        currency,
        metadata,
      }),
    ),
  ]);
  if (multi.status === "fulfilled") {
    return multi.value;
  }
  if (single.status === "fulfilled") {
    return [single.value];
  }

  throw new Error("Claim condition not found");
}

/**
 * Checks if the `getClaimConditions` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getClaimConditions` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isGetClaimConditionsSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isGetClaimConditionsSupported(["0x..."]);
 * ```
 */
export function isGetClaimConditionsSupported(availableSelectors: string[]) {
  // if single phase is supported, return true
  if (SinglePhase.isClaimConditionSupported(availableSelectors)) {
    return true;
  }
  // if multi phase is supported, return true
  return (
    MultiPhase.isClaimConditionSupported(availableSelectors) &&
    MultiById.isGetClaimConditionByIdSupported(availableSelectors)
  );
}
