import { isNameSupported } from "../../common/__generated__/IContractMetadata/read/name.js";
import { isSymbolSupported } from "../../common/__generated__/IContractMetadata/read/symbol.js";
import { isAllowanceSupported } from "../__generated__/IERC20/read/allowance.js";
import { isBalanceOfSupported } from "../__generated__/IERC20/read/balanceOf.js";
import { isDecimalsSupported } from "../__generated__/IERC20/read/decimals.js";
import { isTotalSupplySupported } from "../__generated__/IERC20/read/totalSupply.js";
import { isApproveSupported } from "../__generated__/IERC20/write/approve.js";
import { isTransferSupported } from "../__generated__/IERC20/write/transfer.js";
import { isTransferFromSupported } from "../__generated__/IERC20/write/transferFrom.js";

/**
 * Check if a contract is an ERC20 token.
 * @param options - The transaction options.
 * @returns A boolean indicating whether the contract is an ERC20 token.
 * @extension ERC20
 * @example
 * ```ts
 * import { isERC20 } from "thirdweb/extensions/erc20";
 * import { resolveContractAbi } from "thirdweb/contract";
 *
 * const abi = await resolveContractAbi(contract);
 * const selectors = abi
 *   .filter((f) => f.type === "function")
 *   .map((f) => toFunctionSelector(f));
 *
 * const result = await isERC20(selectors);
 * ```
 */
export function isERC20(availableSelectors: string[]) {
  // there is no trustworthy way to check if a contract is ERC20 via ERC165, so we do this manually.
  // see: https://github.com/OpenZeppelin/openzeppelin-contracts/issues/3575
  // see: https://ethereum.org/en/developers/docs/standards/tokens/erc-20/

  return [
    isNameSupported(availableSelectors),
    isSymbolSupported(availableSelectors),
    isDecimalsSupported(availableSelectors),
    isTotalSupplySupported(availableSelectors),
    isBalanceOfSupported(availableSelectors),
    isTransferSupported(availableSelectors),
    isTransferFromSupported(availableSelectors),
    isApproveSupported(availableSelectors),
    isAllowanceSupported(availableSelectors),
  ].every(Boolean);
}
