import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "keysOf" function.
 */
export type KeysOfParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  state: AbiParameterToPrimitiveType<{ type: "uint8"; name: "state" }>;
};

/**
 * Calls the "keysOf" function on the contract.
 * @param options - The options for the keysOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { keysOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await keysOf({
 *  fid: ...,
 *  state: ...,
 * });
 *
 * ```
 */
export async function keysOf(options: BaseTransactionOptions<KeysOfParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0x1f64222f",
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
          type: "bytes[]",
        },
      ],
    ],
    params: [options.fid, options.state],
  });
}
