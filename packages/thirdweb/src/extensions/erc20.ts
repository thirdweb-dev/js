// read
export { balanceOf } from "./erc20/read/balanceOf.js";
export { detectDecimals, decimals } from "./erc20/read/decimals.js";
export { totalSupply } from "./erc20/read/totalSupply.js";
export { allowance, type AllowanceParams } from "./erc20/read/allowance.js";
// write
export { mintTo, type MintToParams } from "./erc20/write/mintTo.js";
export { transfer, type TransferParams } from "./erc20/write/transfer.js";
export {
  transferFrom,
  type TransferFromParams,
} from "./erc20/write/transferFrom.js";
export { approve, type ApproveParams } from "./erc20/write/approve.js";
