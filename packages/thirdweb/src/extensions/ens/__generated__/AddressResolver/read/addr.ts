import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "addr" function.
 */
export type AddrParams = {
  name: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "name" }>;
};

const METHOD = [
  "0x3b3b57de",
  [
    {
      type: "bytes32",
      name: "name",
    },
  ],
  [
    {
      type: "address",
    },
  ],
] as const;

/**
 * Calls the "addr" function on the contract.
 * @param options - The options for the addr function.
 * @returns The parsed result of the function call.
 * @extension ENS
 * @example
 * ```
 * import { addr } from "thirdweb/extensions/ens";
 *
 * const result = await addr({
 *  name: ...,
 * });
 *
 * ```
 */
export async function addr(options: BaseTransactionOptions<AddrParams>) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.name],
  });
}
