import {
  readContract,
  type BaseTransactionOptions,
} from "../../../transaction/index.js";

/**
 * Retrieves the total supply of ERC721 tokens.
 * @param options - The transaction options.
 * @returns A promise that resolves to the total supply as a bigint.
 * @extension ERC721
 * @example
 * ```ts
 * import { totalSupply } from "thirdweb/extensions/erc721";
 * const totalSupply = await totalSupply({ contract });
 * ```
 */
export function totalSupply(options: BaseTransactionOptions): Promise<bigint> {
  return readContract({
    ...options,
    method: "function totalSupply() view returns (uint256)",
  });
}
