import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setContractURI" function.
 */

export type SetContractURIParams = {
  uri: AbiParameterToPrimitiveType<{
    name: "_uri";
    type: "string";
    internalType: "string";
  }>;
};

const FN_SELECTOR = "0x938e3d7b" as const;
const FN_INPUTS = [
  {
    name: "_uri",
    type: "string",
    internalType: "string",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setContractURI" function.
 * @param options - The options for the setContractURI function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSetContractURIParams } "thirdweb/extensions/erc721";
 * const result = encodeSetContractURIParams({
 *  uri: ...,
 * });
 * ```
 */
export function encodeSetContractURIParams(options: SetContractURIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.uri]);
}

/**
 * Calls the "setContractURI" function on the contract.
 * @param options - The options for the "setContractURI" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { setContractURI } from "thirdweb/extensions/erc721";
 *
 * const transaction = setContractURI({
 *  contract,
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setContractURI(
  options: BaseTransactionOptions<
    | SetContractURIParams
    | {
        asyncParams: () => Promise<SetContractURIParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.uri] as const;
          }
        : [options.uri],
  });
}
