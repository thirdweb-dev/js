import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "castVoteWithReasonAndParamsBySig" function.
 */
export type CastVoteWithReasonAndParamsBySigParams = WithOverrides<{
  proposalId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "proposalId";
  }>;
  support: AbiParameterToPrimitiveType<{ type: "uint8"; name: "support" }>;
  reason: AbiParameterToPrimitiveType<{ type: "string"; name: "reason" }>;
  params: AbiParameterToPrimitiveType<{ type: "bytes"; name: "params" }>;
  v: AbiParameterToPrimitiveType<{ type: "uint8"; name: "v" }>;
  r: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "r" }>;
  s: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "s" }>;
}>;

export const FN_SELECTOR = "0x03420181" as const;
const FN_INPUTS = [
  {
    name: "proposalId",
    type: "uint256",
  },
  {
    name: "support",
    type: "uint8",
  },
  {
    name: "reason",
    type: "string",
  },
  {
    name: "params",
    type: "bytes",
  },
  {
    name: "v",
    type: "uint8",
  },
  {
    name: "r",
    type: "bytes32",
  },
  {
    name: "s",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `castVoteWithReasonAndParamsBySig` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `castVoteWithReasonAndParamsBySig` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isCastVoteWithReasonAndParamsBySigSupported } from "thirdweb/extensions/vote";
 *
 * const supported = isCastVoteWithReasonAndParamsBySigSupported(["0x..."]);
 * ```
 */
export function isCastVoteWithReasonAndParamsBySigSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "castVoteWithReasonAndParamsBySig" function.
 * @param options - The options for the castVoteWithReasonAndParamsBySig function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeCastVoteWithReasonAndParamsBySigParams } from "thirdweb/extensions/vote";
 * const result = encodeCastVoteWithReasonAndParamsBySigParams({
 *  proposalId: ...,
 *  support: ...,
 *  reason: ...,
 *  params: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 * });
 * ```
 */
export function encodeCastVoteWithReasonAndParamsBySigParams(
  options: CastVoteWithReasonAndParamsBySigParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.proposalId,
    options.support,
    options.reason,
    options.params,
    options.v,
    options.r,
    options.s,
  ]);
}

/**
 * Encodes the "castVoteWithReasonAndParamsBySig" function into a Hex string with its parameters.
 * @param options - The options for the castVoteWithReasonAndParamsBySig function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeCastVoteWithReasonAndParamsBySig } from "thirdweb/extensions/vote";
 * const result = encodeCastVoteWithReasonAndParamsBySig({
 *  proposalId: ...,
 *  support: ...,
 *  reason: ...,
 *  params: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 * });
 * ```
 */
export function encodeCastVoteWithReasonAndParamsBySig(
  options: CastVoteWithReasonAndParamsBySigParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCastVoteWithReasonAndParamsBySigParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "castVoteWithReasonAndParamsBySig" function on the contract.
 * @param options - The options for the "castVoteWithReasonAndParamsBySig" function.
 * @returns A prepared transaction object.
 * @extension VOTE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { castVoteWithReasonAndParamsBySig } from "thirdweb/extensions/vote";
 *
 * const transaction = castVoteWithReasonAndParamsBySig({
 *  contract,
 *  proposalId: ...,
 *  support: ...,
 *  reason: ...,
 *  params: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function castVoteWithReasonAndParamsBySig(
  options: BaseTransactionOptions<
    | CastVoteWithReasonAndParamsBySigParams
    | {
        asyncParams: () => Promise<CastVoteWithReasonAndParamsBySigParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
    contract: options.contract,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.proposalId,
        resolvedOptions.support,
        resolvedOptions.reason,
        resolvedOptions.params,
        resolvedOptions.v,
        resolvedOptions.r,
        resolvedOptions.s,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
