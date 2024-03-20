import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "recoveryOf" function.
 */
export type RecoveryOfParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
};

const METHOD = [
  "0xfa1a1b25",
  [
    {
      type: "uint256",
      name: "fid",
    },
  ],
  [
    {
      type: "address",
      name: "recovery",
    },
  ],
] as const;

/**
 * Calls the "recoveryOf" function on the contract.
 * @param options - The options for the recoveryOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { recoveryOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await recoveryOf({
 *  fid: ...,
 * });
 *
 * ```
 */
export async function recoveryOf(
  options: BaseTransactionOptions<RecoveryOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.fid],
  });
}
