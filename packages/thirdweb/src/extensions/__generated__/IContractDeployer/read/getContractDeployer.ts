import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getContractDeployer" function.
 */
export type GetContractDeployerParams = {
  contract: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_contract";
    type: "address";
  }>;
};

/**
 * Calls the getContractDeployer function on the contract.
 * @param options - The options for the getContractDeployer function.
 * @returns The parsed result of the function call.
 * @extension ICONTRACTDEPLOYER
 * @example
 * ```
 * import { getContractDeployer } from "thirdweb/extensions/IContractDeployer";
 *
 * const result = await getContractDeployer({
 *  contract: ...,
 * });
 *
 * ```
 */
export async function getContractDeployer(
  options: BaseTransactionOptions<GetContractDeployerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xbf775fb2",
      [
        {
          internalType: "address",
          name: "_contract",
          type: "address",
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
    params: [options.contract],
  });
}
