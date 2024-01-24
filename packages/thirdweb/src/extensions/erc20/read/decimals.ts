import {
  extractTXOpts,
  type ThirdwebClientLike,
  type TxOpts,
} from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";

export async function decimals<client extends ThirdwebClientLike>(
  options: TxOpts<client>,
) {
  const [opts] = extractTXOpts(options);
  // TODO consider caching this
  return read({
    ...opts,
    abi: "function decimals() view returns (uint8)",
  });
}
