import { resolvePossibleEnsNamesToAddresses } from "../ens/resolve";
import type { Client } from "viem";
import { readContract } from "viem/actions";

// snipped of *just* the erc20 balanceOf function abi
const ERC20_BALANCE_OF = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export async function getERC20Balance({
  client,
  address,
  tokenAddress,
}: {
  client: Client;
  address: string;
  tokenAddress: string;
}) {
  const [resolvedTokenAddress, resolvedAddress] =
    await resolvePossibleEnsNamesToAddresses([tokenAddress, address]);
  if (!resolvedTokenAddress) {
    throw new Error(`Not a valid tokenAddress: ${tokenAddress}`);
  }
  if (!resolvedAddress) {
    throw new Error(`Not a valid address: ${address}`);
  }
  return readContract(client, {
    address: resolvedTokenAddress,
    abi: ERC20_BALANCE_OF,
    functionName: "balanceOf",
    args: [resolvedAddress],
  });
}
