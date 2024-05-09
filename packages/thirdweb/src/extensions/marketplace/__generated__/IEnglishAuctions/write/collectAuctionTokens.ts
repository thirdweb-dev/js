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
 * Represents the parameters for the "collectAuctionTokens" function.
 */
export type CollectAuctionTokensParams = WithOverrides<{
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
}>;

export const FN_SELECTOR = "0x03a54fe0" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_auctionId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `collectAuctionTokens` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `collectAuctionTokens` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isCollectAuctionTokensSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = await isCollectAuctionTokensSupported(contract);
 * ```
 */
export async function isCollectAuctionTokensSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "collectAuctionTokens" function.
 * @param options - The options for the collectAuctionTokens function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCollectAuctionTokensParams } "thirdweb/extensions/marketplace";
 * const result = encodeCollectAuctionTokensParams({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeCollectAuctionTokensParams(
  options: CollectAuctionTokensParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId]);
}

/**
 * Encodes the "collectAuctionTokens" function into a Hex string with its parameters.
 * @param options - The options for the collectAuctionTokens function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCollectAuctionTokens } "thirdweb/extensions/marketplace";
 * const result = encodeCollectAuctionTokens({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeCollectAuctionTokens(
  options: CollectAuctionTokensParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCollectAuctionTokensParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "collectAuctionTokens" function on the contract.
 * @param options - The options for the "collectAuctionTokens" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { collectAuctionTokens } from "thirdweb/extensions/marketplace";
 *
 * const transaction = collectAuctionTokens({
 *  contract,
 *  auctionId: ...,
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
export function collectAuctionTokens(
  options: BaseTransactionOptions<
    | CollectAuctionTokensParams
    | {
        asyncParams: () => Promise<CollectAuctionTokensParams>;
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
      return [resolvedOptions.auctionId] as const;
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
