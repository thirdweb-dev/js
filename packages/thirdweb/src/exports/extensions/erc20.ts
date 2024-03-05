// read
export {
  getBalance,
  type GetBalanceParams,
  type GetBalanceResult,
} from "../../extensions/erc20/read/getBalance.js";
export {
  balanceOf,
  type BalanceOfParams,
} from "../../extensions/erc20/__generated__/IERC20/read/balanceOf.js";
export { decimals } from "../../extensions/erc20/__generated__/IERC20Metadata/read/decimals.js";
export { totalSupply } from "../../extensions/erc20/__generated__/IERC20/read/totalSupply.js";
export {
  allowance,
  type AllowanceParams,
} from "../../extensions/erc20/__generated__/IERC20/read/allowance.js";

// write
export {
  mintTo,
  type MintToParams,
} from "../../extensions/erc20/write/mintTo.js";
export {
  transfer,
  type TransferParams,
} from "../../extensions/erc20/write/transfer.js";
export {
  transferFrom,
  type TransferFromParams,
} from "../../extensions/erc20/write/transferFrom.js";
export {
  approve,
  type ApproveParams,
} from "../../extensions/erc20/write/approve.js";
