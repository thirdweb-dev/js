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
    type: "uint256",
    name: "_packId",
  },
  {
    type: "uint256",
    name: "_amountToOpen",
  },
  {
    type: "uint32",
    name: "_callBackGasLimit",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `openPackAndClaimRewards` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `openPackAndClaimRewards` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isOpenPackAndClaimRewardsSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = await isOpenPackAndClaimRewardsSupported(contract);
 * ```
 */
export async function isOpenPackAndClaimRewardsSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "openPackAndClaimRewards" function.
 * @param options - The options for the openPackAndClaimRewards function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeOpenPackAndClaimRewardsParams } "thirdweb/extensions/erc1155";
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
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeOpenPackAndClaimRewards } "thirdweb/extensions/erc1155";
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
 * @extension ERC1155
 * @example
 * ```ts
 * import { openPackAndClaimRewards } from "thirdweb/extensions/erc1155";
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
 * ...
 *
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.packId,
        resolvedOptions.amountToOpen,
        resolvedOptions.callBackGasLimit,
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
