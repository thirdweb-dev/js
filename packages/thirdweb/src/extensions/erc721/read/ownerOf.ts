import { type TxOpts } from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";
import { createReadExtension } from "../../../utils/extension.js";

export type OwnerOfParams = { tokenId: bigint };

/**
 * Retrieves the owner of a specific ERC721 token.
 * @param options - The transaction options.
 * @returns A promise that resolves to the address of the token owner.
 */
export const ownerOf = /*@__PURE__*/ createReadExtension("erc721.ownerOf")(
  function (options: TxOpts<OwnerOfParams>) {
    return read({
      ...options,
      method:
        "function ownerOf(uint256 tokenId) external view returns (address owner)",
      params: [BigInt(options.tokenId)],
    });
  },
);
