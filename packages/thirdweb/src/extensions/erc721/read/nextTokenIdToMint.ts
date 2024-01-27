import { type TxOpts } from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";
import { createReadExtension } from "../../../utils/extension.js";

/**
 * Retrieves the next token ID to be minted in an ERC721 contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the next token ID to be minted.
 */
export const nextTokenIdToMint = /*@__PURE__*/ createReadExtension(
  "erc721.nextTokenIdToMint",
)(function (options: TxOpts): Promise<bigint> {
  return read({
    ...options,
    method: "function nextTokenIdToMint() view returns (uint256)",
  });
});
