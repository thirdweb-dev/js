import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the appURI function on the contract.
 * @param options - The options for the appURI function.
 * @returns The parsed result of the function call.
 * @extension IAPPURI
 * @example
 * ```
 * import { appURI } from "thirdweb/extensions/IAppURI";
 *
 * const result = await appURI();
 *
 * ```
 */
export async function appURI(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x094ec830",
      [],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [],
  });
}
