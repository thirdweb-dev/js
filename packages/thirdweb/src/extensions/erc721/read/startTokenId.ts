import {
  extractTXOpts,
  type ThirdwebClientLike,
  type TxOpts,
} from "../../../transaction/transaction.js";

import { read } from "../../../transaction/actions/read.js";

/**
 * Retrieves the start token ID of the ERC721 contract.
 * @param contract - The ERC721 contract.
 * @returns A promise that resolves to the start token ID.
 */
export async function startTokenId<client extends ThirdwebClientLike>(
  options: TxOpts<client>,
) {
  const [opts] = extractTXOpts(options);
  return read({
    ...opts,
    method: "function startTokenId() view returns (uint256)",
  });
}
