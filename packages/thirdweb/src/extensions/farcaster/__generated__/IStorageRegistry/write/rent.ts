import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "rent" function.
 */
export type RentParams = WithOverrides<{
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  units: AbiParameterToPrimitiveType<{ type: "uint256"; name: "units" }>;
}>;

export const FN_SELECTOR = "0x783a112b" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "fid",
  },
  {
    type: "uint256",
    name: "units",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "overpayment",
  },
] as const;

/**
 * Encodes the parameters for the "rent" function.
 * @param options - The options for the rent function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRentParams } "thirdweb/extensions/farcaster";
 * const result = encodeRentParams({
 *  fid: ...,
 *  units: ...,
 * });
 * ```
 */
export function encodeRentParams(options: RentParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fid, options.units]);
}

/**
 * Calls the "rent" function on the contract.
 * @param options - The options for the "rent" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { rent } from "thirdweb/extensions/farcaster";
 *
 * const transaction = rent({
 *  contract,
 *  fid: ...,
 *  units: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function rent(
  options: BaseTransactionOptions<
    | RentParams
    | {
        asyncParams: () => Promise<RentParams>;
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
      return [resolvedOptions.fid, resolvedOptions.units] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
