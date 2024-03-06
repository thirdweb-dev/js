import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setPublisherProfileUri" function.
 */
export type SetPublisherProfileUriParams = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "uri" }>;
};

/**
 * Calls the "setPublisherProfileUri" function on the contract.
 * @param options - The options for the "setPublisherProfileUri" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { setPublisherProfileUri } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = setPublisherProfileUri({
 *  publisher: ...,
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setPublisherProfileUri(
  options: BaseTransactionOptions<SetPublisherProfileUriParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x6e578e54",
      [
        {
          type: "address",
          name: "publisher",
        },
        {
          type: "string",
          name: "uri",
        },
      ],
      [],
    ],
    params: [options.publisher, options.uri],
  });
}
