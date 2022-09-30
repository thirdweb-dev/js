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

/**
 * Get the token balance of a specified wallet
 * @param program - The token program to get the balance on
 * @param walletAddress - The address of the wallet to get the balance of
 *
 * @example
 * ```jsx
 * import { useProgram, useTokenBalance } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const program = useProgram("{{program_address}}");
 *   const { data: balance, isLoading } = useTokenBalance(program, "{{wallet_address}}");
 *
 *   return (
 *     <p>{balance}</p>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useTokenBalance(
  program: RequiredParam<Token>,
  walletAddress: RequiredParam<string>,
) {
  return useQuery(tokenBalanceQuery(program, walletAddress));
}
