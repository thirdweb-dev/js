import {
  extractTXOpts,
  transaction,
  type ThirdwebClientLike,
  type TxOpts,
} from "../../../transaction/transaction.js";
import { parseUnits } from "viem";

type TransferParams = { to: string } & (
  | {
      amount: number;
    }
  | {
      amountGwei: bigint;
    }
);

export function transfer<client extends ThirdwebClientLike>(
  options: TxOpts<client, TransferParams>,
) {
  const [opts, params] = extractTXOpts(options);
  return transaction({
    ...opts,
    method: "function transfer(address to, uint256 value)",
    params: async () => {
      let amount: bigint;
      if ("amount" in params) {
        // if we need to parse the amount from ether to gwei then we pull in the decimals extension
        const { decimals } = await import("../read/decimals.js");
        // if this fails we fall back to `18` decimals
        const d = await decimals(options).catch(() => 18);
        // turn ether into gwei
        amount = parseUnits(params.amount.toString(), d);
      } else {
        amount = params.amountGwei;
      }
      return [options.to, amount] as const;
    },
  });
}
