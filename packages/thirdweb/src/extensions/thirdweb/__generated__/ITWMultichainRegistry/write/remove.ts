import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "remove" function.
 */
export type RemoveParams = {
  deployer: AbiParameterToPrimitiveType<{ type: "address"; name: "_deployer" }>;
  deployment: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_deployment";
  }>;
  chainId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_chainId" }>;
};

/**
 * Calls the "remove" function on the contract.
 * @param options - The options for the "remove" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { remove } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = remove({
 *  deployer: ...,
 *  deployment: ...,
 *  chainId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function remove(options: BaseTransactionOptions<RemoveParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x59e5fd04",
      [
        {
          type: "address",
          name: "_deployer",
        },
        {
          type: "address",
          name: "_deployment",
        },
        {
          type: "uint256",
          name: "_chainId",
        },
      ],
      [],
    ],
    params: [options.deployer, options.deployment, options.chainId],
  });
}
