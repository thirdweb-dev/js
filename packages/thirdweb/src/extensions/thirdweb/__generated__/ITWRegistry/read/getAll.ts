import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAll" function.
 */
export type GetAllParams = {
  deployer: AbiParameterToPrimitiveType<{ type: "address"; name: "_deployer" }>;
};

/**
 * Calls the "getAll" function on the contract.
 * @param options - The options for the getAll function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
 * import { getAll } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getAll({
 *  deployer: ...,
 * });
 *
 * ```
 */
export async function getAll(options: BaseTransactionOptions<GetAllParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0xeb077342",
      [
        {
          type: "address",
          name: "_deployer",
        },
      ],
      [
        {
          type: "tuple[]",
          name: "allDeployments",
          components: [
            {
              type: "address",
              name: "deploymentAddress",
            },
            {
              type: "uint256",
              name: "chainId",
            },
          ],
        },
      ],
    ],
    params: [options.deployer],
  });
}
