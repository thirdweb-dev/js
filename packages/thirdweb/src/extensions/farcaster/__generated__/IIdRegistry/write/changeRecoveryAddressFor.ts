import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "changeRecoveryAddressFor" function.
 */
export type ChangeRecoveryAddressForParams = WithOverrides<{
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
}>;

export const FN_SELECTOR = "0x9cbef8dc" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "owner",
  },
  {
    type: "address",
    name: "recovery",
  },
  {
    type: "uint256",
    name: "deadline",
  },
  {
    type: "bytes",
    name: "sig",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "changeRecoveryAddressFor" function.
 * @param options - The options for the changeRecoveryAddressFor function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeChangeRecoveryAddressForParams } "thirdweb/extensions/farcaster";
 * const result = encodeChangeRecoveryAddressForParams({
 *  owner: ...,
 *  recovery: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeChangeRecoveryAddressForParams(
  options: ChangeRecoveryAddressForParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.owner,
    options.recovery,
    options.deadline,
    options.sig,
  ]);
}

/**
 * Calls the "changeRecoveryAddressFor" function on the contract.
 * @param options - The options for the "changeRecoveryAddressFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { changeRecoveryAddressFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = changeRecoveryAddressFor({
 *  contract,
 *  owner: ...,
 *  recovery: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function changeRecoveryAddressFor(
  options: BaseTransactionOptions<
    | ChangeRecoveryAddressForParams
    | {
        asyncParams: () => Promise<ChangeRecoveryAddressForParams>;
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
      return [
        resolvedOptions.owner,
        resolvedOptions.recovery,
        resolvedOptions.deadline,
        resolvedOptions.sig,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
