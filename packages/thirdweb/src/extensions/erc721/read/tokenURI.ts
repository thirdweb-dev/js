import { type TxOpts } from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";
import { createReadExtension } from "src/utils/extension.js";

export type TokenUriParams = { tokenId: bigint };

/**
 * Retrieves the URI associated with a specific ERC721 token.
 * @param options - The transaction options.
 * @returns A Promise that resolves to the token URI.
 */
export const tokenURI = /*@__PURE__*/ createReadExtension("erc721.totkenURI")(
  function (options: TxOpts<TokenUriParams>) {
    return read({
      ...options,
      method:
        "function tokenURI(uint256 tokenId) external view returns (string memory)",
      params: [BigInt(options.tokenId)],
    });
  },
);
