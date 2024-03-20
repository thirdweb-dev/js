import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "publishContract" function.
 */

type PublishContractParamsInternal = {
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

export type PublishContractParams = Prettify<
  | PublishContractParamsInternal
  | {
      asyncParams: () => Promise<PublishContractParamsInternal>;
    }
>;
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
      ],
      [],
    ],
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
