import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "resolve" function.
 */
export type ResolveParams = {
  name: AbiParameterToPrimitiveType<{ type: "bytes"; name: "name" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

/**
 * Calls the "resolve" function on the contract.
 * @param options - The options for the resolve function.
 * @returns The parsed result of the function call.
 * @extension ENS
 * @example
 * ```
 * import { resolve } from "thirdweb/extensions/ens";
 *
 * const result = await resolve({
 *  name: ...,
 *  data: ...,
 * });
 *
 * ```
 */
export async function resolve(options: BaseTransactionOptions<ResolveParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0x9061b923",
      [
        {
          type: "bytes",
          name: "name",
        },
        {
          type: "bytes",
          name: "data",
        },
      ],
      [
        {
          type: "bytes",
        },
        {
          type: "address",
        },
      ],
    ],
    params: [options.name, options.data],
  });
}
