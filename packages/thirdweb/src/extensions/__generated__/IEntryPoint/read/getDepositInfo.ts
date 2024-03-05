import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getDepositInfo" function.
 */
export type GetDepositInfoParams = {
  account: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "account";
    type: "address";
  }>;
};

/**
 * Calls the getDepositInfo function on the contract.
 * @param options - The options for the getDepositInfo function.
 * @returns The parsed result of the function call.
 * @extension IENTRYPOINT
 * @example
 * ```
 * import { getDepositInfo } from "thirdweb/extensions/IEntryPoint";
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
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      [
        {
          components: [
            {
              internalType: "uint112",
              name: "deposit",
              type: "uint112",
            },
            {
              internalType: "bool",
              name: "staked",
              type: "bool",
            },
            {
              internalType: "uint112",
              name: "stake",
              type: "uint112",
            },
            {
              internalType: "uint32",
              name: "unstakeDelaySec",
              type: "uint32",
            },
            {
              internalType: "uint48",
              name: "withdrawTime",
              type: "uint48",
            },
          ],
          internalType: "struct IStakeManager.DepositInfo",
          name: "info",
          type: "tuple",
        },
      ],
    ],
    params: [options.account],
  });
}
