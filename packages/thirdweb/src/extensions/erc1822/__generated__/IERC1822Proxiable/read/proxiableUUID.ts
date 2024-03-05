import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "proxiableUUID" function on the contract.
 * @param options - The options for the proxiableUUID function.
 * @returns The parsed result of the function call.
 * @extension ERC1822
 * @example
 * ```
 * import { proxiableUUID } from "thirdweb/extensions/erc1822";
 *
 * const result = await proxiableUUID();
 *
 * ```
 */
export async function proxiableUUID(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x52d1902d",
      [],
      [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
    ],
    params: [],
  });
}
