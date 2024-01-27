import { type TxOpts } from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";
import { createReadExtension } from "../../../utils/extension.js";

/**
 * Retrieves the starting token ID for the ERC721 contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the starting token ID as a bigint.
 */
export const startTokenId = /*@__PURE__*/ createReadExtension(
  "erc721.startTokenId",
)(function (options: TxOpts): Promise<bigint> {
  return read({
    ...options,
    method: "function startTokenId() view returns (uint256)",
  });
});
