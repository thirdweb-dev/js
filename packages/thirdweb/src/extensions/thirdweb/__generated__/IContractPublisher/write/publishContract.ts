import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "publishContract" function.
 */
export type PublishContractParams = {
  publisher: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "publisher";
    type: "address";
  }>;
  contractId: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "contractId";
    type: "string";
  }>;
  publishMetadataUri: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "publishMetadataUri";
    type: "string";
  }>;
  compilerMetadataUri: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "compilerMetadataUri";
    type: "string";
  }>;
  bytecodeHash: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "bytecodeHash";
    type: "bytes32";
  }>;
  implementation: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "implementation";
    type: "address";
  }>;
};

/**
 * Calls the "publishContract" function on the contract.
 * @param options - The options for the "publishContract" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { publishContract } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = publishContract({
 *  publisher: ...,
 *  contractId: ...,
 *  publishMetadataUri: ...,
 *  compilerMetadataUri: ...,
 *  bytecodeHash: ...,
 *  implementation: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function publishContract(
  options: BaseTransactionOptions<PublishContractParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xd50299e6",
      [
        {
          internalType: "address",
          name: "publisher",
          type: "address",
        },
        {
          internalType: "string",
          name: "contractId",
          type: "string",
        },
        {
          internalType: "string",
          name: "publishMetadataUri",
          type: "string",
        },
        {
          internalType: "string",
          name: "compilerMetadataUri",
          type: "string",
        },
        {
          internalType: "bytes32",
          name: "bytecodeHash",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "implementation",
          type: "address",
        },
      ],
      [],
    ],
    params: [
      options.publisher,
      options.contractId,
      options.publishMetadataUri,
      options.compilerMetadataUri,
      options.bytecodeHash,
      options.implementation,
    ],
  });
}
