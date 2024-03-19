import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "price" function.
 */
export type PriceParams = {
  extraStorage: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "extraStorage";
  }>;
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
 *  extraStorage: ...,
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
          name: "extraStorage",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [options.extraStorage],
  });
}
