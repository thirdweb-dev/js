import type { Hex } from "viem";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { ClaimCondition } from "../../../../utils/extensions/drops/types.js";
import {
  isSetClaimConditionsSupported,
  setClaimConditions,
} from "../../__generated__/IDrop1155/write/setClaimConditions.js";
import {
  type GetClaimConditionsParams,
  getClaimConditions,
  isGetClaimConditionsSupported,
} from "../read/getClaimConditions.js";

export type ResetClaimEligibilityParams = GetClaimConditionsParams;

/**
 * Reset the claim eligibility for all users.
 * @param options
 * @returns the prepared transaction
 * @extension ERC1155
 * @example
 * ```ts
 * import { resetClaimEligibility } from "thirdweb/extensions/erc1155";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = resetClaimEligibility({
 *  contract,
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function resetClaimEligibility(
  options: BaseTransactionOptions<ResetClaimEligibilityParams>,
) {
  // download existing conditions
  return setClaimConditions({
    contract: options.contract,
    asyncParams: async () => {
      // get existing conditions
      const existingConditions = await getClaimConditions(options);

      // then simply return the exact same ones, but with the resetClaimEligibility flag set to true
      return {
        tokenId: options.tokenId,
        // type is necessary because of viem hex shenanigans (strict vs non-strict `0x` prefix string)
        phases: existingConditions as Array<
          ClaimCondition & {
            currency: Hex;
            merkleRoot: Hex;
          }
        >,
        resetClaimEligibility: true,
      };
    },
  });
}

/**
 * Checks if the `resetClaimEligibility` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `resetClaimEligibility` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isResetClaimEligibilitySupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = isResetClaimEligibilitySupported(["0x..."]);
 * ```
 */
export function isResetClaimEligibilitySupported(availableSelectors: string[]) {
  return (
    isGetClaimConditionsSupported(availableSelectors) &&
    isSetClaimConditionsSupported(availableSelectors)
  );
}
