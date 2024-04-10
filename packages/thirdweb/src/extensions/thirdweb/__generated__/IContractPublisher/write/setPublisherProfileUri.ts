import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "setPublisherProfileUri" function.
 */
export type SetPublisherProfileUriParams = WithValue<{
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "uri" }>;
}>;

export const FN_SELECTOR = "0x6e578e54" as const;
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
 * ```ts
 * import { encodeSetPublisherProfileUriParams } "thirdweb/extensions/thirdweb";
 * const result = encodeSetPublisherProfileUriParams({
 *  publisher: ...,
 *  uri: ...,
 * });
 * ```
 */
export function encodeSetPublisherProfileUriParams(
  options: SetPublisherProfileUriParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.publisher, options.uri]);
}

/**
 * Calls the "setPublisherProfileUri" function on the contract.
 * @param options - The options for the "setPublisherProfileUri" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { setPublisherProfileUri } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = setPublisherProfileUri({
 *  contract,
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
  options: BaseTransactionOptions<
    | SetPublisherProfileUriParams
    | {
        asyncParams: () => Promise<SetPublisherProfileUriParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedParams = await asyncOptions();
      return [resolvedParams.publisher, resolvedParams.uri] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
