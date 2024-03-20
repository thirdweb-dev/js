import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "keyDataOf" function.
 */
export type KeyDataOfParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
};

const METHOD = [
  "0xac34cc5a",
  [
    {
      type: "uint256",
      name: "fid",
    },
    {
      type: "bytes",
      name: "key",
    },
  ],
  [
    {
      type: "address",
    },
  ],
] as const;

/**
 * Calls the "keyDataOf" function on the contract.
 * @param options - The options for the keyDataOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { keyDataOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await keyDataOf({
 *  fid: ...,
 *  key: ...,
 * });
 *
 * ```
 */
export async function keyDataOf(
  options: BaseTransactionOptions<KeyDataOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.fid, options.key],
  });
}
