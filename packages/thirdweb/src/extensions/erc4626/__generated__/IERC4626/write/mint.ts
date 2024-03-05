import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "mint" function.
 */
export type MintParams = {
  shares: AbiParameterToPrimitiveType<{
    name: "shares";
    type: "uint256";
    internalType: "uint256";
  }>;
  receiver: AbiParameterToPrimitiveType<{
    name: "receiver";
    type: "address";
    internalType: "address";
  }>;
};

/**
 * Calls the "mint" function on the contract.
 * @param options - The options for the "mint" function.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```
 * import { mint } from "thirdweb/extensions/erc4626";
 *
 * const transaction = mint({
 *  shares: ...,
 *  receiver: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function mint(options: BaseTransactionOptions<MintParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x94bf804d",
      [
        {
          name: "shares",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "receiver",
          type: "address",
          internalType: "address",
        },
      ],
      [
        {
          name: "assets",
          type: "uint256",
          internalType: "uint256",
        },
      ],
    ],
    params: [options.shares, options.receiver],
  });
}
