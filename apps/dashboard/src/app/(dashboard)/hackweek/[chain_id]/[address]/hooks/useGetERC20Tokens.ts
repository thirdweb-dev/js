import { useEffect, useState } from "react";
import { fetchERC20Tokens } from "../actions/fetchERC20Tokens";

export interface TokenDetails {
  name: string;
  symbol: string;
  contractAddress: string;
  decimals: number;
  balance: bigint;
  totalValueUsdCents?: number;
  firstTransferredDate?: string;
  lastTransferredDate?: string;
}

export function useGetERC20Tokens(chainId: number, address: string) {
  const [tokens, setTokens] = useState<TokenDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tokenData = await fetchERC20Tokens({ chainId, address });
      setTokens(tokenData);
      setIsLoading(false);
    })();
  }, [address, chainId]);

  return { tokens, isLoading };
}
