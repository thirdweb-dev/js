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
 * Represents the parameters for the "delegateBySig" function.
 */
export type DelegateBySigParams = WithOverrides<{
  delegatee: AbiParameterToPrimitiveType<{
    type: "address";
    name: "delegatee";
  }>;
  nonce: AbiParameterToPrimitiveType<{ type: "uint256"; name: "nonce" }>;
  expiry: AbiParameterToPrimitiveType<{ type: "uint256"; name: "expiry" }>;
  v: AbiParameterToPrimitiveType<{ type: "uint8"; name: "v" }>;
  r: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "r" }>;
  s: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "s" }>;
}>;

export const FN_SELECTOR = "0xc3cda520" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "delegatee",
  },
  {
    type: "uint256",
    name: "nonce",
  },
  {
    type: "uint256",
    name: "expiry",
  },
  {
    type: "uint8",
    name: "v",
  },
  {
    type: "bytes32",
    name: "r",
  },
  {
    type: "bytes32",
    name: "s",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `delegateBySig` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `delegateBySig` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isDelegateBySigSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = await isDelegateBySigSupported(contract);
 * ```
 */
export async function isDelegateBySigSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "delegateBySig" function.
 * @param options - The options for the delegateBySig function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeDelegateBySigParams } "thirdweb/extensions/erc20";
 * const result = encodeDelegateBySigParams({
 *  delegatee: ...,
 *  nonce: ...,
 *  expiry: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 * });
 * ```
 */
export function encodeDelegateBySigParams(options: DelegateBySigParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.delegatee,
    options.nonce,
    options.expiry,
    options.v,
    options.r,
    options.s,
  ]);
}

/**
 * Encodes the "delegateBySig" function into a Hex string with its parameters.
 * @param options - The options for the delegateBySig function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeDelegateBySig } "thirdweb/extensions/erc20";
 * const result = encodeDelegateBySig({
 *  delegatee: ...,
 *  nonce: ...,
 *  expiry: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 * });
 * ```
 */
export function encodeDelegateBySig(options: DelegateBySigParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDelegateBySigParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "delegateBySig" function on the contract.
 * @param options - The options for the "delegateBySig" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { delegateBySig } from "thirdweb/extensions/erc20";
 *
 * const transaction = delegateBySig({
 *  contract,
 *  delegatee: ...,
 *  nonce: ...,
 *  expiry: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
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
export function delegateBySig(
  options: BaseTransactionOptions<
    | DelegateBySigParams
    | {
        asyncParams: () => Promise<DelegateBySigParams>;
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
        resolvedOptions.delegatee,
        resolvedOptions.nonce,
        resolvedOptions.expiry,
        resolvedOptions.v,
        resolvedOptions.r,
        resolvedOptions.s,
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
