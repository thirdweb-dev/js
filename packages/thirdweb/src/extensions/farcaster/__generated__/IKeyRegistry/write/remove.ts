import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "remove" function.
 */
export type RemoveParams = WithOverrides<{
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
}>;

export const FN_SELECTOR = "0x58edef4c" as const;
const FN_INPUTS = [
  {
    type: "bytes",
    name: "key",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "remove" function.
 * @param options - The options for the remove function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRemoveParams } "thirdweb/extensions/farcaster";
 * const result = encodeRemoveParams({
 *  key: ...,
 * });
 * ```
 */
export function encodeRemoveParams(options: RemoveParams) {
  return encodeAbiParameters(FN_INPUTS, [options.key]);
}

/**
 * Calls the "remove" function on the contract.
 * @param options - The options for the "remove" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { remove } from "thirdweb/extensions/farcaster";
 *
 * const transaction = remove({
 *  contract,
 *  key: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function remove(
  options: BaseTransactionOptions<
    | RemoveParams
    | {
        asyncParams: () => Promise<RemoveParams>;
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
      return [resolvedOptions.key] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
