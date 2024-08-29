import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "castVoteBySig" function.
 */
export type CastVoteBySigParams = WithOverrides<{
  proposalId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "proposalId";
  }>;
  support: AbiParameterToPrimitiveType<{ type: "uint8"; name: "support" }>;
  v: AbiParameterToPrimitiveType<{ type: "uint8"; name: "v" }>;
  r: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "r" }>;
  s: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "s" }>;
}>;

export const FN_SELECTOR = "0x3bccf4fd" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "proposalId",
  },
  {
    type: "uint8",
    name: "support",
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
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `castVoteBySig` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `castVoteBySig` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isCastVoteBySigSupported } from "thirdweb/extensions/vote";
 *
 * const supported = isCastVoteBySigSupported(["0x..."]);
 * ```
 */
export function isCastVoteBySigSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "castVoteBySig" function.
 * @param options - The options for the castVoteBySig function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeCastVoteBySigParams } "thirdweb/extensions/vote";
 * const result = encodeCastVoteBySigParams({
 *  proposalId: ...,
 *  support: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 * });
 * ```
 */
export function encodeCastVoteBySigParams(options: CastVoteBySigParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.proposalId,
    options.support,
    options.v,
    options.r,
    options.s,
  ]);
}

/**
 * Encodes the "castVoteBySig" function into a Hex string with its parameters.
 * @param options - The options for the castVoteBySig function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeCastVoteBySig } "thirdweb/extensions/vote";
 * const result = encodeCastVoteBySig({
 *  proposalId: ...,
 *  support: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 * });
 * ```
 */
export function encodeCastVoteBySig(options: CastVoteBySigParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCastVoteBySigParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "castVoteBySig" function on the contract.
 * @param options - The options for the "castVoteBySig" function.
 * @returns A prepared transaction object.
 * @extension VOTE
 * @example
 * ```ts
 * import { castVoteBySig } from "thirdweb/extensions/vote";
 *
 * const transaction = castVoteBySig({
 *  contract,
 *  proposalId: ...,
 *  support: ...,
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
export function castVoteBySig(
  options: BaseTransactionOptions<
    | CastVoteBySigParams
    | {
        asyncParams: () => Promise<CastVoteBySigParams>;
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
        resolvedOptions.proposalId,
        resolvedOptions.support,
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
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
  });
}
