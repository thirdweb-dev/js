import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getRoyalty" function.
 */
export type GetRoyaltyParams = {
  tokenAddress: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "tokenAddress";
    type: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  value: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "value";
    type: "uint256";
  }>;
};

/**
 * Calls the getRoyalty function on the contract.
 * @param options - The options for the getRoyalty function.
 * @returns A prepared transaction object.
 * @extension IROYALTYPAYMENTS
 * @example
 * ```
 * import { getRoyalty } from "thirdweb/extensions/IRoyaltyPayments";
 *
 * const transaction = getRoyalty({
 *  tokenAddress: ...,
 *  tokenId: ...,
 *  value: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function getRoyalty(options: BaseTransactionOptions<GetRoyaltyParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xf533b802",
      [
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "address payable[]",
          name: "recipients",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "amounts",
          type: "uint256[]",
        },
      ],
    ],
    params: [options.tokenAddress, options.tokenId, options.value],
  });
}
