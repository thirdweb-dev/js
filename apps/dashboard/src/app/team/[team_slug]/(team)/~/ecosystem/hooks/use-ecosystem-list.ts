import { apiServerProxy } from "@/actions/proxies";
import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";
import type { Ecosystem } from "../types";

export function useEcosystemList({
  teamIdOrSlug,
}: {
  teamIdOrSlug: string;
}) {
  const address = useActiveAccount()?.address;
  return useQuery({
    queryKey: ["ecosystems", teamIdOrSlug, address],
    queryFn: async () => {
      const res = await apiServerProxy({
        pathname: `/v1/teams/${teamIdOrSlug}/ecosystem-wallet`,
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(res.error ?? "Failed to fetch ecosystems");
      }

      const data = res.data as { result: Ecosystem[] };
      return data.result;
    },
    retry: false,
  });
}
