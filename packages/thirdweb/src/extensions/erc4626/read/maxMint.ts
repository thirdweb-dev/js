import type { Address } from "abitype";
import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

export type MaxMintParams = {
  /**
   * The address to check max mintable shares for.
   */
  receiver: Address;
};

/**
 * Returns the maximum amount of shares that can be minted from the Vault for the receiver, through a mint call.
 * @param options - The transaction options including the address to check.
 * @returns Maximum number of shares that can be minted to the provided address.
 * @extension ERC4626
 * @example
 * ```ts
 * import { maxDeposit } from "thirdweb/extensions/erc4626";
 *
 * const max = await maxMint({ contract, receiver: "0x..." });
 * ```
 */
export async function maxMint(
  options: BaseTransactionOptions<MaxMintParams>,
): Promise<bigint> {
  const maxShares = await readContract({
    ...options,
    method: [
      "0xc63d75b6",
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

  return maxShares;
}
