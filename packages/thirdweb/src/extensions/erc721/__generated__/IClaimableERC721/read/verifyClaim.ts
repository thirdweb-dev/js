import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "verifyClaim" function.
 */
export type VerifyClaimParams = {
  claimer: AbiParameterToPrimitiveType<{ type: "address"; name: "_claimer" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
};

const METHOD = [
  "0x2f92023a",
  [
    {
      type: "address",
      name: "_claimer",
    },
    {
      type: "uint256",
      name: "_quantity",
    },
  ],
  [],
] as const;

/**
 * Calls the "verifyClaim" function on the contract.
 * @param options - The options for the verifyClaim function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { verifyClaim } from "thirdweb/extensions/erc721";
 *
 * const result = await verifyClaim({
 *  claimer: ...,
 *  quantity: ...,
 * });
 *
 * ```
 */
export async function verifyClaim(
  options: BaseTransactionOptions<VerifyClaimParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.claimer, options.quantity],
  });
}
