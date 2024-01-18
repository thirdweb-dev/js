import { transaction } from "../../../transaction/index.js";
import type { ThirdwebContract } from "../../../contract/index.js";
import { read } from "../../../transaction/actions/read.js";
import { decimals } from "./decimals.js";
import { formatUnits } from "viem/utils";
import { symbol } from "./symbol.js";

type BalanceOfParams = { address: string };

export async function balanceOf(
  contract: ThirdwebContract,
  options: BalanceOfParams,
) {
  const [balanceWei, decimals_, symbol_] = await Promise.all([
    read(
      transaction(contract, {
        address: contract.address,
        chainId: contract.chainId,
        method: "function balanceOf(address) view returns (uint256)",
        params: [options.address],
      }),
    ),
    decimals(contract),
    symbol(contract),
  ]);
  return {
    value: balanceWei,
    displayValue: formatUnits(balanceWei, decimals_),
    symbol: symbol_,
  };
}
