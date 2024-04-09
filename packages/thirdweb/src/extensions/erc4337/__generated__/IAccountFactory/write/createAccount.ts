import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "createAccount" function.
 */

export type CreateAccountParams = {
  admin: AbiParameterToPrimitiveType<{ type: "address"; name: "admin" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
};

export const FN_SELECTOR = "0xd8fd8f44" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "admin",
  },
  {
    type: "bytes",
    name: "_data",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "account",
  },
] as const;

/**
 * Encodes the parameters for the "createAccount" function.
 * @param options - The options for the createAccount function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeCreateAccountParams } "thirdweb/extensions/erc4337";
 * const result = encodeCreateAccountParams({
 *  admin: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeCreateAccountParams(options: CreateAccountParams) {
  return encodeAbiParameters(FN_INPUTS, [options.admin, options.data]);
}

/**
 * Calls the "createAccount" function on the contract.
 * @param options - The options for the "createAccount" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { createAccount } from "thirdweb/extensions/erc4337";
 *
 * const transaction = createAccount({
 *  contract,
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
  options: BaseTransactionOptions<
    | CreateAccountParams
    | {
        asyncParams: () => Promise<CreateAccountParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.admin, resolvedParams.data] as const;
          }
        : [options.admin, options.data],
  });
}
