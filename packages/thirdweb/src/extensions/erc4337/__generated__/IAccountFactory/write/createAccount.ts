import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "createAccount" function.
 */

type CreateAccountParamsInternal = {
  admin: AbiParameterToPrimitiveType<{ type: "address"; name: "admin" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
};

export type CreateAccountParams = Prettify<
  | CreateAccountParamsInternal
  | {
      asyncParams: () => Promise<CreateAccountParamsInternal>;
    }
>;
const METHOD = [
  "0xd8fd8f44",
  [
    {
      type: "address",
      name: "admin",
    },
    {
      type: "bytes",
      name: "_data",
    },
  ],
  [
    {
      type: "address",
      name: "account",
    },
  ],
] as const;

/**
 * Calls the "createAccount" function on the contract.
 * @param options - The options for the "createAccount" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { createAccount } from "thirdweb/extensions/erc4337";
 *
 * const transaction = createAccount({
 *  admin: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createAccount(
  options: BaseTransactionOptions<CreateAccountParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.admin, resolvedParams.data] as const;
          }
        : [options.admin, options.data],
  });
}
