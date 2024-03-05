import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "deployInstance" function.
 */
export type DeployInstanceParams = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  contractBytecode: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "contractBytecode";
  }>;
  constructorArgs: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "constructorArgs";
  }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "salt" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
  publishMetadataUri: AbiParameterToPrimitiveType<{
    type: "string";
    name: "publishMetadataUri";
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
          type: "address",
          name: "publisher",
        },
        {
          type: "bytes",
          name: "contractBytecode",
        },
        {
          type: "bytes",
          name: "constructorArgs",
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
      options.contractBytecode,
      options.constructorArgs,
      options.salt,
      options.value,
      options.publishMetadataUri,
    ],
  });
}
