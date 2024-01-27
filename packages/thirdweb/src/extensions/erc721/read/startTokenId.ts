import { type TxOpts } from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";
import { createReadExtension } from "src/utils/extension.js";

/**
 * Retrieves the starting token ID of the ERC721 contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the starting token ID as a uint256 value.
 */
export const startTokenId = /*@__PURE__*/ createReadExtension(
  "erc721.startTokenId",
)(function (options: TxOpts) {
  return read({
    ...options,
    method: "function startTokenId() view returns (uint256)",
  });
});
