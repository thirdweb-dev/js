import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "burnFrom" function.
 */
export type BurnFromParams = {
  account: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "account";
    type: "address";
  }>;
  amount: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "amount";
    type: "uint256";
  }>;
};

/**
 * Calls the "burnFrom" function on the contract.
 * @param options - The options for the "burnFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { burnFrom } from "thirdweb/extensions/erc20";
 *
 * const transaction = burnFrom({
 *  account: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function burnFrom(options: BaseTransactionOptions<BurnFromParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x79cc6790",
      [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.account, options.amount],
  });
}
