import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "keyAt" function.
 */
export type KeyAtParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  state: AbiParameterToPrimitiveType<{ type: "uint8"; name: "state" }>;
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "index" }>;
};

/**
 * Calls the "keyAt" function on the contract.
 * @param options - The options for the keyAt function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { keyAt } from "thirdweb/extensions/farcaster";
 *
 * const result = await keyAt({
 *  fid: ...,
 *  state: ...,
 *  index: ...,
 * });
 *
 * ```
 */
export async function keyAt(options: BaseTransactionOptions<KeyAtParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0x0ea9442c",
      [
        {
          type: "uint256",
          name: "fid",
        },
        {
          type: "uint8",
          name: "state",
        },
        {
          type: "uint256",
          name: "index",
        },
      ],
      [
        {
          type: "bytes",
        },
      ],
    ],
    params: [options.fid, options.state, options.index],
  });
}
