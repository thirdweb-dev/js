import {
  extractTXOpts,
  type ThirdwebClientLike,
  type TxOpts,
} from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";

/**
 * Retrieves the symbol of the ERC20 contract.
 * @param contract - The ERC20 contract instance.
 * @returns A promise that resolves to the symbol of the ERC20 contract.
 */
export async function symbol<client extends ThirdwebClientLike>(
  options: TxOpts<client>,
) {
  const [opts] = extractTXOpts(options);
  // TODO consider caching this
  return read({ ...opts, method: "function symbol() view returns (string)" });
}
