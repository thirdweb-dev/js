import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "deployInstanceProxy" function.
 */
export type DeployInstanceProxyParams = {
  publisher: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "publisher";
    type: "address";
  }>;
  implementation: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "implementation";
    type: "address";
  }>;
  initializeData: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "initializeData";
    type: "bytes";
  }>;
  salt: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "salt";
    type: "bytes32";
  }>;
  value: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "value";
    type: "uint256";
  }>;
  publishMetadataUri: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "publishMetadataUri";
    type: "string";
  }>;
};

/**
 * Calls the deployInstanceProxy function on the contract.
 * @param options - The options for the deployInstanceProxy function.
 * @returns A prepared transaction object.
 * @extension ICONTRACTDEPLOYER
 * @example
 * ```
 * import { deployInstanceProxy } from "thirdweb/extensions/IContractDeployer";
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
          internalType: "address",
          name: "publisher",
          type: "address",
        },
        {
          internalType: "address",
          name: "implementation",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "initializeData",
          type: "bytes",
        },
        {
          internalType: "bytes32",
          name: "salt",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "publishMetadataUri",
          type: "string",
        },
      ],
      [
        {
          internalType: "address",
          name: "deployedAddress",
          type: "address",
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
