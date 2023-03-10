import { getSignerAndProvider } from "../core/classes/rpc-connection-handler";
import { NetworkInput } from "../core/types";
import { AddressOrEns } from "../schema/shared";
import type { IERC20 } from "@thirdweb-dev/contracts-js";
import IERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import { Contract, BigNumber } from "ethers";

export type GetBalanceParams = {
  network: NetworkInput;
  contractAddress: AddressOrEns;
  walletAddress: AddressOrEns;
};

export async function getBalance(params: GetBalanceParams): Promise<BigNumber> {
  const [, provider] = getSignerAndProvider(params.network, {});
  const contract = new Contract(
    params.contractAddress,
    IERC20Abi,
    provider,
  ) as IERC20;
  const [balance] = await contract.functions.balanceOf(params.walletAddress);
  return balance;
}
