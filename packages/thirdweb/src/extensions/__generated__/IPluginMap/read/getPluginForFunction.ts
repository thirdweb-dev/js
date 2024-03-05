import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getPluginForFunction" function.
 */
export type GetPluginForFunctionParams = {
  functionSelector: AbiParameterToPrimitiveType<{
    internalType: "bytes4";
    name: "functionSelector";
    type: "bytes4";
  }>;
};

/**
 * Calls the getPluginForFunction function on the contract.
 * @param options - The options for the getPluginForFunction function.
 * @returns The parsed result of the function call.
 * @extension IPLUGINMAP
 * @example
 * ```
 * import { getPluginForFunction } from "thirdweb/extensions/IPluginMap";
 *
 * const result = await getPluginForFunction({
 *  functionSelector: ...,
 * });
 *
 * ```
 */
export async function getPluginForFunction(
  options: BaseTransactionOptions<GetPluginForFunctionParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xa520a38a",
      [
        {
          internalType: "bytes4",
          name: "functionSelector",
          type: "bytes4",
        },
      ],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
    ],
    params: [options.functionSelector],
  });
}
