import { extractErrorResult } from "../../../../transaction/extract-error.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getClaimParams } from "../../../../utils/extensions/drops/get-claim-params.js";
import { verifyClaim } from "../../__generated__/DropERC1155/read/verifyClaim.js";
import { getActiveClaimConditionId } from "../../__generated__/IDrop1155/read/getActiveClaimConditionId.js";

export type CanClaimParams = {
  claimer: string;
  quantity: bigint;
  tokenId: bigint;
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
        tokenId: options.tokenId,
      }),
      getClaimParams({
        contract: options.contract,
        quantity: options.quantity,
        to: options.claimer,
        type: "erc1155",
        tokenId: options.tokenId,
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
      tokenId: options.tokenId,
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
