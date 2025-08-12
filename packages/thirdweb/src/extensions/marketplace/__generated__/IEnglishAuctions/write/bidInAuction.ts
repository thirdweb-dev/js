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
 * Represents the parameters for the "bidInAuction" function.
 */
export type BidInAuctionParams = WithOverrides<{
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
  bidAmount: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_bidAmount";
  }>;
}>;

export const FN_SELECTOR = "0x0858e5ad" as const;
const FN_INPUTS = [
  {
    name: "_auctionId",
    type: "uint256",
  },
  {
    name: "_bidAmount",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `bidInAuction` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `bidInAuction` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isBidInAuctionSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isBidInAuctionSupported(["0x..."]);
 * ```
 */
export function isBidInAuctionSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "bidInAuction" function.
 * @param options - The options for the bidInAuction function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeBidInAuctionParams } from "thirdweb/extensions/marketplace";
 * const result = encodeBidInAuctionParams({
 *  auctionId: ...,
 *  bidAmount: ...,
 * });
 * ```
 */
export function encodeBidInAuctionParams(options: BidInAuctionParams) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId, options.bidAmount]);
}

/**
 * Encodes the "bidInAuction" function into a Hex string with its parameters.
 * @param options - The options for the bidInAuction function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeBidInAuction } from "thirdweb/extensions/marketplace";
 * const result = encodeBidInAuction({
 *  auctionId: ...,
 *  bidAmount: ...,
 * });
 * ```
 */
export function encodeBidInAuction(options: BidInAuctionParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeBidInAuctionParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "bidInAuction" function on the contract.
 * @param options - The options for the "bidInAuction" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { bidInAuction } from "thirdweb/extensions/marketplace";
 *
 * const transaction = bidInAuction({
 *  contract,
 *  auctionId: ...,
 *  bidAmount: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function bidInAuction(
  options: BaseTransactionOptions<
    | BidInAuctionParams
    | {
        asyncParams: () => Promise<BidInAuctionParams>;
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
      return [resolvedOptions.auctionId, resolvedOptions.bidAmount] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
