import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAllPublishedContracts" function.
 */
export type GetAllPublishedContractsParams = {
  publisher: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "publisher";
    type: "address";
  }>;
};

/**
 * Calls the "getAllPublishedContracts" function on the contract.
 * @param options - The options for the getAllPublishedContracts function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
 * import { getAllPublishedContracts } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getAllPublishedContracts({
 *  publisher: ...,
 * });
 *
 * ```
 */
export async function getAllPublishedContracts(
  options: BaseTransactionOptions<GetAllPublishedContractsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xaf8db690",
      [
        {
          internalType: "address",
          name: "publisher",
          type: "address",
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
    params: [options.publisher],
  });
}
