import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";
import { apiServerProxy } from "@/actions/proxies";
import type { Ecosystem } from "../types";

export function useEcosystemList({ teamIdOrSlug }: { teamIdOrSlug: string }) {
  const address = useActiveAccount()?.address;
  return useQuery({
    queryFn: async () => {
      const res = await apiServerProxy({
        method: "GET",
        pathname: `/v1/teams/${teamIdOrSlug}/ecosystem-wallet`,
      });

      if (!res.ok) {
        throw new Error(res.error ?? "Failed to fetch ecosystems");
      }

      const data = res.data as { result: Ecosystem[] };
      return data.result;
    },
    queryKey: ["ecosystems", teamIdOrSlug, address],
    retry: false,
  });
}
