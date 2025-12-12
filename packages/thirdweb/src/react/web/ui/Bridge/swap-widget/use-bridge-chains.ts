import { useQuery } from "@tanstack/react-query";
import { chains } from "../../../../../bridge/index.js";
import type { ThirdwebClient } from "../../../../../client/client.js";

export function useBridgeChains(client: ThirdwebClient) {
  return useQuery({
    queryKey: ["bridge-chains"],
    queryFn: async () => {
      const data = await chains({ client });
      const dataCopy = [...data];
      // sort by name, but if name starts with number, put it at the end

      return dataCopy.sort((a, b) => {
        const aStartsWithNumber = a.name[0]?.match(/^\d/);
        const bStartsWithNumber = b.name[0]?.match(/^\d/);

        if (aStartsWithNumber && !bStartsWithNumber) {
          return 1;
        }

        if (!aStartsWithNumber && bStartsWithNumber) {
          return -1;
        }

        return a.name.localeCompare(b.name);
      });
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
