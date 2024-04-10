import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "registerFor" function.
 */
export type RegisterForParams = WithValue<{
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
  extraStorage: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "extraStorage";
  }>;
}>;

export const FN_SELECTOR = "0xa0c7529c" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "to",
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
 * Encodes the parameters for the "registerFor" function.
 * @param options - The options for the registerFor function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRegisterForParams } "thirdweb/extensions/farcaster";
 * const result = encodeRegisterForParams({
 *  to: ...,
 *  recovery: ...,
 *  deadline: ...,
 *  sig: ...,
 *  extraStorage: ...,
 * });
 * ```
 */
export function encodeRegisterForParams(options: RegisterForParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.to,
    options.recovery,
    options.deadline,
    options.sig,
    options.extraStorage,
  ]);
}

/**
 * Calls the "registerFor" function on the contract.
 * @param options - The options for the "registerFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { registerFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = registerFor({
 *  contract,
 *  to: ...,
 *  recovery: ...,
 *  deadline: ...,
 *  sig: ...,
 *  extraStorage: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function registerFor(
  options: BaseTransactionOptions<
    | RegisterForParams
    | {
        asyncParams: () => Promise<RegisterForParams>;
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
      return [
        resolvedParams.to,
        resolvedParams.recovery,
        resolvedParams.deadline,
        resolvedParams.sig,
        resolvedParams.extraStorage,
      ] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
