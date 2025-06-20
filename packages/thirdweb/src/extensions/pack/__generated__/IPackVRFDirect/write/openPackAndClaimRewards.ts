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
 * Represents the parameters for the "openPackAndClaimRewards" function.
 */
export type OpenPackAndClaimRewardsParams = WithOverrides<{
  packId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_packId" }>;
  amountToOpen: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_amountToOpen";
  }>;
  callBackGasLimit: AbiParameterToPrimitiveType<{
    type: "uint32";
    name: "_callBackGasLimit";
  }>;
}>;

export const FN_SELECTOR = "0xac296b3f" as const;
const FN_INPUTS = [
  {
    name: "_packId",
    type: "uint256",
  },
  {
    name: "_amountToOpen",
    type: "uint256",
  },
  {
    name: "_callBackGasLimit",
    type: "uint32",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `openPackAndClaimRewards` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `openPackAndClaimRewards` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isOpenPackAndClaimRewardsSupported } from "thirdweb/extensions/pack";
 *
 * const supported = isOpenPackAndClaimRewardsSupported(["0x..."]);
 * ```
 */
export function isOpenPackAndClaimRewardsSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "openPackAndClaimRewards" function.
 * @param options - The options for the openPackAndClaimRewards function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeOpenPackAndClaimRewardsParams } from "thirdweb/extensions/pack";
 * const result = encodeOpenPackAndClaimRewardsParams({
 *  packId: ...,
 *  amountToOpen: ...,
 *  callBackGasLimit: ...,
 * });
 * ```
 */
export function encodeOpenPackAndClaimRewardsParams(
  options: OpenPackAndClaimRewardsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.packId,
    options.amountToOpen,
    options.callBackGasLimit,
  ]);
}

/**
 * Encodes the "openPackAndClaimRewards" function into a Hex string with its parameters.
 * @param options - The options for the openPackAndClaimRewards function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeOpenPackAndClaimRewards } from "thirdweb/extensions/pack";
 * const result = encodeOpenPackAndClaimRewards({
 *  packId: ...,
 *  amountToOpen: ...,
 *  callBackGasLimit: ...,
 * });
 * ```
 */
export function encodeOpenPackAndClaimRewards(
  options: OpenPackAndClaimRewardsParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeOpenPackAndClaimRewardsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "openPackAndClaimRewards" function on the contract.
 * @param options - The options for the "openPackAndClaimRewards" function.
 * @returns A prepared transaction object.
 * @extension PACK
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { openPackAndClaimRewards } from "thirdweb/extensions/pack";
 *
 * const transaction = openPackAndClaimRewards({
 *  contract,
 *  packId: ...,
 *  amountToOpen: ...,
 *  callBackGasLimit: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function openPackAndClaimRewards(
  options: BaseTransactionOptions<
    | OpenPackAndClaimRewardsParams
    | {
        asyncParams: () => Promise<OpenPackAndClaimRewardsParams>;
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
        resolvedOptions.packId,
        resolvedOptions.amountToOpen,
        resolvedOptions.callBackGasLimit,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
