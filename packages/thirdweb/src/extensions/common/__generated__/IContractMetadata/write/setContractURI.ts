import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "setContractURI" function.
 */
export type SetContractURIParams = WithOverrides<{
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "_uri" }>;
}>;

export const FN_SELECTOR = "0x938e3d7b" as const;
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
 * ```ts
 * import { encodeSetContractURIParams } "thirdweb/extensions/common";
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
 * @extension COMMON
 * @example
 * ```ts
 * import { setContractURI } from "thirdweb/extensions/common";
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
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.uri] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
