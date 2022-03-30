import { useQuery } from "react-query";

export function useGas() {
  return useQuery(
    ["gas-price", "ethereum"],
    async () => {
      const res = await fetch(`/api/gas`);
      return res.json();
    },
    {
      refetchInterval: 10000,
    },
  );
}
