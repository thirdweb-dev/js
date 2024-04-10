import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "changeRecoveryAddress" function.
 */
export type ChangeRecoveryAddressParams = WithOverrides<{
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
}>;

export const FN_SELECTOR = "0xf1f0b224" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "recovery",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "changeRecoveryAddress" function.
 * @param options - The options for the changeRecoveryAddress function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeChangeRecoveryAddressParams } "thirdweb/extensions/farcaster";
 * const result = encodeChangeRecoveryAddressParams({
 *  recovery: ...,
 * });
 * ```
 */
export function encodeChangeRecoveryAddressParams(
  options: ChangeRecoveryAddressParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.recovery]);
}

/**
 * Calls the "changeRecoveryAddress" function on the contract.
 * @param options - The options for the "changeRecoveryAddress" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { changeRecoveryAddress } from "thirdweb/extensions/farcaster";
 *
 * const transaction = changeRecoveryAddress({
 *  contract,
 *  recovery: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function changeRecoveryAddress(
  options: BaseTransactionOptions<
    | ChangeRecoveryAddressParams
    | {
        asyncParams: () => Promise<ChangeRecoveryAddressParams>;
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
      return [resolvedOptions.recovery] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
