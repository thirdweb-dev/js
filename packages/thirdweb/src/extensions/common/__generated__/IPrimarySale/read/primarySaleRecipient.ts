import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "primarySaleRecipient" function on the contract.
 * @param options - The options for the primarySaleRecipient function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```
 * import { primarySaleRecipient } from "thirdweb/extensions/common";
 *
 * const result = await primarySaleRecipient();
 *
 * ```
 */
export async function primarySaleRecipient(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x079fe40e",
      [],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
    ],
    params: [],
  });
}
