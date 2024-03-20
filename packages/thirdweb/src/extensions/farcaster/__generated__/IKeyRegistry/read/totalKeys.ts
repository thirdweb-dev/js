import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "totalKeys" function.
 */
export type TotalKeysParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  state: AbiParameterToPrimitiveType<{ type: "uint8"; name: "state" }>;
};

const METHOD = [
  "0x6840b75e",
  [
    {
      type: "uint256",
      name: "fid",
    },
    {
      type: "uint8",
      name: "state",
    },
  ],
  [
    {
      type: "uint256",
    },
  ],
] as const;

/**
 * Calls the "totalKeys" function on the contract.
 * @param options - The options for the totalKeys function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { totalKeys } from "thirdweb/extensions/farcaster";
 *
 * const result = await totalKeys({
 *  fid: ...,
 *  state: ...,
 * });
 *
 * ```
 */
export async function totalKeys(
  options: BaseTransactionOptions<TotalKeysParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.fid, options.state],
  });
}
