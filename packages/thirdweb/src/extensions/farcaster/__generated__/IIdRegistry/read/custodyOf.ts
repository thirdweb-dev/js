import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "custodyOf" function.
 */
export type CustodyOfParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
};

const METHOD = [
  "0x65269e47",
  [
    {
      type: "uint256",
      name: "fid",
    },
  ],
  [
    {
      type: "address",
      name: "owner",
    },
  ],
] as const;

/**
 * Calls the "custodyOf" function on the contract.
 * @param options - The options for the custodyOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { custodyOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await custodyOf({
 *  fid: ...,
 * });
 *
 * ```
 */
export async function custodyOf(
  options: BaseTransactionOptions<CustodyOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.fid],
  });
}
