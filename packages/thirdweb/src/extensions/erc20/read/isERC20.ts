import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { supportsInterface } from "../../erc165/__generated__/IERC165/read/supportsInterface.js";

/**
 * Check if a contract supports the ERC20 interface.
 * @param options - The transaction options.
 * @returns A boolean indicating whether the contract supports the ERC20 interface.
 * @extension ERC20
 * @example
 * ```ts
 * import { isERC20 } from "thirdweb/extensions/erc20";
 * const result = await isERC20({ contract });
 * ```
 */
export function isERC20(options: BaseTransactionOptions) {
  return supportsInterface({
    contract: options.contract,
    interfaceId: "0x36372b07",
  });
}
