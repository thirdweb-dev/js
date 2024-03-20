import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "setTokenURI" function.
 */

type SetTokenURIParamsInternal = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "_uri" }>;
};

export type SetTokenURIParams = Prettify<
  | SetTokenURIParamsInternal
  | {
      asyncParams: () => Promise<SetTokenURIParamsInternal>;
    }
>;
/**
 * Calls the "setTokenURI" function on the contract.
 * @param options - The options for the "setTokenURI" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { setTokenURI } from "thirdweb/extensions/erc721";
 *
 * const transaction = setTokenURI({
 *  tokenId: ...,
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setTokenURI(
  options: BaseTransactionOptions<SetTokenURIParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x162094c4",
      [
        {
          type: "uint256",
          name: "_tokenId",
        },
        {
          type: "string",
          name: "_uri",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.tokenId, resolvedParams.uri] as const;
          }
        : [options.tokenId, options.uri],
  });
}
