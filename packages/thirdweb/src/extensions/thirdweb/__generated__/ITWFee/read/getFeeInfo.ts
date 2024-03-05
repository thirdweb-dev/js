import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getFeeInfo" function.
 */
export type GetFeeInfoParams = {
  proxy: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_proxy";
    type: "address";
  }>;
  type: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_type";
    type: "uint256";
  }>;
};

/**
 * Calls the "getFeeInfo" function on the contract.
 * @param options - The options for the getFeeInfo function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
 * import { getFeeInfo } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getFeeInfo({
 *  proxy: ...,
 *  type: ...,
 * });
 *
 * ```
 */
export async function getFeeInfo(
  options: BaseTransactionOptions<GetFeeInfoParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x85b49ad0",
      [
        {
          internalType: "address",
          name: "_proxy",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_type",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "bps",
          type: "uint256",
        },
      ],
    ],
    params: [options.proxy, options.type],
  });
}
