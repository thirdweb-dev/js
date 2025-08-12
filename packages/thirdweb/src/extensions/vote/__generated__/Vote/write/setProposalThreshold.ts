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
 * Represents the parameters for the "setProposalThreshold" function.
 */
export type SetProposalThresholdParams = WithOverrides<{
  newProposalThreshold: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "newProposalThreshold";
  }>;
}>;

export const FN_SELECTOR = "0xece40cc1" as const;
const FN_INPUTS = [
  {
    name: "newProposalThreshold",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setProposalThreshold` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setProposalThreshold` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isSetProposalThresholdSupported } from "thirdweb/extensions/vote";
 *
 * const supported = isSetProposalThresholdSupported(["0x..."]);
 * ```
 */
export function isSetProposalThresholdSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setProposalThreshold" function.
 * @param options - The options for the setProposalThreshold function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeSetProposalThresholdParams } from "thirdweb/extensions/vote";
 * const result = encodeSetProposalThresholdParams({
 *  newProposalThreshold: ...,
 * });
 * ```
 */
export function encodeSetProposalThresholdParams(
  options: SetProposalThresholdParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.newProposalThreshold]);
}

/**
 * Encodes the "setProposalThreshold" function into a Hex string with its parameters.
 * @param options - The options for the setProposalThreshold function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeSetProposalThreshold } from "thirdweb/extensions/vote";
 * const result = encodeSetProposalThreshold({
 *  newProposalThreshold: ...,
 * });
 * ```
 */
export function encodeSetProposalThreshold(
  options: SetProposalThresholdParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetProposalThresholdParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setProposalThreshold" function on the contract.
 * @param options - The options for the "setProposalThreshold" function.
 * @returns A prepared transaction object.
 * @extension VOTE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { setProposalThreshold } from "thirdweb/extensions/vote";
 *
 * const transaction = setProposalThreshold({
 *  contract,
 *  newProposalThreshold: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setProposalThreshold(
  options: BaseTransactionOptions<
    | SetProposalThresholdParams
    | {
        asyncParams: () => Promise<SetProposalThresholdParams>;
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
      return [resolvedOptions.newProposalThreshold] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
