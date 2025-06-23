import { extractErrorResult } from "../../../../transaction/extract-error.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getClaimParams } from "../../../../utils/extensions/drops/get-claim-params.js";
import { verifyClaim } from "../../__generated__/DropERC20/read/verifyClaim.js";
import { getActiveClaimConditionId } from "../../__generated__/IDropERC20/read/getActiveClaimConditionId.js";
import { decimals } from "../../read/decimals.js";

export type CanClaimParams = {
  claimer: string;
  from?: string;
} & ({ quantityInWei: bigint } | { quantity: string });

export type CanClaimResult = {
  result: boolean;
  reason?: string;
};

/**
 * Check if a user can claim a drop.
 * This method is only available on the `DropERC20` contract.
 * @param options - The options for the transaction.
 * @returns Whether the user can claim the drop.
 *
 * @example
 * ```ts
 * const claimResult = await canClaim({
 *   contract: contract,
 *   claimer: "0x1234567890123456789012345678901234567890",
 *   quantity: "1",
 * });
 * ```
 *
 * @extension ERC20
 */
export async function canClaim(
  options: BaseTransactionOptions<CanClaimParams>,
): Promise<CanClaimResult> {
  const quantityWei = await (async () => {
    if ("quantityInWei" in options) {
      return options.quantityInWei;
    }

    const { toUnits } = await import("../../../../utils/units.js");
    return toUnits(
      options.quantity,
      await decimals({ contract: options.contract }),
    );
  })();
  const [conditionId, { quantity, currency, pricePerToken, allowlistProof }] =
    await Promise.all([
      getActiveClaimConditionId({
        contract: options.contract,
      }),
      getClaimParams({
        contract: options.contract,
        from: options.from,
        quantity: quantityWei,
        to: options.claimer,
        tokenDecimals: await decimals({ contract: options.contract }),
        type: "erc20",
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
