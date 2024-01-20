import { transaction } from "../../../transaction/index.js";
import type { ThirdwebContract } from "../../../contract/index.js";
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
 * Transfers ERC20 tokens from the contract to the specified address.
 *
 * @param contract - The ERC20 contract instance.
 * @param options - The transfer options.
 * @returns A promise that resolves to the transaction result.
 */
export function transfer(contract: ThirdwebContract, options: TransferParams) {
  return transaction(contract, {
    address: contract.address,
    chainId: contract.chainId,
    method: "function transfer(address to, uint256 value)",
    params: async () => {
      let amount: bigint;
      if ("amount" in options) {
        // if we need to parse the amount from ether to gwei then we pull in the decimals extension
        const { decimals } = await import("../read/decimals.js");
        // if this fails we fall back to `18` decimals
        const d = await decimals(contract).catch(() => 18);
        // turn ether into gwei
        amount = parseUnits(options.amount.toString(), d);
      } else {
        amount = options.amountGwei;
      }
      return [options.to, amount] as const;
    },
  });
}
