import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "incrementNonce" function.
 */
export type IncrementNonceParams = WithOverrides<{
  key: AbiParameterToPrimitiveType<{ type: "uint192"; name: "key" }>;
}>;

export const FN_SELECTOR = "0x0bd28e3b" as const;
const FN_INPUTS = [
  {
    type: "uint192",
    name: "key",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "incrementNonce" function.
 * @param options - The options for the incrementNonce function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeIncrementNonceParams } "thirdweb/extensions/erc4337";
 * const result = encodeIncrementNonceParams({
 *  key: ...,
 * });
 * ```
 */
export function encodeIncrementNonceParams(options: IncrementNonceParams) {
  return encodeAbiParameters(FN_INPUTS, [options.key]);
}

/**
 * Calls the "incrementNonce" function on the contract.
 * @param options - The options for the "incrementNonce" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { incrementNonce } from "thirdweb/extensions/erc4337";
 *
 * const transaction = incrementNonce({
 *  contract,
 *  key: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function incrementNonce(
  options: BaseTransactionOptions<
    | IncrementNonceParams
    | {
        asyncParams: () => Promise<IncrementNonceParams>;
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
