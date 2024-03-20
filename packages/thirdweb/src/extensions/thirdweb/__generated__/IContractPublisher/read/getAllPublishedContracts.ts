import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAllPublishedContracts" function.
 */
export type GetAllPublishedContractsParams = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
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
          type: "address",
          name: "publisher",
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
    ],
    params: [options.publisher],
  });
}
