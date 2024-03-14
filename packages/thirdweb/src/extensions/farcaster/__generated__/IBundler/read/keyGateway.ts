import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "keyGateway" function on the contract.
 * @param options - The options for the keyGateway function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { keyGateway } from "thirdweb/extensions/farcaster";
 *
 * const result = await keyGateway();
 *
 * ```
 */
export async function keyGateway(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x80334737",
      [],
      [
        {
          type: "address",
        },
      ],
    ],
    params: [],
  });
}
