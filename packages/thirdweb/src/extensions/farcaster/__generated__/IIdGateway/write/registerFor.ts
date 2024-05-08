import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "registerFor" function.
 */
export type RegisterForParams = WithOverrides<{
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
 * Checks if the `registerFor` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `registerFor` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isRegisterForSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = await isRegisterForSupported(contract);
 * ```
 */
export async function isRegisterForSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

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
 * Encodes the "registerFor" function into a Hex string with its parameters.
 * @param options - The options for the registerFor function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRegisterFor } "thirdweb/extensions/farcaster";
 * const result = encodeRegisterFor({
 *  to: ...,
 *  recovery: ...,
 *  deadline: ...,
 *  sig: ...,
 *  extraStorage: ...,
 * });
 * ```
 */
export function encodeRegisterFor(options: RegisterForParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeRegisterForParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "registerFor" function on the contract.
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
 *  overrides: {
 *    ...
 *  }
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
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.to,
        resolvedOptions.recovery,
        resolvedOptions.deadline,
        resolvedOptions.sig,
        resolvedOptions.extraStorage,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
  });
}
