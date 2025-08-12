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
 * Represents the parameters for the "depositRewardTokens" function.
 */
export type DepositRewardTokensParams = WithOverrides<{
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_amount" }>;
}>;

export const FN_SELECTOR = "0x16c621e0" as const;
const FN_INPUTS = [
  {
    name: "_amount",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `depositRewardTokens` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `depositRewardTokens` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isDepositRewardTokensSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = isDepositRewardTokensSupported(["0x..."]);
 * ```
 */
export function isDepositRewardTokensSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "depositRewardTokens" function.
 * @param options - The options for the depositRewardTokens function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeDepositRewardTokensParams } from "thirdweb/extensions/erc1155";
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
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeDepositRewardTokens } from "thirdweb/extensions/erc1155";
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
 * @extension ERC1155
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { depositRewardTokens } from "thirdweb/extensions/erc1155";
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
 * await sendTransaction({ transaction, account });
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
      return [resolvedOptions.amount] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
