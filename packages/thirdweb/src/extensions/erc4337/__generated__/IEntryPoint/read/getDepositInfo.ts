import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getDepositInfo" function.
 */
export type GetDepositInfoParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

/**
 * Calls the "getDepositInfo" function on the contract.
 * @param options - The options for the getDepositInfo function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```
 * import { getDepositInfo } from "thirdweb/extensions/erc4337";
 *
 * const result = await getDepositInfo({
 *  account: ...,
 * });
 *
 * ```
 */
export async function getDepositInfo(
  options: BaseTransactionOptions<GetDepositInfoParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x5287ce12",
      [
        {
          type: "address",
          name: "account",
        },
      ],
      [
        {
          type: "tuple",
          name: "info",
          components: [
            {
              type: "uint112",
              name: "deposit",
            },
            {
              type: "bool",
              name: "staked",
            },
            {
              type: "uint112",
              name: "stake",
            },
            {
              type: "uint32",
              name: "unstakeDelaySec",
            },
            {
              type: "uint48",
              name: "withdrawTime",
            },
          ],
        },
      ],
    ],
    params: [options.account],
  });
}
