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
 * Represents the parameters for the "depositRewardTokens" function.
 */
export type DepositRewardTokensParams = WithOverrides<{
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_amount" }>;
}>;

export const FN_SELECTOR = "0x16c621e0" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_amount",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `depositRewardTokens` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `depositRewardTokens` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isDepositRewardTokensSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = await isDepositRewardTokensSupported(contract);
 * ```
 */
export async function isDepositRewardTokensSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "depositRewardTokens" function.
 * @param options - The options for the depositRewardTokens function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeDepositRewardTokensParams } "thirdweb/extensions/erc20";
 * const result = encodeDepositRewardTokensParams({
 *  amount: ...,
 * });
 * ```
 */
export function encodeDepositRewardTokensParams(
  options: DepositRewardTokensParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.amount]);
}

/**
 * Encodes the "depositRewardTokens" function into a Hex string with its parameters.
 * @param options - The options for the depositRewardTokens function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeDepositRewardTokens } "thirdweb/extensions/erc20";
 * const result = encodeDepositRewardTokens({
 *  amount: ...,
 * });
 * ```
 */
export function encodeDepositRewardTokens(options: DepositRewardTokensParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDepositRewardTokensParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "depositRewardTokens" function on the contract.
 * @param options - The options for the "depositRewardTokens" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { depositRewardTokens } from "thirdweb/extensions/erc20";
 *
 * const transaction = depositRewardTokens({
 *  contract,
 *  amount: ...,
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
export function depositRewardTokens(
  options: BaseTransactionOptions<
    | DepositRewardTokensParams
    | {
        asyncParams: () => Promise<DepositRewardTokensParams>;
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
      return [resolvedOptions.amount] as const;
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
