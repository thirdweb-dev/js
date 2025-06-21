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
 * Represents the parameters for the "getRoyalty" function.
 */
export type GetRoyaltyParams = WithOverrides<{
  tokenAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "tokenAddress";
  }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
}>;

export const FN_SELECTOR = "0xf533b802" as const;
const FN_INPUTS = [
  {
    name: "tokenAddress",
    type: "address",
  },
  {
    name: "tokenId",
    type: "uint256",
  },
  {
    name: "value",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "recipients",
    type: "address[]",
  },
  {
    name: "amounts",
    type: "uint256[]",
  },
] as const;

/**
 * Checks if the `getRoyalty` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getRoyalty` method is supported.
 * @extension COMMON
 * @example
 * ```ts
 * import { isGetRoyaltySupported } from "thirdweb/extensions/common";
 *
 * const supported = isGetRoyaltySupported(["0x..."]);
 * ```
 */
export function isGetRoyaltySupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getRoyalty" function.
 * @param options - The options for the getRoyalty function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeGetRoyaltyParams } from "thirdweb/extensions/common";
 * const result = encodeGetRoyaltyParams({
 *  tokenAddress: ...,
 *  tokenId: ...,
 *  value: ...,
 * });
 * ```
 */
export function encodeGetRoyaltyParams(options: GetRoyaltyParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenAddress,
    options.tokenId,
    options.value,
  ]);
}

/**
 * Encodes the "getRoyalty" function into a Hex string with its parameters.
 * @param options - The options for the getRoyalty function.
 * @returns The encoded hexadecimal string.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeGetRoyalty } from "thirdweb/extensions/common";
 * const result = encodeGetRoyalty({
 *  tokenAddress: ...,
 *  tokenId: ...,
 *  value: ...,
 * });
 * ```
 */
export function encodeGetRoyalty(options: GetRoyaltyParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetRoyaltyParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "getRoyalty" function on the contract.
 * @param options - The options for the "getRoyalty" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { getRoyalty } from "thirdweb/extensions/common";
 *
 * const transaction = getRoyalty({
 *  contract,
 *  tokenAddress: ...,
 *  tokenId: ...,
 *  value: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function getRoyalty(
  options: BaseTransactionOptions<
    | GetRoyaltyParams
    | {
        asyncParams: () => Promise<GetRoyaltyParams>;
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
        resolvedOptions.tokenAddress,
        resolvedOptions.tokenId,
        resolvedOptions.value,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
