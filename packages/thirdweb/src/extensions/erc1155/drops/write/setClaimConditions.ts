import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { ClaimConditionsInput } from "../../../../utils/drops/types.js";
import { getMulticallSetClaimConditionTransactions } from "../../../../utils/drops/utils.js";
import { multicall } from "../../../common/__generated__/IMulticall/write/multicall.js";

export type SetClaimConditionsParams = {
  tokenId: bigint;
  phases: ClaimConditionsInput[];
  resetClaimEligibility?: boolean;
};

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
          tokenId: options.tokenId,
        }),
      };
    },
  });
}
