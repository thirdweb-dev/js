import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getPublisherProfileUri" function.
 */
export type GetPublisherProfileUriParams = {
  publisher: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "publisher";
    type: "address";
  }>;
};

/**
 * Calls the getPublisherProfileUri function on the contract.
 * @param options - The options for the getPublisherProfileUri function.
 * @returns The parsed result of the function call.
 * @extension ICONTRACTPUBLISHER
 * @example
 * ```
 * import { getPublisherProfileUri } from "thirdweb/extensions/IContractPublisher";
 *
 * const result = await getPublisherProfileUri({
 *  publisher: ...,
 * });
 *
 * ```
 */
export async function getPublisherProfileUri(
  options: BaseTransactionOptions<GetPublisherProfileUriParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x4f781675",
      [
        {
          internalType: "address",
          name: "publisher",
          type: "address",
        },
      ],
      [
        {
          internalType: "string",
          name: "uri",
          type: "string",
        },
      ],
    ],
    params: [options.publisher],
  });
}
