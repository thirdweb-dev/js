import type { Chain } from "@thirdweb-dev/chains";
import { createClient } from "../client";
import { resolvePossibleEnsNamesToAddresses } from "../ens/resolve";

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
  chain,
  address,
  tokenAddress,
}: {
  chain: Chain;
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
  return createClient(chain).readContract({
    address: resolvedTokenAddress,
    abi: ERC20_BALANCE_OF,
    functionName: "balanceOf",
    args: [resolvedAddress],
  });
}
