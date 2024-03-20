import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getPublishedContractVersions" function.
 */
export type GetPublishedContractVersionsParams = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  contractId: AbiParameterToPrimitiveType<{
    type: "string";
    name: "contractId";
  }>;
};

const METHOD = [
  "0x80251dac",
  [
    {
      type: "address",
      name: "publisher",
    },
    {
      type: "string",
      name: "contractId",
    },
  ],
  [
    {
      type: "tuple[]",
      name: "published",
      components: [
        {
          type: "string",
          name: "contractId",
        },
        {
          type: "uint256",
          name: "publishTimestamp",
        },
        {
          type: "string",
          name: "publishMetadataUri",
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
    },
  ],
] as const;

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
    method: METHOD,
    params: [options.publisher, options.contractId],
  });
}
