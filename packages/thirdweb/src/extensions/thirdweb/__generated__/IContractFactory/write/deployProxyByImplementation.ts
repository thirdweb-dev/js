import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "deployProxyByImplementation" function.
 */
export type DeployProxyByImplementationParams = {
  implementation: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "implementation";
    type: "address";
  }>;
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "data";
    type: "bytes";
  }>;
  salt: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "salt";
    type: "bytes32";
  }>;
};

/**
 * Calls the "deployProxyByImplementation" function on the contract.
 * @param options - The options for the "deployProxyByImplementation" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { deployProxyByImplementation } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = deployProxyByImplementation({
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function deployProxyByImplementation(
  options: BaseTransactionOptions<DeployProxyByImplementationParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x11b804ab",
      [
        {
          internalType: "address",
          name: "implementation",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
        {
          internalType: "bytes32",
          name: "salt",
          type: "bytes32",
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
    params: [options.implementation, options.data, options.salt],
  });
}
