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
 * Represents the parameters for the "claimReward" function.
 */
export type ClaimRewardParams = WithOverrides<{
  asset: AbiParameterToPrimitiveType<{ type: "address"; name: "asset" }>;
}>;

export const FN_SELECTOR = "0xd279c191" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "asset",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `claimReward` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `claimReward` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isClaimRewardSupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isClaimRewardSupported(["0x..."]);
 * ```
 */
export function isClaimRewardSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "claimReward" function.
 * @param options - The options for the claimReward function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeClaimRewardParams } from "thirdweb/extensions/tokens";
 * const result = encodeClaimRewardParams({
 *  asset: ...,
 * });
 * ```
 */
export function encodeClaimRewardParams(options: ClaimRewardParams) {
  return encodeAbiParameters(FN_INPUTS, [options.asset]);
}

/**
 * Encodes the "claimReward" function into a Hex string with its parameters.
 * @param options - The options for the claimReward function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeClaimReward } from "thirdweb/extensions/tokens";
 * const result = encodeClaimReward({
 *  asset: ...,
 * });
 * ```
 */
export function encodeClaimReward(options: ClaimRewardParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeClaimRewardParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "claimReward" function on the contract.
 * @param options - The options for the "claimReward" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { claimReward } from "thirdweb/extensions/tokens";
 *
 * const transaction = claimReward({
 *  contract,
 *  asset: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function claimReward(
  options: BaseTransactionOptions<
    | ClaimRewardParams
    | {
        asyncParams: () => Promise<ClaimRewardParams>;
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
      return [resolvedOptions.asset] as const;
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
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
  });
}
