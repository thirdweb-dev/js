import { useEffect, useState } from "react";
import { createThirdwebClient, defineChain } from "thirdweb";
import { eth_getBalance, getRpcClient } from "thirdweb/rpc";

interface UseBalanceResult {
  balance: bigint;
  isLoading: boolean;
  error: Error | null;
}

export function useBalance(chainId: number, address: string): UseBalanceResult {
  const [balance, setBalance] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        setIsLoading(true);
        setError(null);
        const client = createThirdwebClient({
          clientId: process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID,
        });
        const rpcRequest = getRpcClient({
          client,
          chain: defineChain(chainId),
        });
        const result = await eth_getBalance(rpcRequest, { address });
        setBalance(result);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch balance"),
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (address) {
      fetchBalance();
    }
  }, [address, chainId]);

  return { balance, isLoading, error };
}
