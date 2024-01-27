import { type TxOpts } from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";
import { createReadExtension } from "src/utils/extension.js";

/**
 * Retrieves the total supply of ERC721 tokens.
 * @param options - The transaction options.
 * @returns A promise that resolves to the total supply as a BigNumber.
 */
export const totalSupply = /*@__PURE__*/ createReadExtension(
  "erc721.totalSupply",
)(function (options: TxOpts) {
  return read({
    ...options,
    method: "function totalSupply() view returns (uint256)",
  });
});
