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
 * Represents the parameters for the "withdrawStake" function.
 */
export type WithdrawStakeParams = WithOverrides<{
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
}>;

export const FN_SELECTOR = "0xc23a5cea" as const;
const FN_INPUTS = [
  {
    name: "to",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `withdrawStake` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `withdrawStake` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isWithdrawStakeSupported } from "thirdweb/extensions/erc7579";
 *
 * const supported = isWithdrawStakeSupported(["0x..."]);
 * ```
 */
export function isWithdrawStakeSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "withdrawStake" function.
 * @param options - The options for the withdrawStake function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeWithdrawStakeParams } from "thirdweb/extensions/erc7579";
 * const result = encodeWithdrawStakeParams({
 *  to: ...,
 * });
 * ```
 */
export function encodeWithdrawStakeParams(options: WithdrawStakeParams) {
  return encodeAbiParameters(FN_INPUTS, [options.to]);
}

/**
 * Encodes the "withdrawStake" function into a Hex string with its parameters.
 * @param options - The options for the withdrawStake function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeWithdrawStake } from "thirdweb/extensions/erc7579";
 * const result = encodeWithdrawStake({
 *  to: ...,
 * });
 * ```
 */
export function encodeWithdrawStake(options: WithdrawStakeParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeWithdrawStakeParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "withdrawStake" function on the contract.
 * @param options - The options for the "withdrawStake" function.
 * @returns A prepared transaction object.
 * @extension ERC7579
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { withdrawStake } from "thirdweb/extensions/erc7579";
 *
 * const transaction = withdrawStake({
 *  contract,
 *  to: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function withdrawStake(
  options: BaseTransactionOptions<
    | WithdrawStakeParams
    | {
        asyncParams: () => Promise<WithdrawStakeParams>;
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
      return [resolvedOptions.to] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
