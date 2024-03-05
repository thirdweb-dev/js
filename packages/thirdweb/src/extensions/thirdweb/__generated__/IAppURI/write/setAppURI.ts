import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setAppURI" function.
 */
export type SetAppURIParams = {
  uri: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "_uri";
    type: "string";
  }>;
};

/**
 * Calls the "setAppURI" function on the contract.
 * @param options - The options for the "setAppURI" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { setAppURI } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = setAppURI({
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setAppURI(options: BaseTransactionOptions<SetAppURIParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xfea18082",
      [
        {
          internalType: "string",
          name: "_uri",
          type: "string",
        },
      ],
      [],
    ],
    params: [options.uri],
  });
}
