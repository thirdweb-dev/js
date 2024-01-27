import { type TxOpts } from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";
import { createReadExtension } from "../../../utils/extension.js";

/**
 * Retrieves the number of decimal places for an ERC20 token.
 * @param options - The transaction options.
 * @returns A promise that resolves to the number of decimal places (uint8).
 */
export const decimals = /* @__PURE__ */ createReadExtension("erc20.decimals")(
  function (options: TxOpts) {
    // TODO consider caching this
    return read({
      ...options,
      method: "function decimals() view returns (uint8)",
    });
  },
);
