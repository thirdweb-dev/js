import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setContractURI" function.
 */

type SetContractURIParamsInternal = {
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "_uri" }>;
};

export type SetContractURIParams = Prettify<
  | SetContractURIParamsInternal
  | {
      asyncParams: () => Promise<SetContractURIParamsInternal>;
    }
>;
const FN_SELECTOR = "0x938e3d7b" as const;
const FN_INPUTS = [
  {
    type: "string",
    name: "_uri",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setContractURI" function.
 * @param options - The options for the setContractURI function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```
 * import { encodeSetContractURIParams } "thirdweb/extensions/common";
 * const result = encodeSetContractURIParams({
 *  uri: ...,
 * });
 * ```
 */
export function encodeSetContractURIParams(
  options: SetContractURIParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.uri]);
}

/**
 * Calls the "setContractURI" function on the contract.
 * @param options - The options for the "setContractURI" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { setContractURI } from "thirdweb/extensions/common";
 *
 * const transaction = setContractURI({
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setContractURI(
  options: BaseTransactionOptions<SetContractURIParams>,
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
