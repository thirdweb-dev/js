import {
  transaction,
  type ThirdwebClientLike,
  type TxOpts,
  extractTXOpts,
} from "../../../transaction/transaction.js";
import { parseUnits } from "viem";

type MintToParams = { to: string } & (
  | {
      amount: number;
    }
  | {
      amountGwei: bigint;
    }
);

export function mintTo<client extends ThirdwebClientLike>(
  options: TxOpts<client, MintToParams>,
) {
  const [opts, params] = extractTXOpts(options);
  return transaction({
    ...opts,
    method: "function mintTo(address to, uint256 amount)",
    params: async () => {
      let amount: bigint;
      if ("amount" in params) {
        // if we need to parse the amount from ether to gwei then we pull in the decimals extension
        const { decimals } = await import("../read/decimals.js");
        // if this fails we fall back to `18` decimals
        const d = await decimals(opts).catch(() => 18);
        // turn ether into gwei
        amount = parseUnits(params.amount.toString(), d);
      } else {
        amount = params.amountGwei;
      }
      return [params.to, amount] as const;
    },
  });
}
