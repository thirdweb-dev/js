import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "burnFrom" function.
 */

export type BurnFromParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
};

export const FN_SELECTOR = "0x79cc6790" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "account",
  },
  {
    type: "uint256",
    name: "amount",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "burnFrom" function.
 * @param options - The options for the burnFrom function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeBurnFromParams } "thirdweb/extensions/erc20";
 * const result = encodeBurnFromParams({
 *  account: ...,
 *  amount: ...,
 * });
 * ```
 */
export function encodeBurnFromParams(options: BurnFromParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account, options.amount]);
}

/**
 * Calls the "burnFrom" function on the contract.
 * @param options - The options for the "burnFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { burnFrom } from "thirdweb/extensions/erc20";
 *
 * const transaction = burnFrom({
 *  contract,
 *  account: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function burnFrom(
  options: BaseTransactionOptions<
    | BurnFromParams
    | {
        asyncParams: () => Promise<BurnFromParams>;
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
            return [resolvedParams.account, resolvedParams.amount] as const;
          }
        : [options.account, options.amount],
  });
}
