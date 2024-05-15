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
 * Represents the parameters for the "withdrawStake" function.
 */
export type WithdrawStakeParams = WithOverrides<{
  withdrawAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "withdrawAddress";
  }>;
}>;

export const FN_SELECTOR = "0xc23a5cea" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "withdrawAddress",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `withdrawStake` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `withdrawStake` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isWithdrawStakeSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isWithdrawStakeSupported(contract);
 * ```
 */
export async function isWithdrawStakeSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "withdrawStake" function.
 * @param options - The options for the withdrawStake function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeWithdrawStakeParams } "thirdweb/extensions/erc4337";
 * const result = encodeWithdrawStakeParams({
 *  withdrawAddress: ...,
 * });
 * ```
 */
export function encodeWithdrawStakeParams(options: WithdrawStakeParams) {
  return encodeAbiParameters(FN_INPUTS, [options.withdrawAddress]);
}

/**
 * Encodes the "withdrawStake" function into a Hex string with its parameters.
 * @param options - The options for the withdrawStake function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeWithdrawStake } "thirdweb/extensions/erc4337";
 * const result = encodeWithdrawStake({
 *  withdrawAddress: ...,
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
 * @extension ERC4337
 * @example
 * ```ts
 * import { withdrawStake } from "thirdweb/extensions/erc4337";
 *
 * const transaction = withdrawStake({
 *  contract,
 *  withdrawAddress: ...,
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.withdrawAddress] as const;
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
