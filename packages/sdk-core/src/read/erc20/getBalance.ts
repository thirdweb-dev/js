import { resolvePossibleEnsNamesToAddresses } from "../ens/resolve";
import type { Client } from "viem";
import { readContract } from "viem/actions";

// snippet of *just* the erc20 balanceOf function abi
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
  viemClient,
  address,
  contractAddress,
}: {
  viemClient: Client;
  address: string;
  contractAddress: string;
}) {
  const [resolvedContractAddress, resolvedAddress] =
    await resolvePossibleEnsNamesToAddresses([contractAddress, address]);
  if (!resolvedContractAddress) {
    throw new Error(`Not a valid contractAddress: ${contractAddress}`);
  }
  if (!resolvedAddress) {
    throw new Error(`Not a valid address: ${address}`);
  }
  return readContract(viemClient, {
    address: resolvedContractAddress,
    abi: ERC20_BALANCE_OF,
    functionName: "balanceOf",
    args: [resolvedAddress],
  });
}
