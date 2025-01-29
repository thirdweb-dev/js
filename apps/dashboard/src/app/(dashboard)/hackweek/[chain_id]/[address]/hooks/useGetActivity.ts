import { useEffect, useState } from "react";
import { fetchActivity } from "../actions/fetchActivity";

interface ActivityItem {
    id: string;
    type: string;
    amount: string;
    to?: string;
    from?: string;
    contract?: string;
    method?: string;
    date: string;
  }

export function useGetActivity(chainId: number, address: string) {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await fetchActivity({ chainId, address, page: "0" });
      const activity = response.data.map((tx): ActivityItem => {
        let type = tx.to_address?.toLowerCase() === address.toLowerCase() ? "Receive" : "Send";
        if (tx.contract_address) {
            type = "Interact";
        }
        return {
          id: tx.hash,
          type,
          amount: `${tx.value / Math.pow(10, 18)} ETH`,
          to: tx.to_address || undefined,
          from: tx.from_address,
          contract: tx.contract_address || undefined,
          date: new Date(tx.block_timestamp * 1000).toLocaleString(),
        };
      })
      setActivity(activity);
      setIsLoading(false);
    })();
  }, [address, chainId]);

  return { activity, isLoading };
}
