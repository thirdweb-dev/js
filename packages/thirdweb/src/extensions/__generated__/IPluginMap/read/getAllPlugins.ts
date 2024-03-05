import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the getAllPlugins function on the contract.
 * @param options - The options for the getAllPlugins function.
 * @returns The parsed result of the function call.
 * @extension IPLUGINMAP
 * @example
 * ```
 * import { getAllPlugins } from "thirdweb/extensions/IPluginMap";
 *
 * const result = await getAllPlugins();
 *
 * ```
 */
export async function getAllPlugins(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x6b86400e",
      [],
      [
        {
          components: [
            {
              internalType: "bytes4",
              name: "functionSelector",
              type: "bytes4",
            },
            {
              internalType: "string",
              name: "functionSignature",
              type: "string",
            },
            {
              internalType: "address",
              name: "pluginAddress",
              type: "address",
            },
          ],
          internalType: "struct IPluginMap.Plugin[]",
          name: "",
          type: "tuple[]",
        },
      ],
    ],
    params: [],
  });
}
