import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAll" function.
 */
export type GetAllParams = {
  deployer: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_deployer";
    type: "address";
  }>;
};

/**
 * Calls the getAll function on the contract.
 * @param options - The options for the getAll function.
 * @returns The parsed result of the function call.
 * @extension ITWREGISTRY
 * @example
 * ```
 * import { getAll } from "thirdweb/extensions/ITWRegistry";
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
          internalType: "address",
          name: "_deployer",
          type: "address",
        },
      ],
      [
        {
          components: [
            {
              internalType: "address",
              name: "deploymentAddress",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "chainId",
              type: "uint256",
            },
          ],
          internalType: "struct ITWRegistry.Deployment[]",
          name: "allDeployments",
          type: "tuple[]",
        },
      ],
    ],
    params: [options.deployer],
  });
}
