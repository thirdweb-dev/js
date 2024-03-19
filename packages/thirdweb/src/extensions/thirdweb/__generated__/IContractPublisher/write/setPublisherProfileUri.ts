import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "setPublisherProfileUri" function.
 */

type SetPublisherProfileUriParamsInternal = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "uri" }>;
};

export type SetPublisherProfileUriParams = Prettify<
  | SetPublisherProfileUriParamsInternal
  | {
      asyncParams: () => Promise<SetPublisherProfileUriParamsInternal>;
    }
>;
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
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.publisher, resolvedParams.uri] as const;
      }

      return [options.publisher, options.uri] as const;
    },
  });
}
