import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setPublisherProfileUri" function.
 */

type SetPublisherProfileUriParamsInternal = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "uri" }>;
};

export type SetPublisherProfileUriParams = Prettify<
  | SetPublisherProfileUriParamsInternal
  | {
      asyncParams: () => Promise<SetPublisherProfileUriParamsInternal>;
    }
>;
const FN_SELECTOR = "0x6e578e54" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "publisher",
  },
  {
    type: "string",
    name: "uri",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setPublisherProfileUri" function.
 * @param options - The options for the setPublisherProfileUri function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```
 * import { encodeSetPublisherProfileUriParams } "thirdweb/extensions/thirdweb";
 * const result = encodeSetPublisherProfileUriParams({
 *  publisher: ...,
 *  uri: ...,
 * });
 * ```
 */
export function encodeSetPublisherProfileUriParams(
  options: SetPublisherProfileUriParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.publisher, options.uri]);
}

/**
 * Calls the "setPublisherProfileUri" function on the contract.
 * @param options - The options for the "setPublisherProfileUri" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { setPublisherProfileUri } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = setPublisherProfileUri({
 *  publisher: ...,
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setPublisherProfileUri(
  options: BaseTransactionOptions<SetPublisherProfileUriParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.publisher, resolvedParams.uri] as const;
          }
        : [options.publisher, options.uri],
  });
}
