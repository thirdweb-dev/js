import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the getAllExtensions function on the contract.
 * @param options - The options for the getAllExtensions function.
 * @returns The parsed result of the function call.
 * @extension IROUTERSTATE
 * @example
 * ```
 * import { getAllExtensions } from "thirdweb/extensions/IRouterState";
 *
 * const result = await getAllExtensions();
 *
 * ```
 */
export async function getAllExtensions(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x4a00cc48",
      [],
      [
        {
          components: [
            {
              components: [
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "metadataURI",
                  type: "string",
                },
                {
                  internalType: "address",
                  name: "implementation",
                  type: "address",
                },
              ],
              internalType: "struct IExtension.ExtensionMetadata",
              name: "metadata",
              type: "tuple",
            },
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
              ],
              internalType: "struct IExtension.ExtensionFunction[]",
              name: "functions",
              type: "tuple[]",
            },
          ],
          internalType: "struct IExtension.Extension[]",
          name: "allExtensions",
          type: "tuple[]",
        },
      ],
    ],
    params: [],
  });
}
