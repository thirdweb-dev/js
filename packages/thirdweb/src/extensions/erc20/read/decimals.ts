import { type TxOpts } from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";

export async function decimals(options: TxOpts) {
  // TODO consider caching this
  return read({
    ...options,
    method: "function decimals() view returns (uint8)",
  });
}
