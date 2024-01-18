import { transaction } from "../../transaction/index.js";
import type { ThirdwebContract } from "../../contract/index.js";
import { read } from "../../transaction/actions/read.js";

type BalanceOfParams = { address: string };

export async function balanceOf(
  contract: ThirdwebContract,
  options: BalanceOfParams,
) {
  return read(
    transaction(contract, {
      address: contract.address,
      chainId: contract.chainId,
      method: "function balanceOf(address) view returns (uint256)",
      params: [options.address],
    }),
  );
}
