import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "airdropERC20" function.
 */

type AirdropERC20ParamsInternal = {
  tokenAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "tokenAddress";
  }>;
  tokenOwner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "tokenOwner";
  }>;
  contents: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "contents";
    components: [
      { type: "address"; name: "recipient" },
      { type: "uint256"; name: "amount" },
    ];
  }>;
};

export type AirdropERC20Params = Prettify<
  | AirdropERC20ParamsInternal
  | {
      asyncParams: () => Promise<AirdropERC20ParamsInternal>;
    }
>;
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
          type: "address",
          name: "tokenAddress",
        },
        {
          type: "address",
          name: "tokenOwner",
        },
        {
          type: "tuple[]",
          name: "contents",
          components: [
            {
              type: "address",
              name: "recipient",
            },
            {
              type: "uint256",
              name: "amount",
            },
          ],
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.tokenAddress,
              resolvedParams.tokenOwner,
              resolvedParams.contents,
            ] as const;
          }
        : [options.tokenAddress, options.tokenOwner, options.contents],
  });
}
