import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "price" function.
 */
export type PriceParams = {
  units: AbiParameterToPrimitiveType<{ type: "uint256"; name: "units" }>;
};

/**
 * Calls the "price" function on the contract.
 * @param options - The options for the price function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { price } from "thirdweb/extensions/farcaster";
 *
 * const result = await price({
 *  units: ...,
 * });
 *
 * ```
 */
export async function price(options: BaseTransactionOptions<PriceParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0x26a49e37",
      [
        {
          type: "uint256",
          name: "units",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [options.units],
  });
}
