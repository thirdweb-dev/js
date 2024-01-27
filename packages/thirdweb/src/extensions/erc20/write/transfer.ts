import { transaction, type TxOpts } from "../../../transaction/transaction.js";
import { parseUnits } from "viem";

type TransferParams = { to: string } & (
  | {
      amount: number;
    }
  | {
      amountGwei: bigint;
    }
);

/**
 * Transfers ERC20 tokens from the sender's address to the specified recipient address.
 *
 * @param options - The transaction options including the recipient address and the amount of tokens to transfer.
 * @returns A promise that resolves to the transaction receipt.
 */
export function transfer(options: TxOpts<TransferParams>) {
  return transaction({
    ...options,
    method: "function transfer(address to, uint256 value)",
    params: async () => {
      let amount: bigint;
      if ("amount" in options) {
        // if we need to parse the amount from ether to gwei then we pull in the decimals extension
        const { decimals } = await import("../read/decimals.js");
        // if this fails we fall back to `18` decimals
        const d = await decimals(options).catch(() => 18);
        // turn ether into gwei
        amount = parseUnits(options.amount.toString(), d);
      } else {
        amount = options.amountGwei;
      }
      return [options.to, amount] as const;
    },
  });
}
