import { type TxOpts } from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";
import { createReadExtension } from "../../../utils/extension.js";

/**
 * Retrieves the symbol of the ERC20 token.
 * @param options - The transaction options.
 * @returns A promise that resolves to the symbol of the ERC20 token.
 */
export const symbol = /* @__PURE__ */ createReadExtension("erc20.symbol")(
  function (options: TxOpts) {
    // TODO consider caching this
    return read({
      ...options,
      method: "function symbol() view returns (string)",
    });
  },
);
