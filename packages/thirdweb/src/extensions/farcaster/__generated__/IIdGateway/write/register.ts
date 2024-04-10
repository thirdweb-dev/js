import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "register" function.
 */
export type RegisterParams = WithValue<{
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
  extraStorage: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "extraStorage";
  }>;
}>;

export const FN_SELECTOR = "0x6d705ebb" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "recovery",
  },
  {
    type: "uint256",
    name: "extraStorage",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "fid",
  },
  {
    type: "uint256",
    name: "overpayment",
  },
] as const;

/**
 * Encodes the parameters for the "register" function.
 * @param options - The options for the register function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRegisterParams } "thirdweb/extensions/farcaster";
 * const result = encodeRegisterParams({
 *  recovery: ...,
 *  extraStorage: ...,
 * });
 * ```
 */
export function encodeRegisterParams(options: RegisterParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.recovery,
    options.extraStorage,
  ]);
}

/**
 * Calls the "register" function on the contract.
 * @param options - The options for the "register" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { register } from "thirdweb/extensions/farcaster";
 *
 * const transaction = register({
 *  contract,
 *  recovery: ...,
 *  extraStorage: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function register(
  options: BaseTransactionOptions<
    | RegisterParams
    | {
        asyncParams: () => Promise<RegisterParams>;
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
      return [resolvedParams.recovery, resolvedParams.extraStorage] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
