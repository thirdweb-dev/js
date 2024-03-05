import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "withdrawTo" function.
 */
export type WithdrawToParams = {
  withdrawAddress: AbiParameterToPrimitiveType<{
    internalType: "address payable";
    name: "withdrawAddress";
    type: "address";
  }>;
  withdrawAmount: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "withdrawAmount";
    type: "uint256";
  }>;
};

/**
 * Calls the "withdrawTo" function on the contract.
 * @param options - The options for the "withdrawTo" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { withdrawTo } from "thirdweb/extensions/erc4337";
 *
 * const transaction = withdrawTo({
 *  withdrawAddress: ...,
 *  withdrawAmount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdrawTo(options: BaseTransactionOptions<WithdrawToParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x205c2878",
      [
        {
          internalType: "address payable",
          name: "withdrawAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "withdrawAmount",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.withdrawAddress, options.withdrawAmount],
  });
}
