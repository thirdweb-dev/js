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
 * Represents the parameters for the "castVote" function.
 */
export type CastVoteParams = WithOverrides<{
  proposalId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "proposalId";
  }>;
  support: AbiParameterToPrimitiveType<{ type: "uint8"; name: "support" }>;
}>;

export const FN_SELECTOR = "0x56781388" as const;
const FN_INPUTS = [
  {
    name: "proposalId",
    type: "uint256",
  },
  {
    name: "support",
    type: "uint8",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `castVote` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `castVote` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isCastVoteSupported } from "thirdweb/extensions/vote";
 *
 * const supported = isCastVoteSupported(["0x..."]);
 * ```
 */
export function isCastVoteSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "castVote" function.
 * @param options - The options for the castVote function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeCastVoteParams } from "thirdweb/extensions/vote";
 * const result = encodeCastVoteParams({
 *  proposalId: ...,
 *  support: ...,
 * });
 * ```
 */
export function encodeCastVoteParams(options: CastVoteParams) {
  return encodeAbiParameters(FN_INPUTS, [options.proposalId, options.support]);
}

/**
 * Encodes the "castVote" function into a Hex string with its parameters.
 * @param options - The options for the castVote function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeCastVote } from "thirdweb/extensions/vote";
 * const result = encodeCastVote({
 *  proposalId: ...,
 *  support: ...,
 * });
 * ```
 */
export function encodeCastVote(options: CastVoteParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCastVoteParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "castVote" function on the contract.
 * @param options - The options for the "castVote" function.
 * @returns A prepared transaction object.
 * @extension VOTE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { castVote } from "thirdweb/extensions/vote";
 *
 * const transaction = castVote({
 *  contract,
 *  proposalId: ...,
 *  support: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function castVote(
  options: BaseTransactionOptions<
    | CastVoteParams
    | {
        asyncParams: () => Promise<CastVoteParams>;
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
      return [resolvedOptions.proposalId, resolvedOptions.support] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
