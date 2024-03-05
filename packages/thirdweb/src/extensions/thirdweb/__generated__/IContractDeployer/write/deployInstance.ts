import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "deployInstance" function.
 */
export type DeployInstanceParams = {
  publisher: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "publisher";
    type: "address";
  }>;
  contractBytecode: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "contractBytecode";
    type: "bytes";
  }>;
  constructorArgs: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "constructorArgs";
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
 * Calls the "deployInstance" function on the contract.
 * @param options - The options for the "deployInstance" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { deployInstance } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = deployInstance({
 *  publisher: ...,
 *  contractBytecode: ...,
 *  constructorArgs: ...,
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
export function deployInstance(
  options: BaseTransactionOptions<DeployInstanceParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x28f84d4c",
      [
        {
          internalType: "address",
          name: "publisher",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "contractBytecode",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "constructorArgs",
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
      options.contractBytecode,
      options.constructorArgs,
      options.salt,
      options.value,
      options.publishMetadataUri,
    ],
  });
}
