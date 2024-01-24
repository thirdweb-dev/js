import {
  extractTXOpts,
  type ThirdwebClientLike,
  type TxOpts,
} from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";

export async function totalSupply<client extends ThirdwebClientLike>(
  options: TxOpts<client>,
) {
  const [opts] = extractTXOpts(options);
  return read({
    ...opts,
    method: "function totalSupply() view returns (uint256)",
  });
}
