import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useQuery } from "@tanstack/react-query";
import { Token } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function tokenBalanceQuery(
  program: RequiredParam<Token>,
  walletAddress: RequiredParam<string>,
) {
  return {
    queryKey: createSOLProgramQueryKey(program, [
      "balanceOf",
      { walletAddress },
    ] as const),
    queryFn: async () => {
      invariant(program, "program is required");

      invariant(walletAddress, "Wallet address is required");
      return await program.balanceOf(walletAddress);
    },
    enabled: !!program && !!walletAddress,
  };
}

export function useTokenBalance(
  program: RequiredParam<Token>,
  walletAddress: RequiredParam<string>,
) {
  return useQuery(tokenBalanceQuery(program, walletAddress));
}
