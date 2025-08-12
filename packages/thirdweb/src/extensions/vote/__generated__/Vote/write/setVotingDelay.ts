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
 * Represents the parameters for the "setVotingDelay" function.
 */
export type SetVotingDelayParams = WithOverrides<{
  newVotingDelay: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "newVotingDelay";
  }>;
}>;

export const FN_SELECTOR = "0x70b0f660" as const;
const FN_INPUTS = [
  {
    name: "newVotingDelay",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setVotingDelay` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setVotingDelay` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isSetVotingDelaySupported } from "thirdweb/extensions/vote";
 *
 * const supported = isSetVotingDelaySupported(["0x..."]);
 * ```
 */
export function isSetVotingDelaySupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setVotingDelay" function.
 * @param options - The options for the setVotingDelay function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeSetVotingDelayParams } from "thirdweb/extensions/vote";
 * const result = encodeSetVotingDelayParams({
 *  newVotingDelay: ...,
 * });
 * ```
 */
export function encodeSetVotingDelayParams(options: SetVotingDelayParams) {
  return encodeAbiParameters(FN_INPUTS, [options.newVotingDelay]);
}

/**
 * Encodes the "setVotingDelay" function into a Hex string with its parameters.
 * @param options - The options for the setVotingDelay function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeSetVotingDelay } from "thirdweb/extensions/vote";
 * const result = encodeSetVotingDelay({
 *  newVotingDelay: ...,
 * });
 * ```
 */
export function encodeSetVotingDelay(options: SetVotingDelayParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetVotingDelayParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setVotingDelay" function on the contract.
 * @param options - The options for the "setVotingDelay" function.
 * @returns A prepared transaction object.
 * @extension VOTE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { setVotingDelay } from "thirdweb/extensions/vote";
 *
 * const transaction = setVotingDelay({
 *  contract,
 *  newVotingDelay: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setVotingDelay(
  options: BaseTransactionOptions<
    | SetVotingDelayParams
    | {
        asyncParams: () => Promise<SetVotingDelayParams>;
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
      return [resolvedOptions.newVotingDelay] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
