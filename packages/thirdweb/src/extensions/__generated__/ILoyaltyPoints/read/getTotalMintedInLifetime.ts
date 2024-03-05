import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getTotalMintedInLifetime" function.
 */
export type GetTotalMintedInLifetimeParams = {
  owner: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "owner";
    type: "address";
  }>;
};

/**
 * Calls the getTotalMintedInLifetime function on the contract.
 * @param options - The options for the getTotalMintedInLifetime function.
 * @returns The parsed result of the function call.
 * @extension ILOYALTYPOINTS
 * @example
 * ```
 * import { getTotalMintedInLifetime } from "thirdweb/extensions/ILoyaltyPoints";
 *
 * const result = await getTotalMintedInLifetime({
 *  owner: ...,
 * });
 *
 * ```
 */
export async function getTotalMintedInLifetime(
  options: BaseTransactionOptions<GetTotalMintedInLifetimeParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xa1699dc8",
      [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [options.owner],
  });
}
