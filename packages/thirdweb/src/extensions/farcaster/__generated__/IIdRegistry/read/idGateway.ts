import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0x4b57a600",
  [],
  [
    {
      type: "address",
    },
  ],
] as const;

/**
 * Calls the "idGateway" function on the contract.
 * @param options - The options for the idGateway function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { idGateway } from "thirdweb/extensions/farcaster";
 *
 * const result = await idGateway();
 *
 * ```
 */
export async function idGateway(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
