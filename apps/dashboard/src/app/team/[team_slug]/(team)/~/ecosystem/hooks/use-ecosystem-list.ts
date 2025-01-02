import { useQuery } from "@tanstack/react-query";
import { THIRDWEB_API_HOST } from "constants/urls";
import { useActiveAccount } from "thirdweb/react";
import type { Ecosystem } from "../types";

export function useEcosystemList() {
  const address = useActiveAccount()?.address;
  const ecosystemQuery = useQuery({
    queryKey: ["ecosystems", address],
    queryFn: async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/ecosystem-wallet/list`);

      if (!res.ok) {
        const data = await res.json();
        console.error(data);
        throw new Error(data?.error?.message ?? "Failed to fetch ecosystems");
      }

      const data = (await res.json()) as { result: Ecosystem[] };
      return data.result;
    },
    retry: false,
  });

  return {
    ...ecosystemQuery,
    isPending: ecosystemQuery.isPending,
    ecosystems: (ecosystemQuery.data ?? []) satisfies Ecosystem[],
  };
}
