import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "multicall" function.
 */
export type MulticallParams = {
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes[]";
    name: "data";
    type: "bytes[]";
  }>;
};

/**
 * Calls the "multicall" function on the contract.
 * @param options - The options for the "multicall" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { multicall } from "thirdweb/extensions/erc4337";
 *
 * const transaction = multicall({
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function multicall(options: BaseTransactionOptions<MulticallParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xac9650d8",
      [
        {
          internalType: "bytes[]",
          name: "data",
          type: "bytes[]",
        },
      ],
      [
        {
          internalType: "bytes[]",
          name: "results",
          type: "bytes[]",
        },
      ],
    ],
    params: [options.data],
  });
}
