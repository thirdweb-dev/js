import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getRoyaltyInfoForToken" function.
 */
export type GetRoyaltyInfoForTokenParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

const METHOD = [
  "0x4cc157df",
  [
    {
      type: "uint256",
      name: "tokenId",
    },
  ],
  [
    {
      type: "address",
    },
    {
      type: "uint16",
    },
  ],
] as const;

/**
 * Calls the "getRoyaltyInfoForToken" function on the contract.
 * @param options - The options for the getRoyaltyInfoForToken function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```
 * import { getRoyaltyInfoForToken } from "thirdweb/extensions/common";
 *
 * const result = await getRoyaltyInfoForToken({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getRoyaltyInfoForToken(
  options: BaseTransactionOptions<GetRoyaltyInfoForTokenParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.tokenId],
  });
}
