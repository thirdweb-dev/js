import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "count" function.
 */
export type CountParams = {
  deployer: AbiParameterToPrimitiveType<{ type: "address"; name: "_deployer" }>;
};

const METHOD = [
  "0x05d85eda",
  [
    {
      type: "address",
      name: "_deployer",
    },
  ],
  [
    {
      type: "uint256",
      name: "deploymentCount",
    },
  ],
] as const;

/**
 * Calls the "count" function on the contract.
 * @param options - The options for the count function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
 * import { count } from "thirdweb/extensions/thirdweb";
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
    method: METHOD,
    params: [options.deployer],
  });
}
