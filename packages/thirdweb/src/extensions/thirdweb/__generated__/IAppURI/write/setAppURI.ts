import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setAppURI" function.
 */

export type SetAppURIParams = {
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "_uri" }>;
};

export const FN_SELECTOR = "0xfea18082" as const;
const FN_INPUTS = [
  {
    type: "string",
    name: "_uri",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setAppURI" function.
 * @param options - The options for the setAppURI function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeSetAppURIParams } "thirdweb/extensions/thirdweb";
 * const result = encodeSetAppURIParams({
 *  uri: ...,
 * });
 * ```
 */
export function encodeSetAppURIParams(options: SetAppURIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.uri]);
}

/**
 * Calls the "setAppURI" function on the contract.
 * @param options - The options for the "setAppURI" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { setAppURI } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = setAppURI({
 *  contract,
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setAppURI(
  options: BaseTransactionOptions<
    | SetAppURIParams
    | {
        asyncParams: () => Promise<SetAppURIParams>;
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
