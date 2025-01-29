import { useEffect, useState } from "react";
import { fetchTxActivity } from "../actions/fetchTxActivity";

interface TxActivityItem {
    id: string;
    // all txs we retrieve for now are outgoing
    // TODO: add incoming
    type: "out" | "in";
    amount: string;
    to?: string;
    from?: string;
    method?: string;
    date: string;
  }

export function useGetTxActivity(chainId: number, address: string) {
  const [txActivity, setTxActivity] = useState<TxActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await fetchTxActivity({ chainId, address });
      const activity = response.map((tx): TxActivityItem => {
        let type = tx.to_address?.toLowerCase() === address.toLowerCase() ? "in" : "out";
        return {
          id: tx.hash,
          type,
          amount: `${tx.value / Math.pow(10, 18)} ETH`,
          to: tx.to_address || undefined,
          from: tx.from_address,
          method: tx.function_selector || undefined,
          date: new Date(tx.block_timestamp * 1000).toLocaleString(),
        };
      })
      setTxActivity(activity);
      setIsLoading(false);
    })();
  }, [address, chainId]);

  return { txActivity, isLoading };
}
