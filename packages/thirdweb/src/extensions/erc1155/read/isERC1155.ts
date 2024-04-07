import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { supportsInterface } from "../../erc165/__generated__/IERC165/read/supportsInterface.js";

/**
 * Check if a contract supports the ERC1155 interface.
 * @param options - The transaction options.
 * @returns A boolean indicating whether the contract supports the ERC1155 interface.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isERC1155 } from "thirdweb/extensions/erc1155";
 * const result = await isERC1155({ contract });
 * ```
 */
export function isERC1155(options: BaseTransactionOptions) {
  return supportsInterface({
    contract: options.contract,
    interfaceId: "0xd9b67a26",
  });
}
