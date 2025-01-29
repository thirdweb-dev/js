import { useEffect, useState } from "react";
import { fetchTxActivity as getRecentTransactions } from "../actions/fetchTxActivity";
import { toEther } from "thirdweb/utils";

export interface TransactionDetails {
  id: string;
  type: "in" | "out";
  value: string;
  to?: string;
  from?: string;
  method?: string;
  date: string;
}

export function useGetRecentTransactions(chainId: number, address: string) {
  const [txActivity, setTxActivity] = useState<TransactionDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await getRecentTransactions({ chainId, address });
      const activity = response.map((tx): TransactionDetails => {
        const type =
          tx.to_address?.toLowerCase() === address.toLowerCase() ? "in" : "out";
        return {
          id: tx.hash,
          type,
          value: toEther(BigInt(tx.value)).toString(),
          to: tx.to_address || undefined,
          from: tx.from_address,
          method: tx.function_selector || undefined,
          date: new Date(tx.block_timestamp * 1000).toLocaleString(),
        };
      });
      setTxActivity(activity);
      setIsLoading(false);
    })();
  }, [address, chainId]);

  return { txActivity, isLoading };
}
