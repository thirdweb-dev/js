import { transaction } from "../../../transaction/transaction.js";
import type { ThirdwebContract } from "../../../contract/index.js";
import { parseUnits } from "viem";

type MintToParams = { to: string } & (
  | {
      amount: number;
    }
  | {
      amountGwei: bigint;
    }
);

/**
 * Mints a specified amount of tokens to the given address.
 *
 * @param contract - The ThirdwebContract instance.
 * @param params - The minting options.
 * @returns A promise that resolves to the transaction result.
 */
export function mintTo(contract: ThirdwebContract, params: MintToParams) {
  return transaction(contract, {
    address: contract.address,
    chainId: contract.chainId,
    method: "function mintTo(address to, uint256 amount)",
    params: async () => {
      let amount: bigint;
      if ("amount" in params) {
        // if we need to parse the amount from ether to gwei then we pull in the decimals extension
        const { decimals } = await import("../read/decimals.js");
        // if this fails we fall back to `18` decimals
        const d = await decimals(contract).catch(() => 18);
        // turn ether into gwei
        amount = parseUnits(params.amount.toString(), d);
      } else {
        amount = params.amountGwei;
      }
      return [params.to, amount] as const;
    },
  });
}
