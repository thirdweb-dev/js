import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAllFunctionsOfPlugin" function.
 */
export type GetAllFunctionsOfPluginParams = {
  pluginAddress: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "pluginAddress";
    type: "address";
  }>;
};

/**
 * Calls the getAllFunctionsOfPlugin function on the contract.
 * @param options - The options for the getAllFunctionsOfPlugin function.
 * @returns The parsed result of the function call.
 * @extension IPLUGINMAP
 * @example
 * ```
 * import { getAllFunctionsOfPlugin } from "thirdweb/extensions/IPluginMap";
 *
 * const result = await getAllFunctionsOfPlugin({
 *  pluginAddress: ...,
 * });
 *
 * ```
 */
export async function getAllFunctionsOfPlugin(
  options: BaseTransactionOptions<GetAllFunctionsOfPluginParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x5c573f2e",
      [
        {
          internalType: "address",
          name: "pluginAddress",
          type: "address",
        },
      ],
      [
        {
          internalType: "bytes4[]",
          name: "",
          type: "bytes4[]",
        },
      ],
    ],
    params: [options.pluginAddress],
  });
}
