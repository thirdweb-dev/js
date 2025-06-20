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

/**
 * Check if a user can claim a drop.
 * This method is only available on the `DropERC1155` contract.
 * @param options - The options for the transaction.
 * @returns Whether the user can claim the drop.
 *
 * @example
 * ```ts
 * const claimResult = await canClaim({
 *   contract: contract,
 *   claimer: "0x1234567890123456789012345678901234567890",
 *   quantity: "1",
 *   tokenId: 0n,
 * });
 * ```
 *
 * @extension ERC1155
 */
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
        from: options.from,
        quantity: options.quantity,
        to: options.claimer,
        tokenId: options.tokenId,
        type: "erc1155",
      }),
    ]);
  try {
    await verifyClaim({
      allowlistProof,
      claimer: options.claimer,
      conditionId,
      contract: options.contract,
      currency,
      pricePerToken,
      quantity,
      tokenId: options.tokenId,
    });
    return {
      result: true,
    };
  } catch (error) {
    return {
      reason: await extractErrorResult({ contract: options.contract, error }),
      result: false,
    };
  }
}
