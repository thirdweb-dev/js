import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { supportsInterface } from "../../erc165/__generated__/IERC165/read/supportsInterface.js";

/**
 * Check if a contract supports the ERC721 interface.
 * @param options - The transaction options.
 * @returns A boolean indicating whether the contract supports the ERC721 interface.
 * @extension ERC721
 * @example
 * ```ts
 * import { isERC721 } from "thirdweb/extensions/erc721";
 * const result = await isERC721({ contract });
 * ```
 */
export function isERC721(options: BaseTransactionOptions) {
  return supportsInterface({
    contract: options.contract,
    interfaceId: "0x80ac58cd",
  });
}
