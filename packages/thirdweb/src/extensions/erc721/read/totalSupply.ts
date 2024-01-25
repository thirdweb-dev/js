import { type TxOpts } from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";

export async function totalSupply(options: TxOpts) {
  return read({
    ...options,
    method: "function totalSupply() view returns (uint256)",
  });
}
