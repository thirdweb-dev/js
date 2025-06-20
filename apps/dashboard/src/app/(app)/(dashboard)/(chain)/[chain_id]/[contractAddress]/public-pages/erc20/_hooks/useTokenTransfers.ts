import { useQuery } from "@tanstack/react-query";
import { isProd } from "@/constants/env-utils";
import { NEXT_PUBLIC_DASHBOARD_CLIENT_ID } from "@/constants/public-envs";

export type TokenTransfersData = {
  from_address: string;
  to_address: string;
  contract_address: string;
  block_number: string;
  block_timestamp: string;
  log_index: string;
  transaction_hash: string;
  transfer_type: string;
  chain_id: number;
  token_type: string;
  amount: string;
};

export function useTokenTransfers(params: {
  chainId: number;
  contractAddress: string;
  page: number;
  limit: number;
}) {
  return useQuery({
    queryFn: async () => {
      const domain = isProd ? "thirdweb" : "thirdweb-dev";
      const url = new URL(
        `https://insight.${domain}.com/v1/tokens/transfers/${params.contractAddress}`,
      );

      url.searchParams.set("include_historical_prices", "true");
      url.searchParams.set("chain_id", params.chainId.toString());
      url.searchParams.set("include_holders", "true");
      url.searchParams.set("page", params.page.toString());
      url.searchParams.set("limit", params.limit.toString());
      url.searchParams.set("clientId", NEXT_PUBLIC_DASHBOARD_CLIENT_ID);

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(await res.text());
      }

      const json = await res.json();
      const data = json.data as TokenTransfersData[];
      return data;
    },
    queryKey: ["token-transfers", params],
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    retry: false,
    retryOnMount: false,
  });
}
