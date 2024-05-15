import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getMulticallSetClaimConditionTransactions } from "../../../../utils/extensions/drops/get-multicall-set-claim-claim-conditon-transactions.js";
import type { ClaimConditionsInput } from "../../../../utils/extensions/drops/types.js";
import { multicall } from "../../../common/__generated__/IMulticall/write/multicall.js";

export type SetClaimConditionsParams = {
  phases: ClaimConditionsInput[];
  resetClaimEligibility?: boolean;
};

/**
 * Set the claim conditions for a ERC721 drop
 * @param options
 * @returns the prepared transaction
 * @extension ERC721
 * @example
 * ```ts
 * import { setClaimConditions } from "thirdweb/extensions/erc721";
 *
 * const tx = setClaimConditions({
 *  contract,
 *  phases: [
 *    {
 *      maxClaimableSupply: 100n,
 *      maxClaimablePerWallet: 1n,
 *      currencyAddress: "0x...",
 *      price: 0.1,
 *      startTime: new Date(),
 *    },
 *   ],
 * });
 * ```
 */
export function setClaimConditions(
  options: BaseTransactionOptions<SetClaimConditionsParams>,
) {
  return multicall({
    contract: options.contract,
    asyncParams: async () => {
      return {
        data: await getMulticallSetClaimConditionTransactions({
          contract: options.contract,
          phases: options.phases,
          resetClaimEligibility: options.resetClaimEligibility,
          tokenDecimals: 0,
        }),
      };
    },
  });
}
