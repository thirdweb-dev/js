import type { Chain } from "@thirdweb-dev/chains";
import { createClient } from "../client";
import { Address } from "viem";

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

export function getERC20Balance({
  chain,
  address,
  tokenAddress,
}: {
  chain: Chain;
  address: string;
  tokenAddress: string;
}) {
  return createClient(chain).readContract({
    address: tokenAddress as Address,
    abi: ERC20_BALANCE_OF,
    functionName: "balanceOf",
    args: [address as Address],
  });
}
