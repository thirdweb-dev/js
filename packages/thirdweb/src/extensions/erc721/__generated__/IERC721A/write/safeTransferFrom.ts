import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "safeTransferFrom" function.
 */

type SafeTransferFromParamsInternal = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export type SafeTransferFromParams = Prettify<
  | SafeTransferFromParamsInternal
  | {
      asyncParams: () => Promise<SafeTransferFromParamsInternal>;
    }
>;
/**
 * Calls the "safeTransferFrom" function on the contract.
 * @param options - The options for the "safeTransferFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { safeTransferFrom } from "thirdweb/extensions/erc721";
 *
 * const transaction = safeTransferFrom({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function safeTransferFrom(
  options: BaseTransactionOptions<SafeTransferFromParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x42842e0e",
      [
        {
          type: "address",
          name: "from",
        },
        {
          type: "address",
          name: "to",
        },
        {
          type: "uint256",
          name: "tokenId",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [
          resolvedParams.from,
          resolvedParams.to,
          resolvedParams.tokenId,
        ] as const;
      }

      return [options.from, options.to, options.tokenId] as const;
    },
  });
}
