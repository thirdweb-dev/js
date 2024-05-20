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
 * Represents the parameters for the "removeFor" function.
 */
export type RemoveForParams = WithOverrides<{
  fidOwner: AbiParameterToPrimitiveType<{ type: "address"; name: "fidOwner" }>;
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
}>;

export const FN_SELECTOR = "0x787bd966" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "fidOwner",
  },
  {
    type: "bytes",
    name: "key",
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
 * Checks if the `removeFor` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `removeFor` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isRemoveForSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = await isRemoveForSupported(contract);
 * ```
 */
export async function isRemoveForSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "removeFor" function.
 * @param options - The options for the removeFor function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRemoveForParams } "thirdweb/extensions/farcaster";
 * const result = encodeRemoveForParams({
 *  fidOwner: ...,
 *  key: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeRemoveForParams(options: RemoveForParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.fidOwner,
    options.key,
    options.deadline,
    options.sig,
  ]);
}

/**
 * Encodes the "removeFor" function into a Hex string with its parameters.
 * @param options - The options for the removeFor function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRemoveFor } "thirdweb/extensions/farcaster";
 * const result = encodeRemoveFor({
 *  fidOwner: ...,
 *  key: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeRemoveFor(options: RemoveForParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeRemoveForParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "removeFor" function on the contract.
 * @param options - The options for the "removeFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { removeFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = removeFor({
 *  contract,
 *  fidOwner: ...,
 *  key: ...,
 *  deadline: ...,
 *  sig: ...,
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
export function removeFor(
  options: BaseTransactionOptions<
    | RemoveForParams
    | {
        asyncParams: () => Promise<RemoveForParams>;
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
        resolvedOptions.fidOwner,
        resolvedOptions.key,
        resolvedOptions.deadline,
        resolvedOptions.sig,
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
