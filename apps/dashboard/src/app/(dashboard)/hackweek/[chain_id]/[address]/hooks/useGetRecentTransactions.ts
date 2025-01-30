import { useEffect, useState } from "react";
import { fetchRecentTransactions } from "../actions/fetchRecentTransactions";

export interface TransactionDetails {
  hash: string;
  type: "out" | "in";
  valueTokens: number;
  to?: string;
  from?: string;
  method?: string;
  date: Date;
}

export function useGetRecentTransactions(chainId: number, address: string) {
  const [transactions, setTransactions] = useState<TransactionDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await fetchRecentTransactions({ chainId, address });
      const activity = response.map((transaction): TransactionDetails => {
        const type =
          transaction.to_address?.toLowerCase() === address.toLowerCase()
            ? "in"
            : "out";
        return {
          hash: transaction.hash,
          type,
          valueTokens: transaction.value / 10 ** 18,
          to: transaction.to_address || undefined,
          from: transaction.from_address,
          method: transaction.function_selector || undefined,
          date: new Date(transaction.block_timestamp * 1000),
        };
      });
      setTransactions(activity);
      setIsLoading(false);
    })();
  }, [address, chainId]);

  return { transactions, isLoading };
}
