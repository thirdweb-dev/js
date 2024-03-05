import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "remove" function.
 */
export type RemoveParams = {
  deployer: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_deployer";
    type: "address";
  }>;
  deployment: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_deployment";
    type: "address";
  }>;
  chainId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_chainId";
    type: "uint256";
  }>;
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
          internalType: "address",
          name: "_deployer",
          type: "address",
        },
        {
          internalType: "address",
          name: "_deployment",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_chainId",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.deployer, options.deployment, options.chainId],
  });
}
