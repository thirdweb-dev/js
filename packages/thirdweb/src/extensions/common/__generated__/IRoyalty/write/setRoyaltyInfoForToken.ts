import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "setRoyaltyInfoForToken" function.
 */

type SetRoyaltyInfoForTokenParamsInternal = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  recipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "recipient";
  }>;
  bps: AbiParameterToPrimitiveType<{ type: "uint256"; name: "bps" }>;
};

export type SetRoyaltyInfoForTokenParams = Prettify<
  | SetRoyaltyInfoForTokenParamsInternal
  | {
      asyncParams: () => Promise<SetRoyaltyInfoForTokenParamsInternal>;
    }
>;
/**
 * Calls the "setRoyaltyInfoForToken" function on the contract.
 * @param options - The options for the "setRoyaltyInfoForToken" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { setRoyaltyInfoForToken } from "thirdweb/extensions/common";
 *
 * const transaction = setRoyaltyInfoForToken({
 *  tokenId: ...,
 *  recipient: ...,
 *  bps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setRoyaltyInfoForToken(
  options: BaseTransactionOptions<SetRoyaltyInfoForTokenParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x9bcf7a15",
      [
        {
          type: "uint256",
          name: "tokenId",
        },
        {
          type: "address",
          name: "recipient",
        },
        {
          type: "uint256",
          name: "bps",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [
          resolvedParams.tokenId,
          resolvedParams.recipient,
          resolvedParams.bps,
        ] as const;
      }

      return [options.tokenId, options.recipient, options.bps] as const;
    },
  });
}
