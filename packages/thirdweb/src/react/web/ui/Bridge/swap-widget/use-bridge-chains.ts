import { useQuery } from "@tanstack/react-query";
import { chains } from "../../../../../bridge/index.js";
import type { ThirdwebClient } from "../../../../../client/client.js";

export function useBridgeChains(client: ThirdwebClient) {
  return useQuery({
    queryKey: ["bridge-chains"],
    queryFn: () => {
      return chains({ client });
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
