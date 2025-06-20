import { useQuery } from "@tanstack/react-query";
import { apiServerProxy } from "@/actions/proxies";
import type { Ecosystem } from "../../../types";

export function useEcosystem({
  teamIdOrSlug,
  slug,
  refetchInterval,
  refetchOnWindowFocus,
  initialData,
}: {
  teamIdOrSlug: string;
  slug: string;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
  initialData?: Ecosystem;
}) {
  return useQuery({
    initialData,
    queryFn: async () => {
      const res = await apiServerProxy({
        method: "GET",
        pathname: `/v1/teams/${teamIdOrSlug}/ecosystem-wallet/${slug}`,
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const data = res.data as { result: Ecosystem };
      return data.result;
    },
    queryKey: ["ecosystems", teamIdOrSlug, slug],
    refetchInterval,
    refetchOnWindowFocus,
    retry: false,
  });
}
