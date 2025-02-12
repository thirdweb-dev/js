import { extractErrorResult } from "../../../../transaction/extract-error.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getClaimParams } from "../../../../utils/extensions/drops/get-claim-params.js";
import { verifyClaim } from "../../__generated__/DropERC721/read/verifyClaim.js";
import { getActiveClaimConditionId } from "../../__generated__/IDrop/read/getActiveClaimConditionId.js";

export type CanClaimParams = {
  claimer: string;
  quantity: bigint;
  from?: string;
};

export type CanClaimResult = {
  result: boolean;
  reason?: string;
};

export async function canClaim(
  options: BaseTransactionOptions<CanClaimParams>,
): Promise<CanClaimResult> {
  const [conditionId, { quantity, currency, pricePerToken, allowlistProof }] =
    await Promise.all([
      getActiveClaimConditionId({
        contract: options.contract,
      }),
      getClaimParams({
        contract: options.contract,
        quantity: options.quantity,
        to: options.claimer,
        type: "erc721",
        from: options.from,
      }),
    ]);
  try {
    await verifyClaim({
      contract: options.contract,
      claimer: options.claimer,
      quantity,
      currency,
      pricePerToken,
      allowlistProof,
      conditionId,
    });
    return {
      result: true,
    };
  } catch (error) {
    return {
      result: false,
      reason: await extractErrorResult({ error, contract: options.contract }),
    };
  }
}
