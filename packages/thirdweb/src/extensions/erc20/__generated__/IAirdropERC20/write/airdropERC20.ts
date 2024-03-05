import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "airdropERC20" function.
 */
export type AirdropERC20Params = {
  tokenAddress: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "tokenAddress";
    type: "address";
  }>;
  tokenOwner: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "tokenOwner";
    type: "address";
  }>;
  contents: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "recipient"; type: "address" },
      { internalType: "uint256"; name: "amount"; type: "uint256" },
    ];
    internalType: "struct IAirdropERC20.AirdropContent[]";
    name: "contents";
    type: "tuple[]";
  }>;
};

/**
 * Calls the "airdropERC20" function on the contract.
 * @param options - The options for the "airdropERC20" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { airdropERC20 } from "thirdweb/extensions/erc20";
 *
 * const transaction = airdropERC20({
 *  tokenAddress: ...,
 *  tokenOwner: ...,
 *  contents: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function airdropERC20(
  options: BaseTransactionOptions<AirdropERC20Params>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x0670b2b3",
      [
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "tokenOwner",
          type: "address",
        },
        {
          components: [
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          internalType: "struct IAirdropERC20.AirdropContent[]",
          name: "contents",
          type: "tuple[]",
        },
      ],
      [],
    ],
    params: [options.tokenAddress, options.tokenOwner, options.contents],
  });
}
