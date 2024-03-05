import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the operatorRestriction function on the contract.
 * @param options - The options for the operatorRestriction function.
 * @returns The parsed result of the function call.
 * @extension IOPERATORFILTERTOGGLE
 * @example
 * ```
 * import { operatorRestriction } from "thirdweb/extensions/IOperatorFilterToggle";
 *
 * const result = await operatorRestriction();
 *
 * ```
 */
export async function operatorRestriction(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x504c6e01",
      [],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [],
  });
}
