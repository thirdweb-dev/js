import { type TxOpts } from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";

/**
 * Retrieves the symbol of the ERC20 contract.
 * @param contract - The ERC20 contract instance.
 * @returns A promise that resolves to the symbol of the ERC20 contract.
 */
export async function symbol(options: TxOpts) {
  // TODO consider caching this
  return read({
    ...options,
    method: "function symbol() view returns (string)",
  });
}
