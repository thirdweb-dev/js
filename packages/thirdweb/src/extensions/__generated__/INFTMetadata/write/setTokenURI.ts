import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setTokenURI" function.
 */
export type SetTokenURIParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_tokenId";
    type: "uint256";
  }>;
  uri: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "_uri";
    type: "string";
  }>;
};

/**
 * Calls the setTokenURI function on the contract.
 * @param options - The options for the setTokenURI function.
 * @returns A prepared transaction object.
 * @extension INFTMETADATA
 * @example
 * ```
 * import { setTokenURI } from "thirdweb/extensions/INFTMetadata";
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
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_uri",
          type: "string",
        },
      ],
      [],
    ],
    params: [options.tokenId, options.uri],
  });
}
