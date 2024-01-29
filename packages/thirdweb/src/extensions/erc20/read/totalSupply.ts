import { type TxOpts } from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";
import { createReadExtension } from "../../../utils/extension.js";

export const totalSupply = /* @__PURE__ */ createReadExtension(
  "erc20.totalSupply",
)(function (options: TxOpts): Promise<bigint> {
  return read({
    ...options,
    method: "function totalSupply() view returns (uint256)",
  });
});
