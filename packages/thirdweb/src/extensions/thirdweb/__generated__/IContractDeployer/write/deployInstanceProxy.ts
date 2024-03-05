import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "deployInstanceProxy" function.
 */
export type DeployInstanceProxyParams = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
  }>;
  initializeData: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "initializeData";
  }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "salt" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
  publishMetadataUri: AbiParameterToPrimitiveType<{
    type: "string";
    name: "publishMetadataUri";
  }>;
};

/**
 * Calls the "deployInstanceProxy" function on the contract.
 * @param options - The options for the "deployInstanceProxy" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { deployInstanceProxy } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = deployInstanceProxy({
 *  publisher: ...,
 *  implementation: ...,
 *  initializeData: ...,
 *  salt: ...,
 *  value: ...,
 *  publishMetadataUri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function deployInstanceProxy(
  options: BaseTransactionOptions<DeployInstanceProxyParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x9e69e62f",
      [
        {
          type: "address",
          name: "publisher",
        },
        {
          type: "address",
          name: "implementation",
        },
        {
          type: "bytes",
          name: "initializeData",
        },
        {
          type: "bytes32",
          name: "salt",
        },
        {
          type: "uint256",
          name: "value",
        },
        {
          type: "string",
          name: "publishMetadataUri",
        },
      ],
      [
        {
          type: "address",
          name: "deployedAddress",
        },
      ],
    ],
    params: [
      options.publisher,
      options.implementation,
      options.initializeData,
      options.salt,
      options.value,
      options.publishMetadataUri,
    ],
  });
}
