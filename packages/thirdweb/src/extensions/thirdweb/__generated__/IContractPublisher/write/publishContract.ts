import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "publishContract" function.
 */

export type PublishContractParams = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  contractId: AbiParameterToPrimitiveType<{
    type: "string";
    name: "contractId";
  }>;
  publishMetadataUri: AbiParameterToPrimitiveType<{
    type: "string";
    name: "publishMetadataUri";
  }>;
  compilerMetadataUri: AbiParameterToPrimitiveType<{
    type: "string";
    name: "compilerMetadataUri";
  }>;
  bytecodeHash: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "bytecodeHash";
  }>;
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
  }>;
};

export const FN_SELECTOR = "0xd50299e6" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "publisher",
  },
  {
    type: "string",
    name: "contractId",
  },
  {
    type: "string",
    name: "publishMetadataUri",
  },
  {
    type: "string",
    name: "compilerMetadataUri",
  },
  {
    type: "bytes32",
    name: "bytecodeHash",
  },
  {
    type: "address",
    name: "implementation",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "publishContract" function.
 * @param options - The options for the publishContract function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodePublishContractParams } "thirdweb/extensions/thirdweb";
 * const result = encodePublishContractParams({
 *  publisher: ...,
 *  contractId: ...,
 *  publishMetadataUri: ...,
 *  compilerMetadataUri: ...,
 *  bytecodeHash: ...,
 *  implementation: ...,
 * });
 * ```
 */
export function encodePublishContractParams(options: PublishContractParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.publisher,
    options.contractId,
    options.publishMetadataUri,
    options.compilerMetadataUri,
    options.bytecodeHash,
    options.implementation,
  ]);
}

/**
 * Calls the "publishContract" function on the contract.
 * @param options - The options for the "publishContract" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { publishContract } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = publishContract({
 *  contract,
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
  options: BaseTransactionOptions<
    | PublishContractParams
    | {
        asyncParams: () => Promise<PublishContractParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.publisher,
              resolvedParams.contractId,
              resolvedParams.publishMetadataUri,
              resolvedParams.compilerMetadataUri,
              resolvedParams.bytecodeHash,
              resolvedParams.implementation,
            ] as const;
          }
        : [
            options.publisher,
            options.contractId,
            options.publishMetadataUri,
            options.compilerMetadataUri,
            options.bytecodeHash,
            options.implementation,
          ],
  });
}
