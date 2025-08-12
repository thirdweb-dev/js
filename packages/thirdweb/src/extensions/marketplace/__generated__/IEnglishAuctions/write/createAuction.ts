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
    components: [
      {
        name: "assetContract",
        type: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "quantity",
        type: "uint256",
      },
      {
        name: "currency",
        type: "address",
      },
      {
        name: "minimumBidAmount",
        type: "uint256",
      },
      {
        name: "buyoutBidAmount",
        type: "uint256",
      },
      {
        name: "timeBufferInSeconds",
        type: "uint64",
      },
      {
        name: "bidBufferBps",
        type: "uint64",
      },
      {
        name: "startTimestamp",
        type: "uint64",
      },
      {
        name: "endTimestamp",
        type: "uint64",
      },
    ],
    name: "_params",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "auctionId",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `createAuction` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createAuction` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isCreateAuctionSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isCreateAuctionSupported(["0x..."]);
 * ```
 */
export function isCreateAuctionSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createAuction" function.
 * @param options - The options for the createAuction function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCreateAuctionParams } from "thirdweb/extensions/marketplace";
 * const result = encodeCreateAuctionParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateAuctionParams(options: CreateAuctionParams) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Encodes the "createAuction" function into a Hex string with its parameters.
 * @param options - The options for the createAuction function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCreateAuction } from "thirdweb/extensions/marketplace";
 * const result = encodeCreateAuction({
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateAuction(options: CreateAuctionParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreateAuctionParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createAuction" function on the contract.
 * @param options - The options for the "createAuction" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createAuction } from "thirdweb/extensions/marketplace";
 *
 * const transaction = createAuction({
 *  contract,
 *  params: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
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
      return [resolvedOptions.params] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
