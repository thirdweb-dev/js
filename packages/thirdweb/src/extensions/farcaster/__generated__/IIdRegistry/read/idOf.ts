import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "idOf" function.
 */
export type IdOfParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
};

const METHOD = [
  "0xd94fe832",
  [
    {
      type: "address",
      name: "owner",
    },
  ],
  [
    {
      type: "uint256",
      name: "fid",
    },
  ],
] as const;

/**
 * Calls the "idOf" function on the contract.
 * @param options - The options for the idOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { idOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await idOf({
 *  owner: ...,
 * });
 *
 * ```
 */
export async function idOf(options: BaseTransactionOptions<IdOfParams>) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.owner],
  });
}
