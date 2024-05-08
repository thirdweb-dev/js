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
 * Represents the parameters for the "withdrawTo" function.
 */
export type WithdrawToParams = WithOverrides<{
  withdrawAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "withdrawAddress";
  }>;
  withdrawAmount: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "withdrawAmount";
  }>;
}>;

export const FN_SELECTOR = "0x205c2878" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "withdrawAddress",
  },
  {
    type: "uint256",
    name: "withdrawAmount",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `withdrawTo` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `withdrawTo` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isWithdrawToSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isWithdrawToSupported(contract);
 * ```
 */
export async function isWithdrawToSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "withdrawTo" function.
 * @param options - The options for the withdrawTo function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeWithdrawToParams } "thirdweb/extensions/erc4337";
 * const result = encodeWithdrawToParams({
 *  withdrawAddress: ...,
 *  withdrawAmount: ...,
 * });
 * ```
 */
export function encodeWithdrawToParams(options: WithdrawToParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.withdrawAddress,
    options.withdrawAmount,
  ]);
}

/**
 * Encodes the "withdrawTo" function into a Hex string with its parameters.
 * @param options - The options for the withdrawTo function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeWithdrawTo } "thirdweb/extensions/erc4337";
 * const result = encodeWithdrawTo({
 *  withdrawAddress: ...,
 *  withdrawAmount: ...,
 * });
 * ```
 */
export function encodeWithdrawTo(options: WithdrawToParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeWithdrawToParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "withdrawTo" function on the contract.
 * @param options - The options for the "withdrawTo" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { withdrawTo } from "thirdweb/extensions/erc4337";
 *
 * const transaction = withdrawTo({
 *  contract,
 *  withdrawAddress: ...,
 *  withdrawAmount: ...,
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
export function withdrawTo(
  options: BaseTransactionOptions<
    | WithdrawToParams
    | {
        asyncParams: () => Promise<WithdrawToParams>;
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
        resolvedOptions.withdrawAddress,
        resolvedOptions.withdrawAmount,
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
