import type { Address } from "abitype";
import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

export type MaxDepositParams = {
  /**
   * The address to check max deposit possible for.
   */
  receiver: Address;
};

/**
 * Returns the maximum amount of the underlying tokens that can be deposited into the Vault for the receiver, through a deposit call.
 * @param options - The transaction options including the receiver to check.
 * @returns Maximum number of underlying tokens that can be sent to the provided address via a deposit.
 * @extension ERC4626
 * @example
 * ```ts
 * import { maxDeposit } from "thirdweb/extensions/erc4626";
 *
 * const maxAssets = await maxDeposit({ contract, receiver: "0x..." });
 * ```
 */
export async function maxDeposit(
  options: BaseTransactionOptions<MaxDepositParams>,
): Promise<bigint> {
  const maxAssets = await readContract({
    ...options,
    method: [
      "0x402d267d",
      [
        {
          type: "address",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [options.receiver],
  });

  return maxAssets;
}
