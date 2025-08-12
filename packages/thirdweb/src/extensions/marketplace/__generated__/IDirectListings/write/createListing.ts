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
 * Represents the parameters for the "createListing" function.
 */
export type CreateListingParams = WithOverrides<{
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_params";
    components: [
      { type: "address"; name: "assetContract" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "quantity" },
      { type: "address"; name: "currency" },
      { type: "uint256"; name: "pricePerToken" },
      { type: "uint128"; name: "startTimestamp" },
      { type: "uint128"; name: "endTimestamp" },
      { type: "bool"; name: "reserved" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x746415b5" as const;
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
        name: "pricePerToken",
        type: "uint256",
      },
      {
        name: "startTimestamp",
        type: "uint128",
      },
      {
        name: "endTimestamp",
        type: "uint128",
      },
      {
        name: "reserved",
        type: "bool",
      },
    ],
    name: "_params",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "listingId",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `createListing` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createListing` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isCreateListingSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isCreateListingSupported(["0x..."]);
 * ```
 */
export function isCreateListingSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createListing" function.
 * @param options - The options for the createListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCreateListingParams } from "thirdweb/extensions/marketplace";
 * const result = encodeCreateListingParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateListingParams(options: CreateListingParams) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Encodes the "createListing" function into a Hex string with its parameters.
 * @param options - The options for the createListing function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCreateListing } from "thirdweb/extensions/marketplace";
 * const result = encodeCreateListing({
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateListing(options: CreateListingParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreateListingParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createListing" function on the contract.
 * @param options - The options for the "createListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = createListing({
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
export function createListing(
  options: BaseTransactionOptions<
    | CreateListingParams
    | {
        asyncParams: () => Promise<CreateListingParams>;
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
