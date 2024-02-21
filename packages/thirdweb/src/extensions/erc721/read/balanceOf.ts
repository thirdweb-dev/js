import {
  readContract,
  type BaseTransactionOptions,
} from "../../../transaction/index.js";

export type BalanceOfParams = { address: string; };

/**
 * Retrieves the balance of tokens owned by a specific address.
 * @param options - The transaction options.
 * @returns A promise that resolves to the balance of the provided address.
 * @extension ERC721
 * @example
 * ```ts
 * import { balanceOf } from "thirdweb/extensions/erc721";
 * const balance = await balanceOf({ contract, address: 1n });
 * ```
 */
export function balanceOf(
  options: BaseTransactionOptions<BalanceOfParams>,
): Promise<bigint> {
  return readContract({
    ...options,
    method:
      "function balanceOf(address owner) external view returns (uint256 balance)",
    params: [options.address],
  });
}
