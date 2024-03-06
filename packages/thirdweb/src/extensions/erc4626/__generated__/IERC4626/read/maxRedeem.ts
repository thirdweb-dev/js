import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "maxRedeem" function.
 */
export type MaxRedeemParams = {
  owner: AbiParameterToPrimitiveType<{
    name: "owner";
    type: "address";
    internalType: "address";
  }>;
};

/**
 * Calls the "maxRedeem" function on the contract.
 * @param options - The options for the maxRedeem function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```
 * import { maxRedeem } from "thirdweb/extensions/erc4626";
 *
 * const result = await maxRedeem({
 *  owner: ...,
 * });
 *
 * ```
 */
export async function maxRedeem(
  options: BaseTransactionOptions<MaxRedeemParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xd905777e",
      [
        {
          name: "owner",
          type: "address",
          internalType: "address",
        },
      ],
      [
        {
          name: "maxShares",
          type: "uint256",
          internalType: "uint256",
        },
      ],
    ],
    params: [options.owner],
  });
}
