import type { ThirdwebContract } from "../../../contract/index.js";
import { read } from "../../../transaction/actions/read.js";
import { decimals } from "./decimals.js";
import { formatUnits } from "viem";
import { symbol } from "./symbol.js";

type BalanceOfParams = { address: string };

/**
 * Retrieves the balance of a specific address for a given ERC20 contract.
 * @param contract - The ERC20 contract instance.
 * @param params - The parameters for retrieving the balance.
 * @returns An object containing the balance information.
 */
export async function balanceOf(
  contract: ThirdwebContract,
  params: BalanceOfParams,
) {
  const [balanceWei, decimals_, symbol_] = await Promise.all([
    read(contract, {
      address: contract.address,
      chainId: contract.chainId,
      method: "function balanceOf(address) view returns (uint256)",
      params: [params.address],
    }),
    decimals(contract),
    symbol(contract),
  ]);
  return {
    value: balanceWei,
    displayValue: formatUnits(balanceWei, decimals_),
    symbol: symbol_,
  };
}
