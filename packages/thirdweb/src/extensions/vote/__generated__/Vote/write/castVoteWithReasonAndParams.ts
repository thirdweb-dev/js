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
 * Represents the parameters for the "castVoteWithReasonAndParams" function.
 */
export type CastVoteWithReasonAndParamsParams = WithOverrides<{
  proposalId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "proposalId";
  }>;
  support: AbiParameterToPrimitiveType<{ type: "uint8"; name: "support" }>;
  reason: AbiParameterToPrimitiveType<{ type: "string"; name: "reason" }>;
  params: AbiParameterToPrimitiveType<{ type: "bytes"; name: "params" }>;
}>;

export const FN_SELECTOR = "0x5f398a14" as const;
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
    type: "string",
    name: "reason",
  },
  {
    type: "bytes",
    name: "params",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `castVoteWithReasonAndParams` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `castVoteWithReasonAndParams` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isCastVoteWithReasonAndParamsSupported } from "thirdweb/extensions/vote";
 *
 * const supported = isCastVoteWithReasonAndParamsSupported(["0x..."]);
 * ```
 */
export function isCastVoteWithReasonAndParamsSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "castVoteWithReasonAndParams" function.
 * @param options - The options for the castVoteWithReasonAndParams function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeCastVoteWithReasonAndParamsParams } "thirdweb/extensions/vote";
 * const result = encodeCastVoteWithReasonAndParamsParams({
 *  proposalId: ...,
 *  support: ...,
 *  reason: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeCastVoteWithReasonAndParamsParams(
  options: CastVoteWithReasonAndParamsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.proposalId,
    options.support,
    options.reason,
    options.params,
  ]);
}

/**
 * Encodes the "castVoteWithReasonAndParams" function into a Hex string with its parameters.
 * @param options - The options for the castVoteWithReasonAndParams function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeCastVoteWithReasonAndParams } "thirdweb/extensions/vote";
 * const result = encodeCastVoteWithReasonAndParams({
 *  proposalId: ...,
 *  support: ...,
 *  reason: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeCastVoteWithReasonAndParams(
  options: CastVoteWithReasonAndParamsParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCastVoteWithReasonAndParamsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "castVoteWithReasonAndParams" function on the contract.
 * @param options - The options for the "castVoteWithReasonAndParams" function.
 * @returns A prepared transaction object.
 * @extension VOTE
 * @example
 * ```ts
 * import { castVoteWithReasonAndParams } from "thirdweb/extensions/vote";
 *
 * const transaction = castVoteWithReasonAndParams({
 *  contract,
 *  proposalId: ...,
 *  support: ...,
 *  reason: ...,
 *  params: ...,
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
export function castVoteWithReasonAndParams(
  options: BaseTransactionOptions<
    | CastVoteWithReasonAndParamsParams
    | {
        asyncParams: () => Promise<CastVoteWithReasonAndParamsParams>;
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
        resolvedOptions.reason,
        resolvedOptions.params,
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
