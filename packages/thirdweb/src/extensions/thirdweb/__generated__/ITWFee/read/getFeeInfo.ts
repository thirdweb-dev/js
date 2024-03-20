import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getFeeInfo" function.
 */
export type GetFeeInfoParams = {
  proxy: AbiParameterToPrimitiveType<{ type: "address"; name: "_proxy" }>;
  type: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_type" }>;
};

const METHOD = [
  "0x85b49ad0",
  [
    {
      type: "address",
      name: "_proxy",
    },
    {
      type: "uint256",
      name: "_type",
    },
  ],
  [
    {
      type: "address",
      name: "recipient",
    },
    {
      type: "uint256",
      name: "bps",
    },
  ],
] as const;

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
    method: METHOD,
    params: [options.proxy, options.type],
  });
}
