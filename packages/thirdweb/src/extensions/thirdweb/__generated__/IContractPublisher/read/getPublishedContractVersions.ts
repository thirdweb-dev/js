import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getPublishedContractVersions" function.
 */
export type GetPublishedContractVersionsParams = {
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
};

/**
 * Calls the "getPublishedContractVersions" function on the contract.
 * @param options - The options for the getPublishedContractVersions function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
 * import { getPublishedContractVersions } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getPublishedContractVersions({
 *  publisher: ...,
 *  contractId: ...,
 * });
 *
 * ```
 */
export async function getPublishedContractVersions(
  options: BaseTransactionOptions<GetPublishedContractVersionsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x80251dac",
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
      ],
      [
        {
          components: [
            {
              internalType: "string",
              name: "contractId",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "publishTimestamp",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "publishMetadataUri",
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
          internalType: "struct IContractPublisher.CustomContractInstance[]",
          name: "published",
          type: "tuple[]",
        },
      ],
    ],
    params: [options.publisher, options.contractId],
  });
}
