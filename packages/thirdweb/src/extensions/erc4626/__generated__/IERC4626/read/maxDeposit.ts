import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "maxDeposit" function.
 */
export type MaxDepositParams = {
  receiver: AbiParameterToPrimitiveType<{
    name: "receiver";
    type: "address";
    internalType: "address";
  }>;
};

const METHOD = [
  "0x402d267d",
  [
    {
      name: "receiver",
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
 * Calls the "maxDeposit" function on the contract.
 * @param options - The options for the maxDeposit function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```
 * import { maxDeposit } from "thirdweb/extensions/erc4626";
 *
 * const result = await maxDeposit({
 *  receiver: ...,
 * });
 *
 * ```
 */
export async function maxDeposit(
  options: BaseTransactionOptions<MaxDepositParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.receiver],
  });
}
