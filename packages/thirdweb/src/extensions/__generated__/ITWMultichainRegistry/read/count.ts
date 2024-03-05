import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "count" function.
 */
export type CountParams = {
  deployer: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_deployer";
    type: "address";
  }>;
};

/**
 * Calls the count function on the contract.
 * @param options - The options for the count function.
 * @returns The parsed result of the function call.
 * @extension ITWMULTICHAINREGISTRY
 * @example
 * ```
 * import { count } from "thirdweb/extensions/ITWMultichainRegistry";
 *
 * const result = await count({
 *  deployer: ...,
 * });
 *
 * ```
 */
export async function count(options: BaseTransactionOptions<CountParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0x05d85eda",
      [
        {
          internalType: "address",
          name: "_deployer",
          type: "address",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "deploymentCount",
          type: "uint256",
        },
      ],
    ],
    params: [options.deployer],
  });
}
