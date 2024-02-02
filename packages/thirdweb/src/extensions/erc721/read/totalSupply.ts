import { type TxOpts } from "~thirdweb/transaction/transaction.js";
import { readContract } from "~thirdweb/transaction/actions/read.js";

/**
 * Retrieves the total supply of ERC721 tokens.
 * @param options - The transaction options.
 * @returns A promise that resolves to the total supply as a bigint.
 * @example
 * ```ts
 * import { totalSupply } from "thirdweb/extensions/erc721";
 * const totalSupply = await totalSupply({ contract });
 * ```
 */
export function totalSupply(options: TxOpts): Promise<bigint> {
  return readContract({
    ...options,
    method: "function totalSupply() view returns (uint256)",
  });
}
