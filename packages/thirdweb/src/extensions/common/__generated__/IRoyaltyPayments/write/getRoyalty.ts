import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "getRoyalty" function.
 */
export type GetRoyaltyParams = WithValue<{
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
    type: "address",
    name: "tokenAddress",
  },
  {
    type: "uint256",
    name: "tokenId",
  },
  {
    type: "uint256",
    name: "value",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address[]",
    name: "recipients",
  },
  {
    type: "uint256[]",
    name: "amounts",
  },
] as const;

/**
 * Encodes the parameters for the "getRoyalty" function.
 * @param options - The options for the getRoyalty function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeGetRoyaltyParams } "thirdweb/extensions/common";
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
 * Calls the "getRoyalty" function on the contract.
 * @param options - The options for the "getRoyalty" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { getRoyalty } from "thirdweb/extensions/common";
 *
 * const transaction = getRoyalty({
 *  contract,
 *  tokenAddress: ...,
 *  tokenId: ...,
 *  value: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedParams = await asyncOptions();
      return [
        resolvedParams.tokenAddress,
        resolvedParams.tokenId,
        resolvedParams.value,
      ] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
