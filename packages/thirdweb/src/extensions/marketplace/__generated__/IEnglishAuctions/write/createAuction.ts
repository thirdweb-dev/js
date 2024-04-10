import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "createAuction" function.
 */
export type CreateAuctionParams = WithOverrides<{
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_params";
    components: [
      { type: "address"; name: "assetContract" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "quantity" },
      { type: "address"; name: "currency" },
      { type: "uint256"; name: "minimumBidAmount" },
      { type: "uint256"; name: "buyoutBidAmount" },
      { type: "uint64"; name: "timeBufferInSeconds" },
      { type: "uint64"; name: "bidBufferBps" },
      { type: "uint64"; name: "startTimestamp" },
      { type: "uint64"; name: "endTimestamp" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x16654d40" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "_params",
    components: [
      {
        type: "address",
        name: "assetContract",
      },
      {
        type: "uint256",
        name: "tokenId",
      },
      {
        type: "uint256",
        name: "quantity",
      },
      {
        type: "address",
        name: "currency",
      },
      {
        type: "uint256",
        name: "minimumBidAmount",
      },
      {
        type: "uint256",
        name: "buyoutBidAmount",
      },
      {
        type: "uint64",
        name: "timeBufferInSeconds",
      },
      {
        type: "uint64",
        name: "bidBufferBps",
      },
      {
        type: "uint64",
        name: "startTimestamp",
      },
      {
        type: "uint64",
        name: "endTimestamp",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "auctionId",
  },
] as const;

/**
 * Encodes the parameters for the "createAuction" function.
 * @param options - The options for the createAuction function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCreateAuctionParams } "thirdweb/extensions/marketplace";
 * const result = encodeCreateAuctionParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateAuctionParams(options: CreateAuctionParams) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Calls the "createAuction" function on the contract.
 * @param options - The options for the "createAuction" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { createAuction } from "thirdweb/extensions/marketplace";
 *
 * const transaction = createAuction({
 *  contract,
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createAuction(
  options: BaseTransactionOptions<
    | CreateAuctionParams
    | {
        asyncParams: () => Promise<CreateAuctionParams>;
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
      return [resolvedOptions.params] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
