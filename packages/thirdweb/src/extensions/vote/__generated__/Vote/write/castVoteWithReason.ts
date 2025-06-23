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
 * Represents the parameters for the "castVoteWithReason" function.
 */
export type CastVoteWithReasonParams = WithOverrides<{
  proposalId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "proposalId";
  }>;
  support: AbiParameterToPrimitiveType<{ type: "uint8"; name: "support" }>;
  reason: AbiParameterToPrimitiveType<{ type: "string"; name: "reason" }>;
}>;

export const FN_SELECTOR = "0x7b3c71d3" as const;
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
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `castVoteWithReason` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `castVoteWithReason` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isCastVoteWithReasonSupported } from "thirdweb/extensions/vote";
 *
 * const supported = isCastVoteWithReasonSupported(["0x..."]);
 * ```
 */
export function isCastVoteWithReasonSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "castVoteWithReason" function.
 * @param options - The options for the castVoteWithReason function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeCastVoteWithReasonParams } from "thirdweb/extensions/vote";
 * const result = encodeCastVoteWithReasonParams({
 *  proposalId: ...,
 *  support: ...,
 *  reason: ...,
 * });
 * ```
 */
export function encodeCastVoteWithReasonParams(
  options: CastVoteWithReasonParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.proposalId,
    options.support,
    options.reason,
  ]);
}

/**
 * Encodes the "castVoteWithReason" function into a Hex string with its parameters.
 * @param options - The options for the castVoteWithReason function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeCastVoteWithReason } from "thirdweb/extensions/vote";
 * const result = encodeCastVoteWithReason({
 *  proposalId: ...,
 *  support: ...,
 *  reason: ...,
 * });
 * ```
 */
export function encodeCastVoteWithReason(options: CastVoteWithReasonParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCastVoteWithReasonParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "castVoteWithReason" function on the contract.
 * @param options - The options for the "castVoteWithReason" function.
 * @returns A prepared transaction object.
 * @extension VOTE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { castVoteWithReason } from "thirdweb/extensions/vote";
 *
 * const transaction = castVoteWithReason({
 *  contract,
 *  proposalId: ...,
 *  support: ...,
 *  reason: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function castVoteWithReason(
  options: BaseTransactionOptions<
    | CastVoteWithReasonParams
    | {
        asyncParams: () => Promise<CastVoteWithReasonParams>;
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
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
