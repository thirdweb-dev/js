import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "depositTo" function.
 */

export type DepositToParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0xb760faf9" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "account",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "depositTo" function.
 * @param options - The options for the depositTo function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeDepositToParams } "thirdweb/extensions/erc4337";
 * const result = encodeDepositToParams({
 *  account: ...,
 * });
 * ```
 */
export function encodeDepositToParams(options: DepositToParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account]);
}

/**
 * Calls the "depositTo" function on the contract.
 * @param options - The options for the "depositTo" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { depositTo } from "thirdweb/extensions/erc4337";
 *
 * const transaction = depositTo({
 *  contract,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function depositTo(
  options: BaseTransactionOptions<
    | DepositToParams
    | {
        asyncParams: () => Promise<DepositToParams>;
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
            return [resolvedParams.account] as const;
          }
        : [options.account],
  });
}
