import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "maxWithdraw" function.
 */
export type MaxWithdrawParams = {
  owner: AbiParameterToPrimitiveType<{
    name: "owner";
    type: "address";
    internalType: "address";
  }>;
};

const METHOD = [
  "0xce96cb77",
  [
    {
      name: "owner",
      type: "address",
      internalType: "address",
    },
  ],
  [
    {
      name: "maxAssets",
      type: "uint256",
      internalType: "uint256",
    },
  ],
] as const;

/**
 * Calls the "maxWithdraw" function on the contract.
 * @param options - The options for the maxWithdraw function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```
 * import { maxWithdraw } from "thirdweb/extensions/erc4626";
 *
 * const result = await maxWithdraw({
 *  owner: ...,
 * });
 *
 * ```
 */
export async function maxWithdraw(
  options: BaseTransactionOptions<MaxWithdrawParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.owner],
  });
}
