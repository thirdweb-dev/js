import { useQuery } from "@tanstack/react-query";

export type GasEstimate = { gasPrice: number; ethPrice: number };

export function useGas() {
  return useQuery(
    ["gas-price", "ethereum"],
    async () => {
      const res = await fetch(`/api/gas`);
      return res.json() as Promise<GasEstimate>;
    },
    {
      refetchInterval: 10000,
    },
  );
}
